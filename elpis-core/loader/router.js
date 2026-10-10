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
	// 处理路由兜底 -- 健壮性
	// path-to-regexp@8 不再支持裸 "*", 改用命名通配符 "*splat"
	router.get("*splat", async (ctx, _next) => {
		ctx.status = 302 // 临时重定向
		ctx.redirect(String(app?.options?.homePath) || "/")
	})
	// 路由注册到app上
	app.use(router.routes())
	app.use(router.allowedMethods())

	console.log("-- [router Loader] load end --")
}
