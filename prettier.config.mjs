/**
 * @type {import("prettier").Config}
 */
const core = {
	plugins: ["@trivago/prettier-plugin-sort-imports"],
	quoteProps: "consistent",
	semi: true,
	tabWidth: 4,
	useTabs: true,
	trailingComma: "none",
	overrides: [
		{
			files: ["*.json", "*.md", "*.mdx", "*.toml", "*.yaml", "*.yml"],
			options: {
				tabWidth: 2,
				useTabs: false
			}
		}
	]
};

/**
 * @type {import("@trivago/prettier-plugin-sort-imports").PluginConfig}
 */
const importOrder = {
	importOrder: ["^@/(.*)$", "^../", "^./"],
	importOrderCaseInsensitive: true,
	importOrderSeparation: true,
	importOrderSortSpecifiers: true
};

export default {
	...core,
	...importOrder
};
