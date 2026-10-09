const path = require("path")
const { globSync } = require("glob")
const { sep } = path

/**
 *  extend Loader
 * @param {object} app app Koa实例
 *
 * 加载所有 extend `app.extend.${文件}` 访问
 *
 * 举例：
 *      app/extend
 *          | --custom-extend.js
 *
 * 使用:
 *      app.extend.customExtend
 */
module.exports = (app) => {
	console.log("-- [extend Loader] load start --")

	// 读取 app/extend/*.js 所有文件
	const fileList = globSync("app/extend/*.js")

	// 遍历所有文件变量，添加到 app.extend
	// const extend = {}
	fileList.forEach((file, index) => {
		console.log(`   - ${index + 1} load file-${index + 1}: ${file}`)
		// 提取文件路径
		let name = path.resolve(file)

		// 截取路径 app/extend/custom-extend.js => custom-extend
		name = name.substring(
			name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
			name.lastIndexOf("."),
		)
		// 把 '-' 统一改为大驼峰格式 custom-extend => customExtend
		name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

		// 过滤app中存在的Key
		if (app[name]) {
			console.log(`[extend Loader] Error name:${name} is already in app`)
			return
		}
		app[name] = require(path.resolve(file))(app)
	})

	// app.extend = extend

	console.log("-- [extend Loader] load done --")
}
