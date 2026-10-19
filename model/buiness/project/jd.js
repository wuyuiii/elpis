module.exports = {
	name: "京东",
	desc: "京东电商系统",
	homePage: "/todo?project_key=jd&key=product",
	menu: [
		{
			key: "shop-setting",
			name: "店铺配置",
			menuType: "group",
			subMenu: [
				{
					key: "info-setting",
					name: "店铺信息设置",
					menuType: "module",
					moduleType: "custom",
					customConfig: {
						path: "/todo",
					},
				},
				{
					key: "quality-setting",
					name: "店铺资质配置",
					menuType: "module",
					moduleType: "iframe",
					iframeConfig: {
						path: "https://www.baidu.com",
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
								path: "https://www.baidu.com",
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
	],
}
