<script setup>
import HeaderContainer from "$components/headerContainer"
import SubMenu from "../../components/subMenu.vue"
import { ref, watch } from "vue"

import { useMenuStore } from "../../store/menu.js"
import { useProjectStore } from "../../store/project.js"
import { useRoute } from "vue-router"

defineProps({
  projectName: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["menu-select"])

const route = useRoute()
const menuStore = useMenuStore()
const projectStore = useProjectStore()

const active = ref(0)

const setActive = () => {
  const menuItem = menuStore.findMenuItem({ key: "key", value: route.query?.key })
  active.value = menuItem?.key
}

watch(
  () => route.query?.key,
  (newV, oldV) => {
    if (newV === oldV) return
    setActive()
  },
)

watch(
  () => menuStore.menuList,
  (newV, oldV) => {
    if (newV === oldV) return
    setActive()
  },
)

const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({ key: "key", value: menuKey })
  emit("menu-select", menuItem)
}

const handleCommand = (value) => {
  const projectItem = projectStore.projectList.find((item) => item.key === value)

  if (!projectItem || !projectItem.homePage) return

  const { origin, pathname } = window.location
  window.location.replace(`${origin}${pathname}#${projectItem.homePage}`)
  window.location.reload()
}
</script>

<template>
  <HeaderContainer :title="projectName">
    <template #menu-content>
      <!-- 根据 menuStore.menuList 渲染 -->
      <el-menu
        :default-active="active"
        mode="horizontal"
        :ellipsis="false"
        @select="onMenuSelect"
      >
        <template
          v-for="menuItem in menuStore.menuList"
          :key="menuItem.key"
        >
          <SubMenu
            v-if="menuItem.subMenu && menuItem.subMenu.length > 0"
            :menu-item="menuItem"
          />
          <el-menu-item
            v-else
            :index="menuItem.key"
          >
            {{ menuItem.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #setting-content>
      <!-- 根据 projectStore.projectList 渲染 -->
      <el-dropdown
        class="project-list-container"
        @command="handleCommand"
      >
        <span class="project-list-title">
          {{ projectName }}
          <el-icon
            v-if="projectStore.projectList.length > 1"
            class="el-icon--right"
          >
            <arrow-down />
          </el-icon>
        </span>
        <template
          v-if="projectStore.projectList.length > 1"
          #dropdown
        >
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in projectStore.projectList"
              :key="item.key"
              :command="item.key"
              :disabled="item.name === projectName"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #main-content>
      <slot name="main-content" />
    </template>
  </HeaderContainer>
</template>

<style lang="less" scoped>
.project-list-container {
  margin-right: 10px;

  .project-list-title {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }

  .active {
    color: red;
  }
}
</style>
