import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	allConfig: js.configs.all, // optional unless you're using "eslint:all"
	baseDirectory: __dirname, // optional; default: process.cwd()
	recommendedConfig: js.configs.recommended, // optional unless you're using "eslint:recommended"
	resolvePluginsRelativeTo: __dirname // optional
});

export default [
	...compat.extends("next/core-web-vitals", "prettier"),

	...compat.env({
		es2020: true,
		node: true
	}),

	...compat.plugins("@c-ehrlich/eslint-plugin-use-server", "sql"),

	...compat.config({
		rules: {
			"@c-ehrlich/use-server/no-top-level-use-server": ["error"],
			"import/no-anonymous-default-export": ["off"],
			"sql/format": [
				"off",
				{},
				{
					language: "postgresql",
					useTabs: true
				}
			],
			"sql/no-unsafe-query": [
				"error",
				{
					allowLiteral: false
				}
			]
		}
	})
];
