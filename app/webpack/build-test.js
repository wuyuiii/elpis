// 本地开发启动 devServer
const path = require("path")
const consoler = require("consoler")
const express = require("express")
const webpack = require("webpack")
const devMiddleware = require("webpack-dev-middleware")
const hotMiddleware = require("webpack-hot-middleware")
const { DEV_SERVER_CONFIG, webpackTestConfig } = require("./config/webpack.test")

const app = express()

const compiler = webpack(webpackTestConfig)

// 指定静态文件目录
app.use(express.static(path.join(__dirname, "../public/dist")))
// 引用 devMiddleware 中间件（监控文件改动）
app.use(
	devMiddleware(compiler, {
		// 落地文件
		writeToDisk: (filePath) => filePath.endsWith(".tpl"),
		// 资源路径
		publicPath: webpackTestConfig.output.publicPath,
		// headers 配置
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
		},
		stats: {
			colors: true,
		},
	}),
)
// 引用 hotMiddleware 中间件（实现热更新通讯）
app.use(
	hotMiddleware(compiler, {
		path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
		log: () => {},
	}),
)

consoler.info("等待webpack初次构建完成提示...")

app.listen(DEV_SERVER_CONFIG.PORT, () => {
	console.log(`app listenting on port ${DEV_SERVER_CONFIG.PORT}`)
})
