import { ref, watch, onMounted, nextTick } from "vue"
import { useRoute } from "vue-router"
import { useMenuStore } from "../../../store/menu"

export const useSchema = () => {
	const route = useRoute()
	const menuStore = useMenuStore()

	const api = ref("")
	const tableSchema = ref(null)
	const tableConfig = ref(null)

	// 通用构建schema方法，根据传入的key和schema构建key专属的schema
	const buildSchema = (schema, key) => {
		if (!schema?.properties) return null

		const schemaData = {
			type: "object",
			properties: {},
		}

		// 提取对应schema字段信息
		for (const k in schema.properties) {
			const item = schema.properties[k]
			//  tableOptions、searchBarOptions、formOptions...
			if (item[`${key}Options`]) {
				let props = {}
				for (const iKey in item) {
					if (iKey.indexOf("Options") < 0) {
						props[iKey] = item[iKey]
					}
				}

				// 处理common Options
				props = { ...props, options: item[`${key}Options`] }
				schemaData.properties[k] = props
			}
		}

		return schemaData
	}

	// 构造schemaConfig相关配置，输送给schema-view解析
	const buildData = () => {
		const { key, sider_key: siderKey } = route.query

		const menuItem = menuStore.findMenuItem({
			key: "key",
			value: siderKey || key,
		})

		if (menuItem && menuItem.schemaConfig) {
			const { schemaConfig } = menuItem
			console.log(schemaConfig, schemaConfig.tableConfig, schemaConfig.tableConfig.rowButtons)

			// 深拷贝获取源 schema
			const schema = JSON.parse(JSON.stringify(schemaConfig.schema))
			api.value = schemaConfig.api || ""

			nextTick(() => {
				tableSchema.value = buildSchema(schema, "table")
				tableConfig.value = schemaConfig.tableConfig
			})
		}
	}

	watch(
		[() => route.query?.key, () => route.query?.sider_key, () => menuStore.menuList],
		() => {
			buildData()
		},
		{
			deep: true,
		},
	)

	onMounted(() => {
		buildData()
	})

	return { api, tableSchema, tableConfig }
}
