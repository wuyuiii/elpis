/**
 * 自定义 运行时异常处理，兜底所有异常
 * @param {*} app koa实例
 *
 *
 */
module.exports = (app) => {
	return async (ctx, next) => {
		try {
			await next()
		} catch (e) {
			// 异常处理
			const { message } = e

			// 输入到日志文件中
			app.logger.error("[Exception]", e)
			app.logger.error("[Exception--message]", message)

			// 区分页面错误请求 和 api请求
			if (message && message.includes("template not found")) {
				// 页面重定向处理
				ctx.status = 302 // 临时重定向
				ctx.redirect(`${app.options?.homePath}`)
				return
			}
			// api错误统一返回
			ctx.status = 500
			ctx.body = {
				sucess: false,
				message: "网络异常，请重试",
				code: 10001,
			}
		}
	}
}
