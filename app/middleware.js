const path = require("path")
/**
 * 全局中间件
 * @param {*} app koa实例
 */
module.exports = (app) => {
	// 模板渲染引擎
	const koaNunjucks = require("koa-nunjucks-2")
	app.use(
		koaNunjucks({
			ext: "tpl",
			path: path.resolve(process.cwd(), "./app/public"),
			nunjucksConfig: {
				noCache: true,
				trimBlocks: true,
			},
		}),
	)

	// 引入ctx.body 解析中间件
	const bodyParser = require("koa-bodyparser")
	app.use(
		bodyParser({
			formLimit: "1000mb",
			enableTypes: ["form", "json", "text"],
		}),
	)

	// 引入异常处理中间件
	app.use(app.middlewares.errorHandler)
	// 引入api签名校验中间件
	app.use(app.middlewares.apiSignVerify)
	// 引入api参数校验中间件
	app.use(app.middlewares.apiParamsVerify)
}
