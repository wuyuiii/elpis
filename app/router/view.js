module.exports = (app, router) => {
	const { view: viewController } = app.controllers

	// 用户输入 http://xxx:xxxx/view/1
	router.get("/view/:page", viewController.renderPage.bind(viewController))
}
