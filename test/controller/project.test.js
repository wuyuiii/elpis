const assert = require("assert")
const supertest = require("supertest")
const md5 = require("md5")
const { describe, it } = require("mocha")
const elpisCore = require("../../elpis-core")

const signKey = "ichliichl123asd"
const st = Date.now()

describe("测试project相关结构", function () {
	this.timeout(60000)

	let modelList
	const projectList = []
	let request

	it("启动服务", async () => {
		const app = await elpisCore.start()
		modelList = require("../../model/index")(app)
		modelList.forEach((item) => {
			const { project } = item
			for (const k in project) {
				projectList.push(project[k])
			}
		})
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

	it("GET /api/project/list without project_key", async () => {
		let tempRequest = request.get("/api/project/list")
		tempRequest = tempRequest.set("s_t", st)
		tempRequest = tempRequest.set("s_sign", md5(`${signKey}_${st}`))
		const res = await tempRequest
		const data = res.body.data

		// 配置断言语句
		assert(res.body.success === true)
		assert(Array.isArray(data) && data.length > 0)
		assert(data.length === projectList.length)

		data.forEach((item) => {
			assert(item.key)
			assert(item.modelKey)
			assert(item.name)
			assert(item.desc !== undefined)
			assert(item.homePage !== undefined)
		})
	})

	it("GET /api/project/list with project_key", async () => {
		// 随机获取一个project
		const project = projectList[Math.floor(Math.random() * projectList.length)]
		const { modelKey } = projectList.find((item) => item.key === project.key)

		let tempRequest = request.get("/api/project/list")
		tempRequest = tempRequest.set("s_t", st)
		tempRequest = tempRequest.set("s_sign", md5(`${signKey}_${st}`))
		tempRequest = tempRequest.query({
			project_key: project.key,
		})
		const res = await tempRequest
		const data = res.body.data

		// 配置断言语句
		assert(res.body.success === true)
		assert(Array.isArray(data))
		assert(projectList.filter((item) => item.modelKey === modelKey).length === data.length)
		data.forEach((item) => {
			assert(item.key)
			assert(item.modelKey)
			assert(item.name)
			assert(item.desc !== undefined)
			assert(item.homePage !== undefined)
		})
	})

	it("GET /api/project without project_key", async () => {
		let tempRequest = request.get("/api/project")
		tempRequest = tempRequest.set("s_t", st)
		tempRequest = tempRequest.set("s_sign", md5(`${signKey}_${st}`))
		const res = await tempRequest
		const body = res.body

		assert(body.code === 442)
		assert(body.message.indexOf("must have required property 'project_key'" > -1))
	})

	/**
	 * 校验menuItem和其中的菜单
	 * @param {*} menuItem
	 */
	const checkMenuItem = (menuItem) => {
		assert(menuItem.key)
		assert(menuItem.name)
		assert(menuItem.menuType)
		if (menuItem.menuType === "group") {
			assert(Array.isArray(menuItem.subMenu))
			menuItem.subMenu.forEach((subItem) => {
				checkMenuItem(subItem)
			})
		}
		if (menuItem.menuType === "module") {
			checkModule(menuItem)
		}
	}
	/**
	 * 校验module菜单配置
	 * @param {*} menuItem
	 */
	const checkModule = (menuItem) => {
		const { moduleType } = menuItem
		assert(moduleType)
		assert(["sider", "schema", "custom", "iframe"].includes(moduleType))

		if (moduleType === "sider") {
			const { siderConfig } = menuItem
			assert(siderConfig)
			assert(Array.isArray(siderConfig.menu))

			siderConfig.menu.forEach((siderMenuItem) => {
				checkMenuItem(siderMenuItem)
			})
		}
		if (moduleType === "iframe") {
			const { iframeConfig } = menuItem
			assert(iframeConfig)
			assert(iframeConfig.path !== undefined)
		}
		if (moduleType === "custom") {
			const { customConfig } = menuItem
			assert(customConfig)
			assert(customConfig.path !== undefined)
		}
		if (moduleType === "schema") {
			const { schemaConfig } = menuItem
			assert(schemaConfig)
			assert(schemaConfig.api !== undefined)
			assert(schemaConfig.schema)
		}
	}

	it("GET /api/project with project_key", async () => {
		for (let i = 0; i < projectList.length; i++) {
			const item = projectList[i]
			const { key } = item
			let tempRequest = request.get("/api/project")
			tempRequest = tempRequest.set("s_t", st)
			tempRequest = tempRequest.set("s_sign", md5(`${signKey}_${st}`))
			tempRequest = tempRequest.query({
				project_key: key,
			})
			const res = await tempRequest
			const body = res.body
			assert(body.data && Object.keys(body.data).length > 0)
			assert(body.data.key === key)
			assert(
				body.data.modelKey &&
					body.data.name &&
					body.data.desc !== undefined &&
					body.data.homePage !== undefined,
			)
			const { menu } = body.data
			menu.forEach((menuItem) => {
				checkMenuItem(menuItem)
			})
		}
	})

	it("GET /api/project fail", async () => {
		let tempRequest = request.get("/api/project")
		tempRequest = tempRequest.set("s_t", st)
		tempRequest = tempRequest.set("s_sign", md5(`${signKey}_${st}`))
		tempRequest = tempRequest.query({
			project_key: "adasda", // 不存在的projectKey
		})
		const res = await tempRequest
		const body = res.body

		assert(body.code === 10000)
		assert(body.message.includes("获取project异常"))
	})
})
