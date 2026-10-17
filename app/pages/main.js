import { createApp } from "vue"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import { createRouter, createWebHistory } from "vue-router"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { pinia } from "$store/index.js"
import "./assets/common.css"

/**
 * vue页面主入口，用于启动vue
 * @param pageComponent vue组件入口
 * @param {Object} Options 配置项：路由配置、第三方包列表数组等
 */
export default (pageComponent, options = {}) => {
	const app = createApp(pageComponent)
	const { routes, libs } = options
	// 引入elementplus
	app.use(ElementPlus)

	// 注册全部图标
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}

	// 引入pinia
	app.use(pinia)

	// 引入第三方包
	if (libs && Array.isArray(libs) && libs.length) {
		for (let i = 0; i < libs.length; i++) {
			app.use(libs[i])
		}
	}

	// 页面路由 -- 和整体项目的router不同
	// 整体项目的router，例如: /view/page1 是作为SSR渲染
	// 这里的路由是作为CSR渲染（客户端渲染）
	if (routes && Array.isArray(routes) && routes.length) {
		const router = createRouter({
			history: createWebHistory(),
			routes: routes,
		})

		app.use(router).mount("#root")
	} else {
		app.mount("#root")
	}
}
