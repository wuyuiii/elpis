const assert = require("assert")
const supertest = require("supertest")
const md5 = require("md5")
const { describe, it } = require("mocha")
const elpisCore = require("../../elpis-core")

const signKey = "ichliichl123asd"
const st = Date.now()

describe("测试project相关结构", function () {
	this.timeout(60000)

	let request

	it("启动服务", async () => {
		const app = await elpisCore.start()
		request = supertest(app.listen())
	})

	it("GET /api/project/model_list", async () => {
		let tempRequest = request.get("/api/project/model_list")
		tempRequest = tempRequest.set("s_t", st)
		tempRequest = tempRequest.set("s_sign", md5(`${signKey}_${st}`))
		const res = await tempRequest

		const data = res.body.data
		// 配置断言语句
		assert(res.body.success === true)
		assert(Array.isArray(data) && data.length > 0)
		data.forEach((item) => {
			assert(item.model)
			assert(item.model.key)
			assert(item.model.name)
			assert(item.project)
			for (const projKey in item.project) {
				assert(item.project[projKey])
				assert(item.project[projKey].key)
				assert(item.project[projKey].name)
			}
		})
	})
})
