module.exports = (app) => {
	const BaseService = require("./base")(app)
	const modelList = require("../../model/index")(app)

	return class ProjectService extends BaseService {
		constructor() {
			super()
		}

		/**
		 * 获取所有模型与项目的结构化数据
		 */
		async getModelList() {
			return modelList
		}

		/**
		 * 获取指定projectKey对应模型下的project列表，如果projectKey为空则全量获取
		 * @param {String} projectKey
		 */
		async getList(projectKey) {
			return modelList.reduce((preList, modelItem) => {
				const { project } = modelItem
				if (projectKey && !project[projectKey]) {
					return preList
				}

				for (const key in project) {
					preList.push(project[key])
				}
				return preList
			}, [])
		}

		/**
		 * 获取指定的project
		 * @param {*} projectKey project key值
		 */
		async getProject(projectKey) {
			let project = null
			for (let i = 0; i < modelList.length; i++) {
				if (modelList[i].project[projectKey]) {
					project = modelList[i].project[projectKey]
					break
				}
			}

			return project
		}
	}
}
