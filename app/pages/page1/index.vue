<script setup>
import { ref } from "vue"

const content = ref("")
</script>

<template>
  <h1>page1</h1>
  <input v-model="content">
  <div>{{ content }}</div>
  <p>1234</p>
  <p>1234</p>
</template>

<style lang="less" scoped>
h1 {
    color:red;
}
</style>
