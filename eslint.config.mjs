import js from "@eslint/js"
import globals from "globals"
import pluginVue from "eslint-plugin-vue"
import pluginImport from "eslint-plugin-import"
import { defineConfig } from "eslint/config"

export default defineConfig([
	{
		ignores: ["node_modules/**", "dist/**", "build/**", ".husky/**"],
	},
	// 基础 JS 规则（前后端共用,ESM 解析,适用于 .js / .mjs）
	{
		files: ["**/*.{js,mjs}"],
		plugins: { js, import: pluginImport },
		extends: [js.configs.recommended],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			sourceType: "module",
		},
		rules: {
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			"no-console": "off",
			"import/order": ["warn", { "newlines-between": "always" }],
		},
	},
	// CommonJS 后端脚本（仅 .cjs,例如可能的 .cjs 配置文件）
	{
		files: ["**/*.cjs"],
		languageOptions: {
			sourceType: "commonjs",
			globals: { ...globals.node },
		},
	},
	// 前端（Vue3 SFC）
	{
		files: ["**/*.vue"],
		plugins: { vue: pluginVue },
		extends: [js.configs.recommended, ...pluginVue.configs["flat/recommended"]],
		languageOptions: {
			globals: { ...globals.browser },
			parserOptions: { ecmaVersion: "latest", sourceType: "module" },
		},
	},
])
