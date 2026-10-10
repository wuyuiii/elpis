const superagent = require("superagent")
module.exports = (app) => {
	/**
	 * service 基类
	 * 统一收拢 service 公共方法
	 */
	return class BaseService {
		constructor() {
			this.app = app
			this.config = app.config
			this.superagent = superagent
		}
	}
}
