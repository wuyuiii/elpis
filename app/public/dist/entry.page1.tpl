<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{{ name }}</title>
		<script src="https://unpkg.com/axios@1.7.7/dist/axios.min.js"></script>
		<!-- 与后端 elpis 的 md5 字节级一致,用于 s_sign 计算 -->
		<script src="https://unpkg.com/blueimp-md5@2.19.0/js/md5.min.js"></script>
	</head>
	<body>
		<input style="display: none" id="options" value="{{ options }}" />
		<input style="display: none" id="env" value="{{ env }}" />
		page1
		<button id="btn">发送请求</button>
	</body>

	<script>
		window.env = document.getElementById("env").value
		window.options = JSON.parse(document.getElementById("options").value)

		// 与后端 api-sign-verify.js 完全一致的签名 key
		const SIGN_KEY = "ichliichl123asd"
		// 签名算法:md5(SIGN_KEY + "_" + s_t) 小写 — 与后端 md5(`${signKey}_${st}`) 一致
		const buildSign = (sT) => window.md5(`${SIGN_KEY}_${sT}`).toLowerCase()

		// axios 全局请求拦截器:任何命中 /api 的请求自动补 s_t / s_sign
		axios.interceptors.request.use((config) => {
			const url = config.url || ""
			if (url.includes("/api")) {
				const sT = String(Date.now())
				config.headers = config.headers || {}
				config.headers.s_t = sT
				config.headers.s_sign = buildSign(sT)
			}
			return config
		})

		const btn = document.getElementById("btn")
		btn.addEventListener("click", async () => {
			try {
				const res = await axios.request({
					method: "get",
					url: "/api/project/list",
					params: {
						project_key: "test",
						name: "test api",
					},
				})
			} catch (err) {
				console.error("axios get error:", err)
			}
		})
	</script>
</html>
