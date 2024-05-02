import { resolve } from "path";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
	plugins: [libInjectCss()],
	build: {
		lib: {
			entry: [resolve(__dirname, "lib/main.ts")],
			formats: ["es"],
			fileName: "custom-snap",
		},
	},
});
