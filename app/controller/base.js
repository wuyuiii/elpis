module.exports = (app) => {
	/**
	 * controller 基类
	 * 统一收拢controller公共方法
	 */
	return class BaseController {
		constructor() {
			this.app = app
			this.config = app.config
			// this.services = app.services
		}

		/**
		 * API 成功处理时统一返回结构
		 * @param {object} ctx 上下文
		 * @param {object} data 返回核心数据
		 * @param {object} metadata 附加数据
		 */
		success(ctx, data = {}, metadata = {}) {
			ctx.status = 200
			ctx.body = {
				success: true,
				data: data,
				metadata: metadata,
			}
		}

		/**
		 * API 失败处理时统一返回结构
		 * @param {object} ctx 上下文
		 * @param {object} message 返回错误信息
		 * @param {object} code 返回错误码
		 */
		fail(ctx, message = "", code = 400) {
			ctx.status = 200
			ctx.body = {
				success: false,
				message,
				code,
			}
		}
	}
}
