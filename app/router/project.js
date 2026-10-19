module.exports = (app, router) => {
	const { project: projectControll } = app.controllers

	/**
	 * 获取所有model和model对应的project结构化数据
	 */
	router.get("/api/project/model_list", projectControll.getModelList.bind(projectControll))

	/**
	 * 获取所有或者指定的project列表
	 */
	router.get("/api/project/list", projectControll.getList.bind(projectControll))

	/**
	 * 获取指定的project
	 */
	router.get("/api/project", projectControll.getProject.bind(projectControll))
}
