const webpack = require("webpack")
const webpackProdConfig = require("./config/webpack.prod")

console.log(`\n [webpack --env: ${process.env._ENV}] building... \n`)

webpack(webpackProdConfig, (err, stats) => {
	if (err) {
		console.log("[exeption]", err)

		return
	}
	process.stdout.write(
		`${stats.toString({
			color: true, // 控制台彩色输出
			modules: false, // 是否显示每个模块的打包信息
			children: false, // 是否显示子编译任务的信息
			chunks: false, // 是否显示每个代码块的信息
			chunkModules: true, // 是否显示代码块中模块的信息
		})}\n`,
	)
})
