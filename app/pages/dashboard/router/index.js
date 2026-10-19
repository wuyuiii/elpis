const routes = []

// 头部菜单路由
routes.push({
	path: "/iframe",
	component: () => import("../views/iframe-view/iframe-view.vue"),
})

routes.push({
	path: "/schema",
	component: () => import("../views/schema-view/schema-view.vue"),
})

routes.push({
	path: "/todo",
	component: () => import("../todo/todo.vue"),
})

// 侧边栏菜单路由
routes.push({
	path: "/sider",
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
	path: "/sider/:chapters+",
	component: () => import("../views/sider-view/sider-view.vue"),
})

export { routes }
