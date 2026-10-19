<script setup>
import { ref, onMounted } from "vue"
import { request } from "$common/request"
import HeaderContainer from "$components/headerContainer/index.vue"
import { ElMessage } from "element-plus"

const loading = ref(false)
const modelList = ref([])

const getModelList = async () => {
	loading.value = true
	const res = await request.get("/api/project/model_list")
	loading.value = false

	if (!res || !res.success || !res.data) {
		return ElMessage({
			message: "获取模型列表异常",
			type: "error",
			plain: true,
		})
	}

	modelList.value = res.data
}

const onEnter = (projectItem) => {
	const { origin } = window.location
	window.open(`${origin}/view/dashboard#${projectItem.homePage}`)
}

onMounted(() => {
	getModelList()
})
</script>

<template>
  <HeaderContainer title="测试">
    <template #extend-content>
      <div v-loading="loading">
        <div
          v-for="item in modelList"
          :key="item.key"
          class="model-container"
        >
          <!-- 展示model -->
          <div class="model-panel">
            <el-row
              type="flex"
              align="middle"
              justify="space-between"
            >
              <div class="title">
                {{ item.model.name }}
              </div>
              <div class="desc">
                {{ item.model.desc }}
              </div>
            </el-row>
            <div class="divider" />
          </div>
          <!-- 展示project -->
          <el-row class="project-panel">
            <el-card
              v-for="projItem in item.project"
              :key="projItem.key"
              class="project-card"
            >
              <template #header>
                <div class="title">
                  {{ projItem.name }}
                </div>
              </template>
              <div class="content">
                {{ projItem.desc ?? "------" }}
              </div>
              <template #footer>
                <el-row justify="end">
                  <el-button
                    link
                    type="primary"
                    @click="onEnter(projItem)"
                  >
                    进入
                  </el-button>
                </el-row>
              </template>
            </el-card>
          </el-row>
        </div>
      </div>
    </template>
  </HeaderContainer>
</template>

<style lang="less" scoped>
.model-container {
	width: 100%;
	flex: 1;

	.model-panel {
		margin: 20px 50px;

		.title {
			font-size: 24px;
			font-weight: bold;
			color: #6d6d6d;
		}

		.desc {
			font-size: 16px;
			color: #b5b5b5;
		}

		.divider {
			margin-top: 10px;
			border-bottom: 1px dashed #d7d7d7;
			width: 100%;
		}
	}

	.project-panel {
		width: 100%;
		margin: 0 50px;
		.project-card {
			margin-right: 30px;
			margin-bottom: 20px;
			width: 300px;

			.title {
				font-weight: bold;
				font-size: 16px;
				color: #47a2ff;
			}

			.content {
				height: 70px;
				color: darkgrey;
				font-size: 14px;
				overflow-y: auto;
			}
		}
	}
}
</style>
