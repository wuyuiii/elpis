const path = require("path")
const { globSync } = require("glob")

/**
 *
 * @param {object} app Koa实例
 * 通过 'json-schema' & ajv 对 API规则进行约束，配合 api-params-verify 中间件使用
 * app/router-schema/**.js
 *
 * 输出:
 *      app.routerSchema = {
 *          `${api1}`: ${jsonSchema},
 *          `${api2}`: ${jsonSchema},
 *          `${api3}`: ${jsonSchema},
 *      }
 */
module.exports = (app) => {
	console.log("-- [routerSchema Loader] load start --")
	// 读取 app/router-schema/**/*.js 所有文件
	const fileList = globSync("app/router-schema/**/*.js")

	// 注册所有 routerSchema 后续可以通过 app.routerSchema 访问
	let routerSchema = {}
	fileList.forEach((file, index) => {
		console.log(`   - ${index + 1} load file-${index + 1}: ${file}`)

		routerSchema = {
			...routerSchema,
			...require(path.resolve(file)),
		}
	})

	app.routerSchema = routerSchema

	console.log("-- [routerSchema Loader] load done --")
}
