<!-- schemaTable -->
<script setup>
import { ref, computed, toRefs, onMounted, watch } from 'vue'
import { throttle } from 'lodash'
import { request } from '$common/request'

const props = defineProps({
  /**
   * schema相关配置
   * {
   *   type:'object',
   *   properties: {
   *     key: {
   *       ...schema, // 标准 JSON Schema配置
   *       label:'', // 字段中文名
   *       type:'', // 字段类型
   *       // 字段在table中的相关配置
   *       options: {
   *         ...elTableColumnConfig, // 标准 el-table-column配置
   *         visable:true // 默认为True，控制当前字段是否在表单中显示
   *       }
   *     }
   *   }
   * }
   */
  schema: {
    type: Object,
    default: null
  },
  /**
   * table 数据源api
   */
  api: {
    type: String,
    default: ''
  },
  /**
   * 操作按钮相关配置
   * [{
   *   label:'', // 按钮名称
   *   eventKey:'', // 按钮事件名
   *   enventOptions:{}, // 按钮事件配置
   *   ...elButtonConfig, // 标准el-button配置
   * }]
   */
  buttons: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['operation'])

const { api, schema, buttons } = toRefs(props)

const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

/**
 * 根据schema对table data渲染前的预处理方法
 * @param listData table数据
 */
const buildTableData = (listData) => {
  if (!schema.value?.properties) {
    return listData
  }

  return listData.map(rowData => {
    for (const k in rowData) {
      const schemaItem = schema.value.properties[k]

      if (schemaItem?.options?.toFixed) {
        rowData[k] = rowData[k].toFixed && rowData[k].toFixed(schemaItem.options.toFixed)
      }
    }

    return rowData
  })

}

const showLoading = () => {
  loading.value = true
}

const hideLoading = () => {
  loading.value = false
}

const getTableData = throttle(async () => {
  if (!api.value) return

  showLoading()

  const res = await request.get(`${api.value}/list`, {
    page: currentPage.value,
    size: pageSize.value
  })

  hideLoading()

  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = []
    total.value = 0
    return
  }

  tableData.value = buildTableData(res.data)
  total.value = res.metadata.total
}, 200)

const initData = () => {
  currentPage.value = 1
  pageSize.value = 20
  total.value = 0
  getTableData()
}

onMounted(() => {
  initData()
})

watch([schema, api, buttons], () => {
  initData()
}, { deep: true })

// 根据buttons个数计算操作栏最终width
const operationWidth = computed(() => {
  return buttons.value?.length ? buttons.value.reduce((pre, cur) => {
    return pre + cur.label.length * 18
  }, 50) : 50
})

const operationHandler = ({ btnConfig, rowData }) => {
  emit('operation', { btnConfig, rowData })
}

const onPageSizeChange = (value) => {
  pageSize.value = value
  getTableData()

}

const onCurrentPageChange = (value) => {
  currentPage.value = value
  getTableData()

}

defineExpose({
  initData,
  getTableData,
  showLoading,
  hideLoading
})

</script>

<template>
  <div class="schema-table">
    <el-table
      v-if="schema && schema?.properties"
      v-loading="loading"
      class="table"
      :data="tableData"
    >
      <template
        v-for="(item, key) in schema.properties"
        :key="key"
      >
        <el-table-column
          v-if="item.options.visible !== false"
          :key="key"
          :label="item.label"
          :prop="key"
          v-bind="item.options"
        />
      </template>
      <el-table-column
        v-if="buttons?.length"
        label="操作"
        fixed="right"
        :width="operationWidth"
      >
        <template #default="scope">
          <el-button
            v-for="item in buttons"
            :key="item.label"
            v-bind="item"
            link
            @click="operationHandler({ btnConfig: item, rowData: scope.row })"
          >
            {{ item.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
      />
    </el-row>
  </div>
</template>

<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .table {
    flex: 1;
  }

  .pagination {
    margin: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>