module.exports = (app) => {
	const BaseService = require("./base")(app)
	return class ProjectService extends BaseService {
		async getList() {
			return [{ name: 1 }, { name: 2 }, { name: 3 }]
		}
	}
}
