const path = require("path")

/**
 * config Loader
 * @param {object} app Koa 实例
 *
 * 配置区分 本地/测试/生产，通过env 环境读取不同文件配置 env.config
 * 通过env.config 覆盖default.config 加载到app.config中
 *
 * 目录下对应的config配置
 *  默认配置 config/config.default.js
 *  本地配置 config/config.local.js
 *  测试配置 config/config.test.js
 *  生产配置 config/config.prod.js
 */
module.exports = (app) => {
	console.log("-- [config Loader] load start --")
	// 找到config目录
	const configPath = path.resolve(app.baseDir, `.${path.sep}config`)
	// 获取default config
	let defaultConfig = {}
	try {
		defaultConfig = require(path.resolve(configPath, `.${path.sep}config.default.js`))
	} catch {
		console.error(` [Execption] config.default.js file is Not Found`)
	}

	// 获取 env.config
	let envConfig = {}
	try {
		if (app.env.isProduction()) {
			// 生产环境
			envConfig = require(path.resolve(configPath, `.${path.sep}config.prod.js`))
		} else if (app.env.isTest()) {
			// 测试环境'
			envConfig = require(path.resolve(configPath, `.${path.sep}config.test.js`))
		} else {
			// 本地环境
			envConfig = require(path.resolve(configPath, `.${path.sep}config.local.js`))
		}
	} catch {
		console.error(` [Execption] config.${app.env.get()}.js file is Not Found`)
	}

	// 覆盖并加载default config
	app.config = { ...defaultConfig, ...envConfig }

	console.log("-- [config Loader] load done --")
}
