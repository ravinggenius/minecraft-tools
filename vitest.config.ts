import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true
	},
	test: {
		environment: "jsdom",
		include: ["**/*.test.?(c|m)[jt]s?(x)"],
		name: "minecraft-tools",
		sequence: {
			shuffle: true
		}
	}
});
