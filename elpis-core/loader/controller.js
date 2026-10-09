const path = require("path")
const { globSync } = require("glob")
const { sep } = path

/**
 *  controller Loader
 * @param {object} app app Koa实例
 *
 * 加载所有 controller `app.controller.${目录}.${文件}` 访问
 *
 * 举例：
 *      app/controller
 *          | --custom-module
 *          |   --custom-controller.js
 *
 * 使用:
 *      app.controller.customModule.customController
 */
module.exports = (app) => {
	console.log("-- [controller Loader] load start --")

	// 读取 app/controller/**/*.js 所有文件
	const fileList = globSync("app/controller/**/*.js")

	// 遍历所有文件变量，添加到 app.controller
	const controllers = {}
	fileList.forEach((file, index) => {
		console.log(`   - ${index + 1} load file-${index + 1}: ${file}`)
		// 提取文件路径
		let name = path.resolve(file)

		// 截取路径 app/controller/custom-module/custom-controller.js => custom-module/custom-controller
		name = name.substring(
			name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
			name.lastIndexOf("."),
		)
		// 把 '-' 统一改为大驼峰格式 custom-module/custom-controller => customModule.customController
		name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())
		// 挂载 controller 到 app对象中
		let tempControllers = controllers
		const names = name.split(sep) // 将 customModule.customController 分割成数组 ['customModule','customController']

		for (let i = 0; i < names.length; i++) {
			if (i !== names.length - 1) {
				if (!tempControllers[names[i]]) {
					tempControllers[names[i]] = {} // tempControllers.customModule = {}
				}
				tempControllers = tempControllers[names[i]] // tempControllers = {customModule:{}}
				continue
			}
			const ControllerModule = require(path.resolve(file))(app)
			tempControllers[names[i]] = new ControllerModule()
		}
	})

	app.controllers = controllers

	console.log("-- [controller Loader] load done --")
}
