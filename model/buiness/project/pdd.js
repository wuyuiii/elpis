module.exports = {
	name: "拼多多",
	desc: "拼多多电商系统",
	homePage: "/todo?project_key=pdd&key=product",
	menu: [
		{
			key: "product",
			name: "商品管理(拼多多)",
			menuType: "group",
			subMenu: [
				{
					key: "subMenu1",
					name: "subMenu1",
					menuType: "group",
					subMenu: [
						{
							key: "sub-subMenu1",
							name: "sub-subMenu1",
							menuType: "module",
							moduleType: "custom",
							customConfig: {
								path: "/todo",
							},
						},
					],
				},
			],
		},
		{
			key: "client",
			name: "客户管理(拼多多)",
		},
		{
			key: "data",
			name: "数据分析",
			menuType: "module",
			moduleType: "sider",
			siderConfig: {
				menu: [
					{
						key: "analysis",
						name: "电商罗盘",
						menuType: "module",
						moduleType: "custom",
						customConfig: {
							path: "/todo",
						},
					},
					{
						key: "sider-search",
						name: "信息查询",
						menuType: "module",
						moduleType: "iframe",
						iframeConfig: {
							path: "https://www.runoob.com",
						},
					},
					{
						key: "categories",
						name: "分类数据",
						menuType: "group",
						subMenu: [
							{
								key: "categories-1",
								name: "一级分类",
								menuType: "module",
								moduleType: "custom",
								customConfig: {
									path: "/todo",
								},
							},
							{
								key: "categories-2",
								name: "二级分类",
								menuType: "module",
								moduleType: "iframe",
								iframeConfig: {
									path: "https://www.runoob.com",
								},
							},
							{
								key: "tags",
								name: "标签",
								menuType: "module",
								moduleType: "custom",
								customConfig: {
									path: "/todo",
								},
							},
						],
					},
				],
			},
		},
		{
			key: "search",
			name: "信息查询",
			menuType: "module",
			moduleType: "iframe",
			iframeConfig: {
				path: "https://www.runoob.com",
			},
		},
	],
}
