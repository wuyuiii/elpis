module.exports = () => {
	return {
		// 判断是否本地环境
		isLocal() {
			return process.env._ENV === "local"
		},
		// 判断是否测试环境
		isTest() {
			return process.env._ENV === "test"
		},
		// 判断是否生产环境
		isProduction() {
			return process.env._ENV === "prod"
		},
		// 获取当前环境
		get() {
			return process.env._ENV ?? "local"
		},
	}
}
