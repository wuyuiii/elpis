module.exports = {
	mode: "dashboard",
	name: "电商系统",
	desc: "电商系统模板结构",
	menu: [
		{
			key: "product",
			name: "商品管理",
			menuType: "module",
			moduleType: "schema",
			schemaConfig: {
				api: "/api/proj/product",
				schema: {
					type: "object",
					properties: {
						product_id: {
							type: "string",
							label: "商品ID",
							tableOptions: {
								width: 300,
								"show-overflow-tooltip": true,
							},
						},
						product_name: {
							type: "string",
							label: "商品名称",
							tableOptions: {
								width: 200,
							},
						},
						price: {
							type: "number",
							label: "价格",
							tableOptions: {
								width: 200,
							},
						},
						inventory: {
							type: "number",
							label: "库存",
							tableOptions: {
								width: 200,
							},
						},
						create_time: {
							type: "string",
							label: "创建时间",
							tableOptions: {},
						},
					},
				},
				tableConfig: {
					headerButtons: [
						{
							label: "新增商品",
							eventKey: "showComponent",
							type: "primary",
							plain: true,
						},
					],
					rowButtons: [
						{
							label: "修改",
							type: "warning",
							eventKey: "showComponent",
						},
						{
							label: "删除",
							type: "danger",
							eventKey: "remove",
							eventOptions: {
								params: {
									product_id: "schema::product_id",
								},
							},
						},
					],
				},
			},
		},
		{
			key: "order",
			name: "订单管理",
			menuType: "module",
			moduleType: "custom",
			customConfig: {
				path: "/todo",
			},
		},
		{
			key: "client",
			name: "客户管理",
			menuType: "module",
			moduleType: "custom",
			customConfig: {
				path: "/todo",
			},
		},
	],
}
