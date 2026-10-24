const routes = []

const PRE_PATH = "/view/dashboard"

// 头部菜单路由
routes.push({
	path: `${PRE_PATH}/iframe`,
	component: () => import("../views/iframe-view/iframe-view.vue"),
})

routes.push({
	path: `${PRE_PATH}/schema`,
	component: () => import("../views/schema-view/schema-view.vue"),
})

routes.push({
	path: `${PRE_PATH}/todo`,
	component: () => import("../todo/todo.vue"),
})

// 侧边栏菜单路由
routes.push({
	path: `${PRE_PATH}/sider`,
	component: () => import("../views/sider-view/sider-view.vue"),
	children: [
		{
			path: "iframe",
			component: () => import("../views/iframe-view/iframe-view.vue"),
		},
		{
			path: "schema",
			component: () => import("../views/schema-view/schema-view.vue"),
		},
		{
			path: "todo",
			component: () => import("../todo/todo.vue"),
		},
	],
})

// 侧边栏兜底策略
routes.push({
	path: `${PRE_PATH}/sider/:chapters+`,
	component: () => import("../views/sider-view/sider-view.vue"),
})

export { routes, PRE_PATH }
