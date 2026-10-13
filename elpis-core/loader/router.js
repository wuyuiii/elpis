const path = require("path")
const KoaRouter = require("koa-router")
const { globSync } = require("glob")
/**
 * router Loader
 * @param {object} app koa 实例
 *
 * 解析 app/router 下的所有js文件，加载到KoaRouter
 */
module.exports = (app) => {
	console.log("-- [router Loader] load start --")
	// 找到所有路由文件
	const fileList = globSync("app/router/**/*.js")
	// 实例化KoaRouter
	const router = new KoaRouter()
	// 注册所有路由
	fileList.forEach((file) => {
		/**
		 * app下的router文件实现
		 *
		 * module.exports = (app,router)=>{
		 *  router.get('xxx',xxx)
		 * }
		 */
		require(path.resolve(file))(app, router)
	})
	// 静态资源请求不应进入 router
	// (koa-static 只在文件存在时短路,文件不存在时仍会走到这里;
	//  这里加一个守卫:凡是 URL 最后一段带扩展名(.js/.css/.png/...),
	//  直接视为"未找到的静态资源",不再被 *splat 吞掉去 302 重定向到 /)
	//  必须放在 router.routes() 之前,否则请求已经被 router 吃掉了
	app.use(async (ctx, next) => {
		const last = ctx.path.slice(ctx.path.lastIndexOf("/") + 1)
		if (last.includes(".")) {
			ctx.status = 404
			return
		}
		await next()
	})
	// 处理路由兜底 -- 健壮性
	// path-to-regexp@8 不再支持裸 "*", 改用命名通配符 "*splat"
	router.get("*splat", async (ctx, _next) => {
		ctx.status = 302 // 临时重定向
		ctx.redirect(String(app?.options?.homePath) || "/")
	})
	// 路由注册到 app 上
	app.use(router.routes())
	app.use(router.allowedMethods())

	console.log("-- [router Loader] load end --")
}
