import { defineStore } from "pinia"
import { ref } from "vue"
import { getProjectListAPI } from "../api/project"

export const useProjectStore = defineStore("project", () => {
	// 菜单列表
	const projectList = ref([])

	// 设置菜单列表
	const setProjectList = (list) => {
		projectList.value = list
	}

	/**
	 * 获取指定或者所有的projectList
	 * @param {*} projectKey 指定获取的project key值
	 */
	const getProjectList = async (projectKey) => {
		const res = await getProjectListAPI({
			project_key: projectKey,
		})

		if (res && res.success && res.data) {
			projectList.value = res.data
		}
	}

	return { projectList, setProjectList, getProjectList }
})
