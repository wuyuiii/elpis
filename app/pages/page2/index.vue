<script setup>
import { ref } from "vue"
import utils from "$common/utils";

console.log(utils);
const content = ref("")
</script>

<template>
  <h1>page2</h1>
  <input v-model="content">
  <div>{{ content }}</div>
</template>

<style lang="less" scoped>
h1 {
    color:blue;
}
</style>
