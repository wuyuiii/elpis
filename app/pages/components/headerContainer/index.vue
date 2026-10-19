<script setup>
import {ref} from 'vue'
defineProps({
    title:{
        type:String,
        default:''
    }
})

const userName = ref('ichl')
const handleUserCommand = (event)=>{
    console.log(event);

}
</script>

<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row
        type="flex"
        align="middle"
        class="header-row"
      >
        <!-- 左侧信息区域 -->
        <el-row
          type="flex"
          align="middle"
          class="title-panel"
        >
          <el-row class="text">
            {{ title }}
          </el-row>
        </el-row>
        <!-- 左侧信息区域 end -->

        <!-- 中间区域插槽 -->
        <el-row
          type="flex"
          align="middle"
          class="menu-panel"
        >
          <slot name="menu-content" />
        </el-row>
        <!-- 中间区域插槽 end -->

        <!-- 右侧区域插槽 -->
        <el-row
          type="flex"
          align="middle"
          justify="end"
          class="setting-panel"
        >
          <slot name="setting-content" />
          <img
            src="./assets/avatar.png"
            class="avatar"
          >
          <el-dropdown @command="handleUserCommand">
            <span class="username">
              {{ userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-row>
        <!-- 右侧区域插槽 end -->
      </el-row>
    </el-header>
    <el-main class="main-container">
      <!-- 外部拓展 -->
      <slot name="extend-content" />
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
.header-container {
    height: 100%;
    min-width: 1000px;
    overflow: hidden;

    .header{
        max-height: 120px;
        width: 100%;
        border-bottom: 1px solid #e8e8e8;
        .header-row {
            width: 100%;
            height: 100%;
            padding: 0 20px;
            .title-panel{
                width: 180px;
                min-width: 180px;
                .logo{
                    margin-right: 10px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                .text{
                    font-size: 15px;
                    font-weight: 500;
                }
            }

            .menu-panel{
                flex:1;
                height: 100%;
            }

            .setting-panel{
                .avatar{
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                .username {
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
    .main-container{}
}

::deep(.el-header){
    padding: 0;
}
</style>