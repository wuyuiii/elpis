{
    mode:'dashboard', // 模板类型，不同模板类型对应不一样的模板数据结构
    // 头部菜单
    menu:[{
        key:'', // 菜单唯一描述
        name:'', // 菜单名称
        menuType:'', // 枚举值：group / module
        // 当menuType为 group时，可填
        subMenu:[{
            // 可递归menuItem
        }],

        // 当menuType为 module时，可填
        moduleType:'',// 枚举值：sider / iframe / custom / schema

        // 当moduleType === sider时
        siderConfig:{
            menu:[{
                // 可递归menuItem（除module Type === sider）
            }]
        },
        // 当moduleType === iframe时
        iframeConfig:{
            path:'', // iframe路径
        },
        // 当moduleType === custom时
        customConfig:{
            path:'' // 自定义路由路径
        },
        // 当moduleType === schema时
        schemaConfig:{
            api:'', // 数据源API 遵循RESTFUL规范
            schema:{ // 板块数据结构
                type:'object',
                properties:{
                    key:{
                        ...schema, // 标准 JSON Schema配置
                        label:'', // 字段中文名
                        type:'', // 字段类型
                        // 字段在table中的相关配置
                        tableOptions:{
                            ...elTableColumnConfig, // 标准 el-table-column配置
                            visable:true // 默认为True，控制当前字段是否在表单中显示
                        }
                    }
                }
            },
            // table相关配置
            tableConfig:{
                headerButtons:[{
                    label:'', // 按钮名称
                    eventKey:'', // 按钮事件名
                    eventOptions:{}, // 按钮事件配置
                    ...elButtonConfig, // 标准el-button配置
                }],
                rowButtons:[{
                    label:'', // 按钮名称
                    eventKey:'', // 按钮事件名
                    eventOptions:{
                        // 当eventKey === remove时
                        params:{
                            // paramKey 为参数的键
                            // rowValue 为参数的值（当格式为schema::tableKey时，到table数据中找对应的字段）
                            paramKey:rowValueKey
                        }
                    }, // 按钮事件配置
                    ...elButtonConfig, // 标准el-button配置
                }]
            },
            searchConfig:{}, // search bar相关配置
            components:{} // 模块组件
        }
    }]
}