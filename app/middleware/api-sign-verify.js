const md5 = require("md5")

/**
 * API 签名合法性校验中间件
 * @param {*} app koa实例
 * @returns
 */
module.exports = (app) => {
	return async (ctx, next) => {
		if (!ctx.path.includes("/api")) {
			return await next()
		}

		// 只对api请求做签名校验
		const { path, method } = ctx
		const { headers } = ctx.request
		const { s_sign: sSgin, s_t: st } = headers

		const signKey = "ichliichl123asd"
		const signature = md5(`${signKey}_${st}`)
		app.logger.info(`[SignVerify -- ${method} | ${path}] signature:${signature}`)

		if (!sSgin || !st || signature !== sSgin.toLowerCase() || Date.now() - st > 300 * 1000) {
			ctx.status = 403
			ctx.body = {
				sucess: false,
				message: "api请求异常, 签名错误",
				code: 10002,
			}
			return
		}

		await next()
	}
}
