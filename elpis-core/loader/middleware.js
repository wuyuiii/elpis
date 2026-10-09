const path = require("path")
const { globSync } = require("glob")
const { sep } = path

/**
 *  middleware Loader
 * @param {object} app app Koa实例
 *
 * 加载所有 middleware，可通过 `app.middlewares.${目录}.${文件}` 访问
 *
 * 举例：
 *      app/middleware
 *          | --custom-module
 *          |   --custom-middleware.js
 *
 * 使用:
 *      app.middlewares.customModule.customMiddleware
 */
module.exports = (app) => {
	console.log("-- [middleware Loader] load start --")

	// 读取 app/middlewares/**/*.js 所有文件
	const fileList = globSync("app/middleware/**/**.js")

	// 遍历所有文件变量，添加到 app.middlewares下
	const middlewares = {}
	fileList.forEach((file, index) => {
		console.log(`   - ${index + 1} load file-${index + 1}: ${file}`)
		// 提取文件路径
		let name = path.resolve(file)

		// 截取路径 app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
		name = name.substring(
			name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
			name.lastIndexOf("."),
		)
		// 把 '-' 统一改为大驼峰格式 custom-module/custom-middleware => customModule.customMiddleware
		name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())
		// 挂载 middleware 到 app对象中
		let tempMiddlewares = middlewares
		const names = name.split(sep) // 将 customModule.customMiddleware 分割成数组 ['customModule','customMiddleware']

		for (let i = 0; i < names.length; i++) {
			if (i !== names.length - 1) {
				if (!tempMiddlewares[names[i]]) {
					tempMiddlewares[names[i]] = {} // tempMiddlewares.customModule = {}
				}
				tempMiddlewares = tempMiddlewares[names[i]] // tempMiddlewares = {customModule:{}}
				continue
			}

			tempMiddlewares[names[i]] = require(path.resolve(file))(app) // tempMiddlewares = {customModule:{loader的模块}}
		}
	})

	app.middlewares = middlewares

	console.log("-- [middleware Loader] load done --")
}
