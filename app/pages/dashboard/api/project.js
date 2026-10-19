import { request } from "$common/request"

/**
 * 获取project列表
 * @param {*} query 传参对象，含project_key
 * @returns Promise
 */
export const getProjectListAPI = (query) => {
	try {
		return request.get("/api/project/list", query)
	} catch (e) {
		console.error(e)
	}
}

/**
 * 获取指定project数据
 * @param {*} query 传参对象，含project_key
 * @returns Promise
 */
export const getProjectAPI = (query) => {
	try {
		return request.get("/api/project", query)
	} catch (e) {
		console.error(e)
	}
}
