<script setup>
import HeaderView from "./views/header-view/header-view"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import { onMounted } from "vue"
import { useMenuStore } from "./store/menu"
import { useProjectStore } from "./store/project"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const projectStore = useProjectStore()

onMounted(() => {
	// TODO：动态获取当前项目的key，暂时写死pdd
	menuStore.getMenuList(route.query?.project_key)
	projectStore.getProjectList(route.query?.project_key)
})

const onMenuSelect = (menuItem) => {
	const { moduleType, key, customConfig } = menuItem

	// 当前页面不处理
	if (key === route.query?.key) return

	const pathMap = {
		sider: "/sider",
		iframe: "/iframe",
		schema: "/schema",
		custom: customConfig?.path,
	}


	router.push({
		path: pathMap[moduleType],
		query: {
			key: key,
			project_key: route.query.project_key,
		},
	})
}
</script>

<template>
  <el-config-provider :locale="zhCn">
    <HeaderView
      :project-name="menuStore.projectName"
      @menu-select="onMenuSelect"
    >
      <template #main-content>
        <router-view />
      </template>
    </HeaderView>
  </el-config-provider>
</template>

<style lang="less" scoped></style>
