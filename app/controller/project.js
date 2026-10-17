module.exports = (app) => {
	const BaseController = require("./base")(app)
	return class ProjectController extends BaseController {
		constructor() {
			super()
			const { project: projectService } = app.services
			this.projectService = projectService
		}

		/**
		 * 获取所有模型与项目的结构化数据
		 * @param {*} ctx 请求上下文
		 */
		async getModelList(ctx) {
			const modelList = await this.projectService.getModelList()

			// 构造返回结构，只返回关键结构
			const result = modelList.map((item) => {
				const { model, project } = item

				// 构造model数据
				const { key: modelKey, name: modelName, desc: modelDesc } = model
				// 构造project数据
				const projectData = Object.keys(project).reduce((preList, item) => {
					const { key, name, desc, homePage } = project[item]
					preList[item] = { key, name, desc, homePage }
					return preList
				}, {})

				return {
					model: {
						key: modelKey,
						name: modelName,
						desc: modelDesc,
					},
					project: projectData,
				}
			})

			this.success(ctx, result)
		}
	}
}
