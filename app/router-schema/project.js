module.exports = {
	"/api/project/list": {
		get: {
			query: {
				type: "object",
				properties: {
					project_key: {
						type: "string",
					},
					name: {
						type: "string",
					},
				},
				required: ["project_key", "name"],
			},
			params: {},
			body: {},
		},
	},
}
