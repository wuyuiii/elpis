import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useMenuStore } from "../../../store/menu"

export const useSchema = () => {
	const route = useRoute()
	const menuStore = useMenuStore()

	const api = ref("")

	// 构造schemaConfig相关配置，输送给schema-view解析
	const buildData = () => {
		const { key, sider_key: siderKey } = route.query

		const menuItem = menuStore.findMenuItem({
			key: "key",
			value: siderKey || key,
		})

		if (menuItem && menuItem.schemaConfig) {
			const { schemaConfig } = menuItem
			api.value = schemaConfig.api || ""
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

	return { api }
}
