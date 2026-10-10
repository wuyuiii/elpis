const path = require("path")
const { globSync } = require("glob")
const { sep } = path

/**
 *  service Loader
 * @param {object} app app Koa实例
 *
 * 加载所有 service `app.service.${目录}.${文件}` 访问
 *
 * 举例：
 *      app/service
 *          | --custom-module
 *          |   --custom-service.js
 *
 * 使用:
 *      app.service.customModule.customService
 */
module.exports = (app) => {
	console.log("-- [service Loader] load start --")

	// 读取 app/service/**/*.js 所有文件
	const fileList = globSync("app/service/**/*.js")

	// 遍历所有文件变量，添加到 app.services
	const services = {}
	fileList.forEach((file, index) => {
		console.log(`   - ${index + 1} load file-${index + 1}: ${file}`)
		// 提取文件路径
		let name = path.resolve(file)

		// 截取路径 app/service/custom-module/custom-service.js => custom-module/custom-service
		name = name.substring(
			name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
			name.lastIndexOf("."),
		)
		// 把 '-' 统一改为大驼峰格式 custom-module/custom-service => customModule.customService
		name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())
		// 挂载 service 到 app对象中
		let tempServices = services
		const names = name.split(sep) // 将 customModule.customService 分割成数组 ['customModule','customService']

		for (let i = 0; i < names.length; i++) {
			if (i !== names.length - 1) {
				if (!tempServices[names[i]]) {
					tempServices[names[i]] = {} // tempServices.customModule = {}
				}
				tempServices = tempServices[names[i]] // tempServices = {customModule:{}}
				continue
			}
			const ServiceModule = require(path.resolve(file))(app)
			tempServices[names[i]] = new ServiceModule()
		}
	})

	app.services = services

	console.log("-- [service Loader] load done --")
}
