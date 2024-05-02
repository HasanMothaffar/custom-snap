# Custom Snap - Minimal fullpage.js clone

[![npm version](https://badge.fury.io/js/custom-snap.svg)](https://badge.fury.io/js/custom-snap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A minimal (free) TypeScript clone of fullpage.js that allows both scroll snapping and native scrolling in different sections of your website.

**Demo link**: https://hasanmothaffar.github.io/custom-snap/

## Features

-   Lightweight and simple (0 dependencies)
-   Works with both fullpage sections (100vh) and variable height sections.
-   You can customize the snap scrolling's duration and easing presets

## Installation

```sh
npm install custom-snap
```

## Example usage

**HTML structure**

```html
<div id="container">
	<div class="section"></div>
	<div class="section"></div>
	<div class="section--long"></div>
	<div class="section"></div>
	<div class="section--long"></div>
	<div class="section"></div>
</div>
```

**CSS**

```css
/* Height values are arbitrary. You can choose any height you want */
.section {
	height: 100vh;
}

.section--long {
	height: 200vh;
}
```

**JS**

```js
import { CustomSnap } from "custom-snap";

const scrollInstance = new CustomSnap({
	container: document.querySelector("#container"),
});

scrollInstance.register();
```

## Options

| Key           | Description                                                      | Type            | Default value   |
| ------------- | ---------------------------------------------------------------- | --------------- | --------------- |
| container     | Scroll container                                                 | `HTMLElement`   | none            |
| hideScrollbar | Whether to hide the browser's scrollbar or not                   | `boolean`       | `false`         |
| snapDuration  | The duration that scroll snapping takes in milliseconds          | `number`        | `1000` (ms)     |
| easing        | The transition timing function that gets applied to snapping     | `EasingPreset`  | `easeInOutQuad` |
| afterSnap     | Callback that's executed after snap scrolling is performed       | `EventCallback` | `() => {}`      |
| beforeSnap    | Callback that's executed just before snap scrolling is performed | `EventCallback` | `() => {}`      |

## Instance methods

```ts
/**
 * Sets a new easing preset for snap scrolling
 */
setEasing(easing: EasingPreset): void

/**
 * Sets a new duration for snap scrolling
 */
setSnapDuration(duration = 1000): void

/**
 * Returns the scroll's direction
 */
getScrollDirection(): ScrollDirection

/**
 * Hides the browser's scrollbar using CSS
 */
hideScrollbar(): void

/**
 * Shows the browser's scrollbar
 */
showScrollbar(): void

/**
 * Scroll to the container's nth child over a period `duration` of time using index:
 *
 * first child => index = 0.
 * second child => index = 1.
 * Nth child => index = n - 1
 */
scrollToSectionByIndex(index: number, duration: number): void

/**
 * Enable scroll instance.
 */
register(): void

/**
 * Disable scroll instance.
 */
unregister(): void
```

## Types

```ts
type EasingPreset = "easeInOutQuad" | "easeInCubic" | "inOutQuintic";
type ScrollDirection = "top-to-bottom" | "bottom-to-top" | "";

interface EventCallback {
	(id?: number, section?: HTMLElement | null): void;
}
```

## Inspiration

-   https://gist.github.com/james2doyle/5694700
-   https://github.com/tarun-dugar/easy-scroll
-   https://github.com/alvarotrigo/fullPage.js
-   https://github.com/geomolenaar/LeScroll

## Credits

-   [Linkedin Account](https://www.linkedin.com/in/hasan-mothaffar-0a55301b0/)
-   [GitHub Account](https://github.com/HasanMothaffar)
