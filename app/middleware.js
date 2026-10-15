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

	// 静态资源托管 — 让 webpack 产出的 /dist/...js、/dist/...css 等能被直接访问
	// (必须放在 router 之前,否则会被 router 的 *splat 兜底吞掉)
	const koaStatic = require("koa-static")
	app.use(
		koaStatic(path.resolve(process.cwd(), "./app/public"), {
			// 不重定向尾斜杠,避免把 /dist/prod 重定向到 /
			redirect: false,
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
