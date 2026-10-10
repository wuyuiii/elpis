const log4js = require("log4js")

/**
 * 日志拓展工具
 * @param {*} app koa实例
 *
 * 外部调用 app.logger.info、app.logger.error
 */
module.exports = (app) => {
	let logger

	if (app.env.isLocal()) {
		// 开发环境打印在控制台
		logger = console
	} else {
		// 其他环境将日志输出到磁盘文件（日志落盘）

		log4js.configure({
			appenders: {
				console: {
					type: "console",
				},
				// 日志文件切分
				dateFile: {
					type: "dateFile",
					filename: "./logs/application.log",
					pattern: ".yyyy-MM-dd",
				},
			},
			categories: {
				default: {
					appenders: ["console", "dateFile"],
					level: "trace",
				},
			},
		})

		logger = log4js.getLogger()
	}

	return logger
}
