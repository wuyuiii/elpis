const Ajv = require("ajv")
const ajv = new Ajv()

/**
 * API 参数校验中间件
 * @param {*} app koa实例
 * @returns
 */
module.exports = (app) => {
	return async (ctx, next) => {
		// 只对api请求做签名校验
		if (!ctx.path.includes("/api")) {
			return await next()
		}

		// 获取请求参数
		const { params, path, method } = ctx
		const { body, query, headers } = ctx.request

		app.logger.info(
			`[ParamsVerify -- ${method} | ${path}] body: ${JSON.stringify(Object.keys(body).length ? body : null)} | query: ${JSON.stringify(Object.keys(query).length ? query : null)} | params: ${params} | headers: ${JSON.stringify(Object.keys(headers).length ? headers : null)}`,
		)

		const schema = app.routerSchema[path]?.[method.toLowerCase()]

		if (!schema) {
			return await next()
		}

		let valid = true
		let validate
		// 校验headers
		if (valid && headers && schema?.headers) {
			validate = ajv.compile(schema.headers)
			valid = validate(headers)
		}
		// 校验body
		if (valid && body && schema?.body) {
			validate = ajv.compile(schema.body)
			valid = validate(body)
		}
		// 校验query
		if (valid && query && schema?.query) {
			validate = ajv.compile(schema.query)
			valid = validate(query)
		}
		// 校验params
		if (valid && params && schema?.params) {
			validate = ajv.compile(schema.params)
			valid = validate(params)
		}

		if (!valid) {
			ctx.status = 200
			ctx.body = {
				success: false,
				message: `请求参数校验错误: ${validate.errors[0].message}`,
				code: 442,
			}

			app.logger.warn(
				`[ParamsVerify -- ${method} | ${path}] request failed: ${JSON.stringify(validate.errors)}`,
			)
			return
		}

		await next()
	}
}
