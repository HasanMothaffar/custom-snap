export type EasingPreset = "easeInOutQuad" | "easeInCubic" | "inOutQuintic";

export interface CustomSnapProps {
	/** Scroll container */
	container: HTMLElement;

	/** Whether to hide the browser's scrollbar or not */
	hideScrollbar?: boolean;

	/** Duration that scroll snapping takes in milliseconds */
	snapDuration?: number;

	/** Transition timing function that gets applied to snapping */
	easing?: EasingPreset;

	/** Callback to execute after snap scrolling is performed */
	afterSnap?: EventCallback;

	/** Callback to execute just before snap scrolling is performed */
	beforeSnap?: EventCallback;
}

export interface EventCallback {
	(id?: number, section?: HTMLElement | null): void;
}

export type ScrollDirection = "top-to-bottom" | "bottom-to-top" | "";
