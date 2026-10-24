module.exports = (app, router) => {
	const { view: viewController } = app.controllers

	// 用户输入 http://xxx:xxxx/view/1 或者 http://xxx:xxxx/view/1/xxx
	router.get("/view/:page{/*path}", viewController.renderPage.bind(viewController))
}
