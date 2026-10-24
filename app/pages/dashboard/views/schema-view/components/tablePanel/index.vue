<script setup>
import { inject, ref } from 'vue'
import SchemaTable from '$components/schemaTable'
import { request } from '$common/request'
import { ElMessageBox, ElNotification } from 'element-plus';

const emit = defineEmits(['operation'])

const { api, tableSchema, tableConfig } = inject('schemaViewData')

const schemaTableRef = ref(null)

const onRemove = async ({ btnConfig, rowData }) => {
  const { params } = btnConfig?.eventOptions ?? {}
  if (!params) return

  const key = Object.keys(params)[0]
  const splitValue = params[key].split('::')
  if (splitValue[0] === 'schema' && splitValue[1]) {
    await ElMessageBox.confirm(`确认删除${key} 为：${rowData[splitValue[1]]}的数据吗？`, '删除数据', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    schemaTableRef.value.showLoading()

    const res = await request.delete(api.value, {
      [key]: rowData[splitValue[1]]
    })

    schemaTableRef.value.hideLoading()

    if (!res || !res.success || !res.data) {
      return
    }

    ElNotification({
      title: '删除成功',
      message: '删除成功',
      type: 'success'
    })

    await initData()

  }
}

const EventHandlerMap = {
  remove: onRemove
}
const operationHandler = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData })
  } else {
    emit('operation', { btnConfig, rowData })
  }
}

const getTableData = async () => {
  await schemaTableRef.value.getTableData()
}

const initData = async () => {
  await schemaTableRef.value.initData()
}

defineExpose({
  getTableData,
  initData
})
</script>

<template>
  <el-card class="table-panel">
    <!-- operation panel -->
    <el-row
      v-if="tableConfig?.headerButtons?.length"
      justify="end"
      class="operation-panel"
    >
      <el-button
        v-for="item in tableConfig?.headerButtons"
        :key="item"
        v-bind="item"
        @click="operationHandler({ btnConfig: item, rowData: undefined })"
      >
        {{ item.label }}
      </el-button>
    </el-row>
    <!-- schema panel 公共组件 -->
    <SchemaTable
      ref="schemaTableRef"
      :api="api"
      :schema="tableSchema"
      :buttons="tableConfig?.rowButtons"
      @operation="operationHandler"
    />
  </el-card>
</template>

<style lang="less" scoped>
.table-panel {
  flex: 1;
  margin: 10px;

  .operation-panel {
    margin-bottom: 10px;
  }
}

:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>