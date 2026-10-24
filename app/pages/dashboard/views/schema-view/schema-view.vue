<script setup>
import { provide } from 'vue'
import SearchPanel from './components/searchPanel'
import TablePanel from './components/tablePanel'

import { useSchema } from './hooks/useSchema'

const { api, tableSchema, tableConfig } = useSchema()

provide('schemaViewData', { api, tableSchema, tableConfig })
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
