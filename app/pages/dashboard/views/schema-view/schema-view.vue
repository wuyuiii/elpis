<script setup>
import SearchPanel from './components/searchPanel'
import TablePanel from './components/tablePanel'

import { useSchema } from './hooks/useSchema'

const { api } = useSchema()

console.log(api.value);

</script>

<template>
  <el-row class="shcema-view">
    <SearchPanel />
    <TablePanel />
  </el-row>
</template>

<style lang="less" scoped>
.shcema-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>
