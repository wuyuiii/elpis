const path = require("path")
const { merge } = require("webpack-merge")
// 热更新
const { HotModuleReplacementPlugin } = require("webpack")
// 获取基类配置
const webpackBaseConfig = require("./webpack.base")

const currentENV = process.env._ENV

// dev-server 配置
const DEV_SERVER_CONFIG = {
	HOST: "127.0.0.1",
	PORT: "9002",
	HMR_PATH: "__webpack_hmr", // 官方规定
	TIMEOUT: 20000,
}

const { HOST, PORT, HMR_PATH, TIMEOUT } = DEV_SERVER_CONFIG

// 开发阶段的 entry 配置需要加入hmr
Object.keys(webpackBaseConfig.entry).forEach((key) => {
	// 第三方包不作为hmr
	if (key !== "vendor") {
		webpackBaseConfig.entry[key] = [
			// 主入口文件
			webpackBaseConfig.entry[key],
			// hmr更新入口，官方指定的 hmr路径
			`webpack-hot-middleware/client?path=http://${HOST}:${PORT}/${HMR_PATH}&timeout=${TIMEOUT}&reload=true`,
		]
	}
})

// 使用webpack-merge 合并基础配置和生产配置
const webpackTestConfig = merge(webpackBaseConfig, {
	mode: "development", // 指定开发模式
	// 产物输出配置，因为开发和生产环境输出不一致，所以在各自环境中配置
	output: {
		filename: "js/[name]_[chunkhash:8].bundle.js",
		path: path.join(process.cwd(), `./app/public/dist/${currentENV}`),
		publicPath: `http://${HOST}:${PORT}/public/dist/${currentENV}`,
		crossOriginLoading: "anonymous",
		globalObject: "this",
	},
	// 开发阶段插件
	plugins: [
		// HMR 模块热更新
		new HotModuleReplacementPlugin({
			multiStep: false,
		}),
	],
})

module.exports = {
	// webpack 配置
	webpackTestConfig,
	// devServer 配置，暴露给 devServer.js使用
	DEV_SERVER_CONFIG,
}
