const path = require("path")
const { merge } = require("webpack-merge")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")

// 获取基类配置
const webpackBaseConfig = require("./webpack.base")

const currentENV = process.env._ENV

// 使用webpack-merge 合并基础配置和生产配置
const webpackProdConfig = merge(webpackBaseConfig, {
	mode: "production", // 指定生产模式
	// 产物输出配置，因为开发和生产环境输出不一致，所以在各自环境中配置
	output: {
		filename: "js/[name]_[chunkhash:8].bundle.js",
		path: path.join(process.cwd(), `./app/public/dist/${currentENV}/`),
		publicPath: `/dist/${currentENV}/`,
		crossOriginLoading: "anonymous",
	},
	// webpack 5 内置 filesystem cache,无需 happypack 也能高效增量构建
	cache: {
		type: "filesystem",
		buildDependencies: {
			config: [__filename],
		},
	},
	module: {
		rules: [
			{
				test: /.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.js$/,
				include: [
					// 只对业务代码进行babel，加快webpack打包速度
					path.resolve(process.cwd(), "./app/pages"),
				],
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: ["@babel/plugin-transform-runtime"],
					},
				},
			},
		],
	},
	// webpack不会有大量的hints信息，默认为warning
	performance: {
		hints: false,
	},
	plugins: [
		// 每次build前，清空public/dist目录
		// clean-webpack-plugin@4.x: 只接受单个 options 对象,
		// 清理目标通过 cleanOnceBeforeBuildPatterns 指定(支持 glob 模式),
		// 排除文件用 ! 前缀否定语法,不再是 exclude 数组
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [
				path.resolve(process.cwd(), `./app/public/dist/${currentENV}/**/*`),
			],
			verbose: true,
			dry: false,
		}),
		// 提取css的公共部分，有效利用缓存（非公共css使用inline）
		new MiniCssExtractPlugin({
			chunkFilename: "css/[name]_[contenthash:8].bundle.css",
		}),
		// 优化并压缩css
		new CssMinimizerPlugin(),
		// 浏览器在请求资源时不发送用户的身份凭证
		new HtmlWebpackInjectAttributesPlugin({
			crossorigin: "anonymous",
		}),
	],
	optimization: {
		// 使用TerserWebpackPlugin的并发压缩，提升压缩阶段性能
		// 清除console.log
		minimize: true,
		minimizer: [
			new TerserWebpackPlugin({
				parallel: true, // 利用多核CPU的优势加快压缩速度
				terserOptions: {
					compress: {
						drop_console: true, // 清除console.log
					},
				},
			}),
		],
	},
})

module.exports = webpackProdConfig
