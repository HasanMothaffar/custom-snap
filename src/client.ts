import { CustomSnap } from "../lib/main";

const easingInputs = document.querySelectorAll<HTMLInputElement>('input[name="easing_preset"]');
const snapDurationRange = document.querySelector('input[name="snap_duration"]') as HTMLElement;
const snapDurationLabel = document.querySelector(".snap-duration-label") as HTMLElement;

const scrollInstance = new CustomSnap({
	container: document.querySelector("#container") as HTMLElement,
	snapDuration: 3000,
});

scrollInstance.register();

easingInputs.forEach((input) =>
	input.addEventListener("change", (e: any) => {
		const newEasingPreset = e.target.value;
		scrollInstance.setEasing(newEasingPreset);
	})
);

snapDurationRange.addEventListener("input", (e: any) => {
	const newSnapDuration = e.target.value;
	scrollInstance.setSnapDuration(newSnapDuration);
	snapDurationLabel.textContent = `${newSnapDuration}ms`;
});
