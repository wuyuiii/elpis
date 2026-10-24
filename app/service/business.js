module.exports = (app) => {
	const BaseService = require("./base")(app)

	return class BusinessService extends BaseService {
		constructor() {
			super()
		}

		getList(ctx) {
			return [
				{
					product_id: "1",
					product_name: `${ctx.projectKey}--前端宝典`,
					price: 39.9,
					inventory: 9999,
					create_time: "2023-08-12 20:23:11",
				},
				{
					product_id: "2",
					product_name: `${ctx.projectKey}--AI全栈`,
					price: 299,
					inventory: 9999,
					create_time: "2023-08-12 20:23:11",
				},
			]
		}
	}
}
