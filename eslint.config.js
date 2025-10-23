import useServer from "@c-ehrlich/eslint-plugin-use-server";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import sql from "eslint-plugin-sql";

export default [
	js.configs.recommended,
	nextPlugin.configs["core-web-vitals"],
	prettier,
	{
		plugins: {
			react,
			sql,
			"@c-ehrlich/use-server": useServer
		},
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: {
				node: true
			}
		},
		rules: {
			"@c-ehrlich/use-server/no-top-level-use-server": "error",
			"import/no-anonymous-default-export": "off",
			"react/jsx-no-leaked-render": [
				"error",
				{ validStrategies: ["ternary"] }
			],
			"sql/format": [
				"off",
				{},
				{ language: "postgresql", useTabs: true }
			],
			"sql/no-unsafe-query": ["error", { allowLiteral: false }]
		}
	}
];
