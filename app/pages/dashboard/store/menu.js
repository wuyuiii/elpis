import { defineStore } from "pinia"
import { ref } from "vue"
import { getProjectAPI } from "../api/project"

export const useMenuStore = defineStore("menu", () => {
	// 菜单列表
	const menuList = ref([])
	const projectName = ref("")

	// 设置菜单列表
	const setMenuList = (list) => {
		menuList.value = list
	}

	/**
	 * 请求 /api/project 接口，获取具体project数据中的菜单数据
	 * @param {*} projectKey
	 */
	const getMenuList = async (projectKey) => {
		const res = await getProjectAPI({
			project_key: projectKey,
		})

		if (res && res.success && res.data) {
			menuList.value = res.data.menu
			projectName.value = res.data.name
		}
	}

	/**
	 * 根据指定key找出对应的菜单项，{key:'key',value:'test'} 找到item.key为test的菜单项
	 * @param {Object} params {key:搜索的字段,value:搜索值}
	 * @param {Array} list 要搜索的菜单列表
	 */
	const findMenuItem = ({ key, value } = {}, list = menuList.value) => {
		for (let i = 0; i < list.length; i++) {
			const item = list[i]
			const { menuType, moduleType } = item

			if (item[key] === value) {
				return item
			}

			if (menuType === "group" && Array.isArray(item.subMenu) && item.subMenu.length > 0) {
				const mItem = findMenuItem({ key, value }, item.subMenu)
				if (mItem) return mItem
			}

			if (
				moduleType === "sider" &&
				item?.siderConfig &&
				Array.isArray(item?.siderConfig?.menu) &&
				item?.siderConfig?.menu.length > 0
			) {
				const mItem = findMenuItem({ key, value }, item?.siderConfig?.menu)
				if (mItem) return mItem
			}
		}
	}

	return { menuList, projectName, setMenuList, getMenuList, findMenuItem }
})
