module.exports = (app) => {
	return class ViewController {
		/**
		 * 渲染页面
		 * @param {object} ctx 上下文
		 */
		async renderPage(ctx) {
			const { project_key: projectKey } = ctx.query

			await ctx.render(`dist/${ctx.params.page}`, {
				projectKey,
				name: app.options?.name,
				options: JSON.stringify(app.options),
				env: app.env?.get(),
			})
		}
	}
}
