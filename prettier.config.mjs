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

/**
 * @type {import("prettier-plugin-embed").PluginEmbedOptions}
 */
const embed = {
	// embeddedSqlTags: ["sql.type"]
	embeddedSqlTags: ["sql.fragment", "sql.type"]
};

/**
 * @type {import("prettier-plugin-sql").SqlBaseOptions}
 */
const sql = {
	keywordCase: "upper",
	language: "postgresql"
};

export default {
	...core,
	...importOrder,
	...embed,
	...sql
};
