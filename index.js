const Koa = require("koa")

// Koa实例
const app = new Koa()

app.use(async (ctx) => {
	ctx.body = "Hello World"
})
// 启动服务
try {
	const port = process.env.PORT || 3000
	const host = process.env.IP || "localhost"
	app.listen(port, host)
	console.log(`Server running on : http://${host}:${port}`)
} catch (e) {
	console.error(e)
}
