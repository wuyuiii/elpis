const path = require("path")
const { globSync } = require("glob")
const { sep } = path

const _ = require("lodash")

// project 继承 model 方法
const projectExtendsModel = (model, project) => {
	return _.mergeWith({}, model, project, (modelValue, projectValue) => {
		// 处理数组合并
		if (Array.isArray(modelValue) && Array.isArray(projectValue)) {
			const result = []

			// 建立索引
			const projectMap = new Map(projectValue.map((item) => [item.key, item]))
			const processedKeys = new Set()

			// 因为project 继承 model。所以需要处理修改和新增内容的情况

			// 1.project和model都存在的情况，处理修改的逻辑（重载）
			// 2.project存在 model不存在，处理新增逻辑（拓展）
			// 3.project不存在 model存在，处理保留逻辑（继承）

			// 处理 model 的每一项:存在于 project → 递归合并;不存在 → 直接保留
			for (const modelItem of modelValue) {
				const matched = projectMap.get(modelItem.key)
				processedKeys.add(modelItem.key)
				result.push(matched ? projectExtendsModel(modelItem, matched) : modelItem)
			}
			// 处理 project 中 model 没有的项:直接新增
			for (const projectItem of projectValue) {
				if (!processedKeys.has(projectItem.key)) {
					result.push(projectItem)
				}
			}

			return result
		}
	})
}

/**
 * 解析 model 配置，并返回组织后的模板数据结构
 * [{
 *      model:${model},
 *      project:{
 *          pro1:${project1},
 *          pro2:${project2}
 *      }
 * }]
 * @param {*} app
 */
module.exports = (_app) => {
	const modelList = []

	// 遍历当前文件夹，构造模板数据结构，挂载到modeList上
	const fileList = globSync("model/**/*.js")

	fileList.forEach((file) => {
		if (file.includes("index.js")) {
			return
		}

		const fileFullPath = path.resolve(file)

		// 区分配置类型 (model / project)
		const type = file.includes(`${sep}project${sep}`) ? "project" : "model"

		if (type === "model") {
			const modelKey = path.basename(path.dirname(file))

			let modelItem = modelList.find((item) => item.model?.key === modelKey)

			if (!modelItem) {
				modelItem = {
					model: {
						key: modelKey,
					},
				}
				modelList.push(modelItem)
			}
			modelItem.model = { ...modelItem.model, ...require(fileFullPath) }
		}

		if (type === "project") {
			const modelKey = path.basename(path.dirname(path.dirname(file)))
			const projectKey = path.basename(file).split(".")[0]

			let modelItem = modelList.find((item) => item.model?.key === modelKey)

			if (!modelItem) {
				modelItem = {
					model: {
						key: modelKey,
					},
				}
				modelList.push(modelItem)
			}

			if (!modelItem.project) {
				modelItem.project = {}
			}
			modelItem.project[projectKey] = {
				key: projectKey,
				...require(fileFullPath),
			}
		}
	})

	// project数据进一步处理：project => 继承 model
	modelList.forEach((item) => {
		const { model, project } = item
		for (const key in project) {
			project[key] = projectExtendsModel(model, project[key])
		}
	})

	return modelList
}
