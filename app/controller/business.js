module.exports = (app) => {
	const BaseController = require("./base")(app)

	return class BuinessController extends BaseController {
		constructor() {
			super()
			const { business: BusinessService } = app.services
			this.businessService = BusinessService
		}

		async getList(ctx) {
			const { page, size } = ctx.request.query
			// 获取projectKey，并根据不同的projectKey做不同project的数据提取
			const list = this.businessService.getList(ctx)
			this.success(ctx, list, { total: list.length, page, size })
		}

		async deleteBusiness(ctx) {
			const { product_id } = ctx.request.query
			this.success(ctx, { product_id })
		}
	}
}
