module.exports = (app, router) => {
	const { project: projectControll } = app.controllers

	router.get("/api/project/model_list", projectControll.getModelList.bind(projectControll))
}
