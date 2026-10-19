/**
 * axios封装
 */

import axios from "axios"
import { ElMessage } from "element-plus"
import md5 from "md5"

// 接口签名
const SIGN_KEY = "ichliichl123asd"

class AxiosRequest {
	constructor(options) {
		const { baseUrl, data = {}, headers = {}, timeout = 30000 } = options
		this.baseUrl = baseUrl
		this.data = data
		this.headers = headers
		this.timeout = timeout
	}

	async _request(url, method = "get", data, headers, timeout, errMessage) {
		// 构造签名
		const st = Date.now()
		const sign = md5(`${SIGN_KEY}_${st}`)

		// 构造请求参数
		const axiosRequestConfig = {
			url: `${this.baseUrl}${url}`,
			method,
			headers: {
				...headers,
				s_sign: sign,
				s_t: st,
			},
			timeout,
		}
		if (["get", "delete", "put"].includes(method.toLowerCase())) {
			axiosRequestConfig["params"] = data
		} else {
			axiosRequestConfig["data"] = data
		}
		return axios
			.request(axiosRequestConfig)
			.then((response) => {
				const resData = response.data

				const { success } = resData

				// 业务请求失败
				if (!success) {
					const { code, message } = resData
					if (code === 442) {
						ElMessage.error("请求参数异常")
					} else if (code === 10002) {
						ElMessage.error("请求不合法")
					} else {
						ElMessage.error(message || errMessage)
					}

					return Promise.resolve({ success, code, message })
				}

				// 成功
				return Promise.resolve(resData)
			})
			.catch((error) => {
				const { message } = error

				if (message.match(/timeout/)) {
					return Promise.resolve({
						message: "Request Timeout",
						code: 504,
					})
				}
				return Promise.resolve(error)
			})
	}

	async get(url, data, headers, timeout, errMessage) {
		return await this._request(url, "GET", data, headers, timeout, errMessage)
	}

	async post(url, data, headers, timeout, errMessage) {
		return await this._request(url, "POST", data, headers, timeout, errMessage)
	}

	async put(url, data, headers, timeout, errMessage) {
		return await this._request(url, "PUT", data, headers, timeout, errMessage)
	}

	async patch(url, data, headers, timeout, errMessage) {
		return await this._request(url, "PATCH", data, headers, timeout, errMessage)
	}

	async delete(url, data, headers, timeout, errMessage) {
		return await this._request(url, "DELETE", data, headers, timeout, errMessage)
	}
}

const request = new AxiosRequest({
	baseUrl: "http://localhost:3000",
})

// export const a = {
// 	request,
// 	get: request.get,
// 	post: request.post,
// 	put: request.put,
// 	patch: request.patch,
// 	delete: request.delete,
// }

export { request }
