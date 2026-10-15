<script setup>
import { ref,onMounted } from "vue"
import {request} from '$common/request'
const content = ref("")

const tableData = ref([])

const getList = async ()=>{
  const {data,success} = await request.get('/api/project/list',{
    project_key:'test',
    name:'1'
  })

  if(success){
    tableData.value = data
  }

}

onMounted(()=>{
  getList()
})
</script>

<template>
  <h1>page1</h1>
  <el-input
    v-model="content"
    style="width: 300px;"
  />
  <div>{{ content }}</div>
  <hr>

  <el-table
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      label="Name"
      width="180"
    />
    <el-table-column
      prop="desc"
      label="Description"
    />
  </el-table>
</template>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
