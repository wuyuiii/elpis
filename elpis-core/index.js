const path = require("path")
const Koa = require("koa")
const env = require("./env")
const { sep } = path // 兼容不同操作系统的斜杠

// loader
const controllerLoader = require("./loader/controller")
const middlewareLoader = require("./loader/middleware")
const routerLoader = require("./loader/router")
const routerSchemaLoader = require("./loader/router-schema")
const serviceLoader = require("./loader/service")
const extendLoader = require("./loader/extend")
const configLoader = require("./loader/config")

module.exports = {
	/**
	 * 启动项目
	 * @param {*} options 项目配置
	 * options = {
	 * 		name 项目名称
	 * 		homePath 项目根地址
	 * }
	 */
	start(options) {
		// Koa实例
		const app = new Koa()

		// app配置
		app.options = options

		// app根路径
		app.baseDir = process.cwd()

		// 业务文件路径
		app.businessPath = path.resolve(app.baseDir, `.${sep}app`)

		// 初始化环境
		app.env = env()
		console.log(`-- [start] env: ${app.env.get()} --`)

		// 加载 middleware
		middlewareLoader(app)
		// 加载 routerSchema
		routerSchemaLoader(app)
		// 加载 config
		configLoader(app)
		// 加载 extend
		extendLoader(app)

		// 注册全局中间件
		try {
			console.log("-- [global middleware Loader] load start --")
			require(`${app.businessPath}${sep}middleware.js`)(app)
			console.log("-- [global middleware Loader] load done --")
		} catch {
			console.error("[Execption] there is no middleware file")
		}
		// 加载 service
		serviceLoader(app)
		// 加载 controller
		controllerLoader(app)
		// 注册 router 路由
		routerLoader(app)

		try {
			const port = process.env.PORT || 3000
			const host = process.env.IP || "localhost"
			app.listen(port, host)
			console.log(`Server running on : http://${host}:${port}`)
		} catch (e) {
			console.error(e)
		}
	},
}
