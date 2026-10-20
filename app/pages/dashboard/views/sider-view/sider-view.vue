<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMenuStore } from "../../store/menu.js"
import SubMenu from "../../components/subMenu.vue"
import SiderContainer from "$components/siderContainer"

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const activeKey = ref('')
const menuList = ref([])

const setActive = () => {
  const siderMenu = menuStore.findMenuItem({
    key: 'key',
    value: route.query?.sider_key
  })


  // 首次加载时用户未选中左侧菜单，默认选择第一个
  if (!siderMenu) {
    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: route.query?.key
    })

    if (menuItem && menuItem.siderConfig && Array.isArray(menuItem.siderConfig.menu)) {
      const firstItem = menuStore.findFirstMenuItem(menuItem.siderConfig.menu) // 找出菜单第一项

      if (firstItem) {
        handleMenuSelect(firstItem.key)
        activeKey.value = firstItem.key
      }

    }
  } else {
    activeKey.value = siderMenu.key
  }

}

const setMenuList = () => {
  const menu = menuStore.findMenuItem({
    key: 'key',
    value: route.query?.key
  })
  if (menu && menu.siderConfig && Array.isArray(menu.siderConfig.menu)) {
    menuList.value = menu.siderConfig.menu
  }
}


watch(() => route.query?.key, (newV, oldV) => {
  if (newV === oldV) return
  setActive()
  setMenuList()
})

watch(() => menuStore.menuList, () => {
  setActive()
  setMenuList()
})

onMounted(() => {
  setActive()
  setMenuList()
})

const onMenuSelect = (value) => {
  handleMenuSelect(value)
}

const handleMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({ key: 'key', value: menuKey }) || {}
  const { moduleType, customConfig } = menuItem

  const pathMap = {
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path
  }

  router.push({
    path: `/sider${pathMap[moduleType]}`,
    query: {
      ...route.query,
      sider_key: menuKey
    }
  })
}
</script>

<template>
  <SiderContainer>
    <template #menu-content>
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        @select="onMenuSelect"
      >
        <template
          v-for="item in menuList"
          :key="item.key"
        >
          <!-- 处理group -->
          <SubMenu
            v-if="item.menuType === 'group' && Array.isArray(item.subMenu) && item.subMenu.length > 0"
            :menu-item="item"
          />
          <!-- 处理module -->
          <el-menu-item
            v-else
            :index="item.key"
          >
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view />
    </template>
  </sidercontainer>
</template>

<style lang="less" scoped></style>
