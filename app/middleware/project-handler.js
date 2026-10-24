/**
 * project 数据处理
 * @param {*} app
 */
module.exports = (_app) => {
	return async (ctx, next) => {
		// 只对 业务API 进行projectKey处理

		if (!ctx.path.includes("/api/proj")) {
			return await next()
		}

		// 获取projectKey
		const { project_key: projectKey } = ctx.request.headers

		if (!projectKey) {
			ctx.status = 200
			ctx.body = {
				success: false,
				message: "project_key not found",
				code: 446,
			}
			return
		}

		ctx.projectKey = projectKey

		await next()
	}
}
