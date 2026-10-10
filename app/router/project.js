module.exports = (app, router) => {
	const { project: projectControll } = app.controllers

	// 用户输入 http://xxx:xxxx/view/1
	router.get("/api/project/list", projectControll.getList.bind(projectControll))
}
