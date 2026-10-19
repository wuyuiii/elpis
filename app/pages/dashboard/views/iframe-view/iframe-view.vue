<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useMenuStore } from '../../store/menu';

const route = useRoute()
const menuStore = useMenuStore()

const path = ref('')

const setPath = () => {
    const { key, sider_key: siderKey } = route.query

    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: siderKey || key
    })

    path.value = menuItem?.iframeConfig?.path || ''
}

watch([
    () => route.query?.key,
    () => route.query?.sider_key,
    () => menuStore.menuList
], () => { setPath() })

onMounted(() => { setPath() })
</script>

<template>
  <iframe
    :src="path"
    class="iframe"
  />
</template>

<style lang="less" scoped>
.iframe {
    border: 0;
    width: 100%;
    height: 100%;
}
</style>
