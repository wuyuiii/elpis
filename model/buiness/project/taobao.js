module.exports = {
	name: "淘宝",
	desc: "淘宝电商系统",
	homePage: "/schema?project_key=taobao&key=product",
	menu: [
		{
			key: "order",
			moduleType: "iframe",
			iframeConfig: {
				path: "https://www.runoob.com",
			},
		},
		{
			key: "operating",
			name: "运营活动",
			menuType: "module",
			moduleType: "sider",
			siderConfig: {
				menu: [
					{
						key: "coupon",
						name: "优惠券",
						menuType: "module",
						moduleType: "custom",
						customConfig: {
							path: "/todo",
						},
					},
					{
						key: "limited",
						name: "限量购",
						menuType: "module",
						moduleType: "custom",
						customConfig: {
							path: "/todo",
						},
					},
					{
						key: "festival",
						name: "节日活动",
						menuType: "module",
						moduleType: "custom",
						customConfig: {
							path: "/todo",
						},
					},
					{
						key: "test",
						name: "测试sider submenu",
						menuType: "group",
						subMenu: [
							{
								key: "test-submenu",
								name: "测试sider subMenu subMenu",
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
	],
}
