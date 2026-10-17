module.exports = (app) => {
	const BaseService = require("./base")(app)
	const modeList = require("../../model/index")(app)

	return class ProjectService extends BaseService {
		constructor() {
			super()
		}

		/**
		 * 获取所有模型与项目的结构化数据
		 */
		async getModelList() {
			return modeList
		}
	}
}
