module.exports = (app) => {
	const BaseService = require("./base")(app)
	return class ProjectService extends BaseService {
		async getList() {
			return [
				{ name: 1, desc: "list1" },
				{ name: 2, desc: "list2" },
				{ name: 3, desc: "list3" },
			]
		}
	}
}
