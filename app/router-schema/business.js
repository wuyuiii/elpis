module.exports = {
	"/api/proj/product": {
		delete: {
			query: {
				type: "object",
				properties: {
					product_id: {
						type: "string",
					},
				},
				required: ["product_id"],
			},
		},
	},
	"/api/proj/product/list": {
		get: {
			query: {
				type: "object",
				properties: {
					page: {
						type: "string",
					},
					size: {
						type: "string",
					},
				},
				required: ["page", "size"],
			},
		},
	},
}
