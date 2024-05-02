import { EASINGS } from "./easings";
import { CustomSnapProps, EasingPreset, EventCallback, ScrollDirection } from "./types";
import "./styles.css";

export class CustomSnap {
	private sections!: HTMLElement[];

	private isRegistered = false;
	private scrollLock = false;
	private lastScrollPosition = 0;
	private currentSectionIndex = 0;

	private snapDuration = 1000;
	private easing!: EasingPreset;
	private scrollDirection: ScrollDirection = "";

	private afterSnap!: EventCallback;
	private beforeSnap!: EventCallback;

	constructor({
		container,
		hideScrollbar = false,
		snapDuration = 1000,
		easing = "easeInOutQuad",
		afterSnap = () => {},
		beforeSnap = () => {},
	}: CustomSnapProps) {
		this.snapDuration = snapDuration;
		this.easing = easing;
		this.afterSnap = afterSnap;
		this.beforeSnap = beforeSnap;

		this.sections = Array.from(container.children).map((child) => child as HTMLElement);

		if (hideScrollbar) this.hideScrollbar();
		this.onScroll = this.onScroll.bind(this);
	}

	private calculateScrollDirection(): void {
		/**
		 * Why `margin`? Because sometimes the values of the last scroll position and current one might be too close,
		 * and so even if the user did not scroll, the library would trigger a snap between sections.
		 *
		 * Unless the gap between the two scroll positions is at least equal to `margin`, I don't want to trigger snapping.
		 *
		 * Note that `margin` is just an arbitrary value that should be smaller than 5
		 */
		const margin = 3;

		let direction: ScrollDirection = "";
		if (window.scrollY - this.lastScrollPosition > margin) {
			direction = "top-to-bottom";
		} else if (window.scrollY - this.lastScrollPosition < -margin) {
			direction = "bottom-to-top";
		}

		this.scrollDirection = direction;
	}

	private onScroll(): void {
		if (this.scrollLock) return;

		this.calculateScrollDirection();
		this.lastScrollPosition = window.scrollY;

		const currentSection = this.sections[this.currentSectionIndex];
		if (!currentSection) return;

		const isWindowIntersectingWithNextSection =
			window.scrollY + window.innerHeight > currentSection.offsetTop + currentSection.offsetHeight - 2;

		const isWindowIntersectingWithPreviousSection = window.scrollY - currentSection.offsetTop < -2;

		if (
			isWindowIntersectingWithNextSection &&
			this.scrollDirection == "top-to-bottom" &&
			this.currentSectionIndex < this.sections.length - 1
		) {
			this.scrollToSectionByIndex(this.currentSectionIndex + 1);
		} else if (isWindowIntersectingWithPreviousSection && this.scrollDirection == "bottom-to-top" && this.currentSectionIndex >= 1) {
			this.scrollToSectionByIndex(this.currentSectionIndex - 1);
		}
		return;
	}

	private scrollTo(to: number, duration = 1000, easing: EasingPreset): Promise<void> {
		this.disableScroll();

		const startingPosition = window.scrollY;
		const destinationPosition = to - startingPosition;

		const startTime = performance.now();

		return new Promise((resolve) => {
			const animateScroll = (timestamp: DOMHighResTimeStamp) => {
				const elapsedTime = timestamp - startTime;
				const animationProgress = EASINGS[easing](elapsedTime, startingPosition, destinationPosition, duration);

				document.documentElement.scrollTop = animationProgress;
				document.body.scrollTop = animationProgress;

				// Continue animation loop
				if (elapsedTime < duration) {
					return requestAnimationFrame(animateScroll);
				}

				/**
				 * Sometimes, window.scrollY is not exactly equal to the value
				 * of the `to` parameter -- there are off by 1 pixel errors that cause
				 * infinite bouncing between sections.
				 *
				 * I guess it's caused by the easing functions or the
				 * `elapsedTime < duration` branch.
				 *
				 * It's important for the window.scrollY to be equal to `to` in
				 * order to prevent errors in determining the scrollDirection
				 *
				 */
				if (window.scrollY < to) {
					window.scrollBy(0, to - window.scrollY);
				} else if (window.scrollY > to) {
					window.scrollBy(0, -1 * (window.scrollY - to));
				}

				// Animation is done, and window.scrollY should be equal to `to`
				resolve(undefined);
				this.enableScroll();
			};

			requestAnimationFrame(animateScroll);
		});
	}

	private preventDefault(e: Event) {
		e.preventDefault();
	}

	private disableScroll() {
		this.scrollLock = true;
		window.addEventListener("wheel", this.preventDefault, { passive: false });
		window.addEventListener("touchstart", this.preventDefault, { passive: false });
	}

	private enableScroll() {
		this.scrollLock = false;
		window.removeEventListener("wheel", this.preventDefault);
		window.removeEventListener("touchstart", this.preventDefault);
		return (document.onkeydown = null);
	}

	public getScrollDirection(): ScrollDirection {
		return this.scrollDirection;
	}

	public setSnapDuration(duration: number) {
		if (duration <= 0) throw new Error("custom-snap: Snap duration must be greater than 0.");
		this.snapDuration = duration;
	}

	public setEasing(preset: EasingPreset) {
		this.easing = preset;
	}

	/**
	 * Hides the browser's scrollbar using CSS
	 */
	public hideScrollbar(): void {
		document.documentElement.classList.add("custom-snap--no-scrollbar");
		document.body.classList.add("custom-snap--no-scrollbar");
	}

	/**
	 * Shows the browser's scrollbar
	 */
	public showScrollbar(): void {
		document.documentElement.classList.remove("custom-snap--no-scrollbar");
		document.body.classList.remove("custom-snap--no-scrollbar");
	}

	/**
	 * Scrolls to a specific section over a period of time.
	 */
	public async scrollToSectionByIndex(index: number, duration = this.snapDuration): Promise<void> {
		const section = this.sections[index];
		if (!section) return;

		this.beforeSnap(this.currentSectionIndex, this.sections[this.currentSectionIndex]);

		this.currentSectionIndex = index;

		const destination = this.scrollDirection == "top-to-bottom" ? section.offsetTop : window.scrollY - window.innerHeight;
		this.lastScrollPosition = destination;

		await this.scrollTo(destination, duration, this.easing);
		this.afterSnap(this.currentSectionIndex, this.sections[this.currentSectionIndex]);
	}

	/**
	 * Registers the snap scroll event listener. Note that without invoking this function, all scrolling
	 * would be considered normal.
	 */
	public register(): void {
		if (this.isRegistered) {
			throw new Error("custom-snap: Scroll event listener is already registered.");
		}

		this.isRegistered = true;
		this.scrollToSectionByIndex(0, 1000);
		window.addEventListener("scroll", this.onScroll);
	}

	/**
	 * Removes the currently bound scroll event listener.
	 * After unregistering, all scrolling would be considered normal.
	 */
	public unregister(): void {
		if (!this.isRegistered) {
			throw new Error("custom-snap: Trying to unregister an event listener that is already unregistered.");
		}
		this.isRegistered = false;
		window.removeEventListener("scroll", this.onScroll);
	}
}
