module.exports = {
	"/api/project/model_list": {
		get: {},
		post: {},
		put: {},
		delete: {},
	},
	"/api/project/list": {
		get: {
			query: {
				type: "object",
				properties: {
					project_key: {
						type: "string",
					},
				},
			},
		},
	},
	"/api/project": {
		get: {
			query: {
				type: "object",
				properties: {
					project_key: {
						type: "string",
					},
				},
				required: ["project_key"],
			},
		},
	},
}
