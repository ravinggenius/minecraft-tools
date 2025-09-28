import { defineConfig } from "i18next-cli";

import { SUPPORTED_LOCALES } from "@/i18n/settings";

export default defineConfig({
	locales: [...SUPPORTED_LOCALES],
	extract: {
		input: "src/**/*.{js,jsx,ts,tsx}",
		output: "src/i18n/locales/{{language}}/{{namespace}}.json"
	}
});
