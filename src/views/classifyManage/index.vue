<script setup lang="ts">
import type { CatalogTreeVO, Classify, ClassifyEditDTO, Catalog, CatalogEditDTO } from "@/api/classify/type.ts";
import { getClassifyTree } from "@/api/classify";
import { showLoading,closeLoading } from "@/utils/loading.ts";

/**
 * 图书馆自习室树形结构
 */
const treeRef = ref<ElTreeInstance>();
const treeData = ref<CatalogTreeVO[]>([]);
// 记录当前 hover 的节点 ID
const hoverNodeId = ref<string | null>(null);
const getTree = async () => {
  showLoading();
  const { result } = await getClassifyTree();
  if (result){
    treeData.value = result;
  }
  closeLoading();
};
const queryParams = ref({
  name: ''
});
function filterTree () {
  const { name } = queryParams.value;
  treeRef.value?.filter(name);
}
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.name.includes(value);
};

// 树节点点击事件
const handleNodeClick = (data: CatalogTreeVO) => {
  console.log('点击了节点:', data);
};

const handleAdd = (nodeData: CatalogTreeVO) => {
  console.log("添加", nodeData);
};

const handleDelete = (nodeData: CatalogTreeVO) => {
  console.log("删除", nodeData);
};

onMounted(() => {
  getTree();
});
</script>

<template>
<div class="box">
  <el-card body-style="height: 90%;" class="box-card card-left" shadow="hover">
    <template #header>
      图书馆/自习室管理
    </template>
    <el-form :model="queryParams"   :inline="false">
      <el-form-item label="名称">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @change="filterTree" />
      </el-form-item>
    </el-form>
    <el-tree
      class="tree-overflow"
      :data="treeData"
      ref="treeRef"
      node-key="id"
      empty-text="加载中，请稍候"
      :default-expand-all="false"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      :props="{ label: 'name', children: 'children' }"
    >
      <template #default="{ node, data }">
        <div
          class="custom-tree-node"
          @mouseenter="hoverNodeId = data.id"
          @mouseleave="hoverNodeId = null"
        >
          <div>{{ data.name }}</div>
          <!-- 只有 hover 且 level < 3 时显示操作按钮 -->
          <div v-if="hoverNodeId === data.id && node.level < 3" class="icon-actions">
            <el-icon :size="19" color="#409eff" @click.stop="handleAdd(data)" >
              <i-ep-circle-plus />
            </el-icon>
            <el-icon :size="19" color="#f56c6c" @click.stop="handleDelete(data)">
              <i-ep-delete />
            </el-icon>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>
  <el-card class="box-card card-right" shadow="hover">
    <template #header>
      详情
    </template>
  </el-card>
</div>
</template>

<style scoped>

.box{
  display: flex;
  flex-direction: row;
  height: 100%;
  gap: 5px;
}
.box-card{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-left{
  flex: 0 0 30%;
  max-width: 30%;
}
.card-right{
  flex: 0 0 70%;
  max-width: 70%;
}
.tree-overflow{
  height: 100%;
  overflow: auto;
}
.custom-tree-node{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.custom-tree-node:hover {
  cursor: pointer;
}
.icon-actions{
  display: flex;
  gap: 3px;
  align-items: center;
  padding-left: 20px;
}
</style>
