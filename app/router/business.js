module.exports = (app, router) => {
	const { business: BusinessController } = app.controllers

	router.get("/api/proj/product/list", BusinessController.getList.bind(BusinessController))

	router.delete("/api/proj/product", BusinessController.deleteBusiness.bind(BusinessController))
}
