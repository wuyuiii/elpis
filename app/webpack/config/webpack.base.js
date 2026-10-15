const path = require("path")
const { globSync } = require("glob")
const { VueLoaderPlugin } = require("vue-loader")
const { ProvidePlugin, DefinePlugin } = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const AutoImport = require("unplugin-auto-import/webpack")
const Components = require("unplugin-vue-components/webpack")
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers")

// 动态构造entry和 htmlWebpackPlugin
const pageEntries = {}
const htmlWebpackPluginList = []

globSync("app/pages/**/main.js").forEach((file) => {
	const folder = file.split(path.sep)[2]

	if (!folder.includes(".js")) {
		// 构造entry
		pageEntries[folder] = path.resolve(process.cwd(), file)
		// 构造最终渲染的页面文件
		htmlWebpackPluginList.push(
			new HtmlWebpackPlugin({
				// 模板输出路径
				filename: path.resolve(process.cwd(), "./app/public/dist/", `${folder}.tpl`),
				// 指定使用的模板文件
				template: path.resolve(process.cwd(), "./app/view/index.tpl"),
				// 要注入的代码块
				chunks: [folder],
			}),
		)
	}
})

/**
 * webpack 基础配置
 */
module.exports = {
	// 入口路径配置
	entry: pageEntries,
	// 模块解析配置（决定了要加载解析哪些模块，以及用什么方式去解析）
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: {
					loader: "vue-loader",
				},
			},
			{
				test: /\.js$/,
				include: [
					// 只对业务代码进行babel，加快webpack打包速度
					path.resolve(process.cwd(), "./app/pages"),
				],
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.(png|jpe?g|gif)(\?.+)?$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 300,
						esModule: false,
					},
				},
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
					},
				],
			},
			{
				test: /\.less$/,
				use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "less-loader" }],
			},
			{
				test: /.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
				use: {
					loader: "file-loader",
				},
			},
		],
	},
	// 产物输出配置，因为开发和生产环境输出不一致，所以在各自环境中配置
	output: {},
	// 配置模块解析的具体行为（定义webpack在打包时，如何找到并解析具体模块）
	resolve: {
		extensions: [".js", ".vue", ".less", ".css"],
		alias: {
			$pages: path.resolve(process.cwd(), "./app/pages"),
			$common: path.resolve(process.cwd(), "./app/pages/common"),
			$store: path.resolve(process.cwd(), "./app/pages/store"),
			$components: path.resolve(process.cwd(), "./app/pages/components"),
		},
	},
	// 配置 webpack plugins
	plugins: [
		// 处理.vue文件，这个插件是必须的
		// 用于将定义过的其他规则复用到.vue文件中
		// 例如 /\.js$/ 的规则，会被复用到.vue文件中的 <script> 中
		new VueLoaderPlugin(),
		// 把第三方库暴露到 window对象上
		new ProvidePlugin({
			Vue: "vue",
			axios: "axios",
			_: "lodash",
		}),
		// 初始化全局常量
		new DefinePlugin({
			__VUE_OPTIONS_API__: "true", // 支持vue解析optionsAPI
			__VUE_PROD_DEVTOOLS__: "false", // 生产禁用vue调试工具
			__VUE_PROD_HYDRATION_MISMATCH_DETATLS__: "false", // 生产环境禁用 水合 信息显示
		}),
		// 构造最终渲染的页面模板
		...htmlWebpackPluginList,
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	// 配置打包输出优化（代码分割，合并，缓存，TreeShaking，压缩等优化策略）
	optimization: {
		/**
		 * 代码分包策略
		 * 1. vendor: 第三方库,基本不会改动,除非依赖版本升级
		 * 2. common: 业务代码中抽取出的公共组件或方法,改动较少
		 * 3. entry: 核心业务代码,改动较大
		 * 目的: 区分改动差异大小, 利用浏览器缓存等功能加快页面加载速度
		 */
		splitChunks: {
			chunks: "all", // 同步或异步模块都进行分割
			maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
			maxInitialRequests: 10, // 入口点的最大并行请求数
			cacheGroups: {
				vendor: {
					//第三方库
					test: /[\\/]node_modules[\\/]/,
					name: "vendor", // 模块名称
					priority: 20, // 优先级,数字越大优先级越高
					enforce: true, // 强制执行
					reuseExistingChunk: true, // 复用已有的公共chunk
				},
				common: {
					// 公共模块
					name: "common",
					minChunks: 2, // 指定被2个及以上引用的就是公共模块
					minSize: 1, // 最小分割文件大小 (测试 1byte)
					priority: 10, // 优先级
					reuseExistingChunk: true, // 复用已有的公共chunk
				},
			},
		},
		// webpack运行时单独拆分
		runtimeChunk: true,
	},
}
