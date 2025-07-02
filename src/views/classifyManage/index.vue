<script setup lang="ts">
import type { CatalogTreeVO, Classify, Catalog } from "@/api/classify/type.ts";
import {
  getCatalogById,
  getClassifyById,
  getClassifyTree, updateClassify,saveCatalog,removeCatalog,removeClassify
} from "@/api/classify";
import { updateProgress } from "@/utils/progressOverlay.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";

/**
 * 图书馆自习室树形结构
 */
const treeRef = ref<ElTreeInstance>();
const treeData = ref<CatalogTreeVO[]>([]);
// 记录当前 hover 的节点 ID
const hoverNodeId = ref<string | null>(null);
const getTree = async () => {
  const { result } = await getClassifyTree();
  if (result){
    treeData.value = result;
  }
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
const handleNodeClick = async (data: CatalogTreeVO) => {
  const level = data.level;
  const dataId = Number(data.id.split("|")[0]);
  if (level === 1) {
    //图书馆
    const { result } = await getClassifyById(dataId);
    if (result){
      Object.assign(classifyParams, result);
      showStatus.value = true;
      classifyFlag.value = true;
    }
  }else {
    //自习室
    const { result } = await getCatalogById(dataId);
    if (result){
      Object.assign(catalogParams, result);
      showStatus.value = true;
      classifyFlag.value = false;
    }
  }
};

//添加图书馆
const handleAddClassify = () => {
  Object.assign(classifyParams, defaultClassify);
  showStatus.value = true;
  classifyFlag.value = true;
};

const saveClassify = async () => {
  showLoading();
  const { code,result } = await updateClassify(classifyParams);
  if (code === 0){
    classifyParams.id = result;
    ElMessage.success('保存成功');
    await getTree();
  }
  closeLoading();
};

//添加自习室
const handleAddCatalog = (data: CatalogTreeVO) => {
  Object.assign(catalogParams, defaultCatalog);
  showStatus.value = true;
  classifyFlag.value = false;
  const level = data.level;
  const dataId = Number(data.id.split("|")[0]);
  if (level === 1){
    //上级是图书馆，这里就是最高层自习室
    catalogParams.level = 1;
    catalogParams.classifyId = dataId;
  }else {
    catalogParams.level = level;
    catalogParams.parentId = dataId;
  }
};

const updateCatalog = async () => {
  showLoading();
  const { code,result } = await saveCatalog(catalogParams);
  if (code === 0){
    catalogParams.id = result;
    ElMessage.success('保存成功');
    await getTree();
  }
  closeLoading();
};

//删除图书馆或自习室
const handleDelete = (data: CatalogTreeVO) => {
  const level = data.level;
  const dataId = Number(data.id.split("|")[0]);

  ElMessageBox.confirm(
    '确认删除吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then( async () => {
      showLoading();
      if (level === 1){
        const { code } = await removeClassify(dataId);
        if (code === 0){
          ElMessage.success('删除成功');
          Object.assign(classifyParams, defaultClassify);
          await getTree();
        }
      }else {
        const { code } = await removeCatalog(dataId);
        if (code === 0){
          ElMessage.success('删除成功');
          Object.assign(catalogParams, defaultCatalog);
          await getTree();
        }
      }
      closeLoading();
    });
};

//右侧是否显示
const showStatus = ref(false);
//是否编辑图书馆
const classifyFlag = ref(true);

/**
 * 编辑图书馆
 */
const classifyFormRef = ref<ElFormInstance>();
const defaultClassify:Classify = {
  id: null,
  name: '',
  description: '',
  iconPath: null,
  coverPath: null,
  personCount: 0,
  useType: 0,
  sort: 0
};
const classifyParams = reactive<Classify>(Object.assign({}, defaultClassify));

/**
 * 编辑自习室
 */
const catalogFormRef = ref<ElFormInstance>();
const defaultCatalog:Catalog = {
  id: null,
  classifyId: null,
  parentId:-1,
  level: 1,
  name: '',
  personCount: 0,
  sort: 0
};
const catalogParams = reactive<Catalog>(Object.assign({}, defaultCatalog));

/**
 * 图片
 */
const uploadOption: OssUploadOption = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  accept: ['.png','.jpg','.jpeg','.webp'],
  maxSizeMb: 5,
  partSize: 1024 * 256 , // 1MB
  parallel: 1,
  onProgress: (percentage) => {
    // 更新进度条
    updateProgress(percentage);
  }
};

onMounted(() => {
  showLoading();
  getTree();
  closeLoading();
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
    <div class="ca-btn">
      <el-button @click="handleAddClassify()" type="primary" >添加图书馆</el-button>
    </div>
    <el-tree
      class="tree-overflow"
      :data="treeData"
      ref="treeRef"
      node-key="id"
      empty-text=""
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
            <el-icon :size="19" color="#409eff" class="icon-item" @click.stop="handleAddCatalog(data)" >
              <i-ep-circle-plus />
            </el-icon>
            <el-icon :size="19" color="#f56c6c" class="icon-item" @click.stop="handleDelete(data)">
              <i-ep-delete />
            </el-icon>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>
  <el-card body-style="height: 90%;overflow:auto;" class="box-card card-right" shadow="hover">
    <template #header>
      详情
    </template>
    <el-form v-if="showStatus && classifyFlag" ref="classifyFormRef" :model="classifyParams" :inline="false" >
      <el-form-item label="名称" prop="name">
        <el-input v-model="classifyParams.name" clearable class="wid-200"  />
      </el-form-item>
      <el-form-item label="描述"  prop="description">
        <el-input v-model="classifyParams.description" type="textarea" :rows="5" clearable ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="classifyParams.sort" controls-position="right" :min="0" class="wid-200"  />
      </el-form-item>
      <el-form-item  label="开放使用" prop="useType">
        <el-radio-group v-model="classifyParams.useType">
          <el-radio :value="0" >否</el-radio>
          <el-radio :value="1" >是</el-radio>
        </el-radio-group>
      </el-form-item>
      <ImageUploader
        v-model="classifyParams.iconPath"
        :upload-option="uploadOption"
        title="头像"
        tip="图片大小不能超过5MB"
      />
      <ImageUploader
        v-model="classifyParams.coverPath"
        :upload-option="uploadOption"
        title="背景"
        tip="图片大小不能超过5MB"
      />
      <div class="btn-group-box">
        <div class="btn-box">
          <div>
            <el-button  type="primary" plain @click="saveClassify">完成编辑</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <el-form v-if="showStatus && !classifyFlag" ref="catalogFormRef" :model="catalogParams" :inline="false" >
      <el-form-item label="名称" prop="name">
        <el-input v-model="catalogParams.name" clearable class="wid-200"  />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="catalogParams.sort" controls-position="right" :min="0" class="wid-200"  />
      </el-form-item>
      <div class="btn-group-box">
        <div class="btn-box">
          <div>
            <el-button  type="primary" plain @click="updateCatalog">完成编辑</el-button>
          </div>
        </div>
      </div>
    </el-form>

  </el-card>
</div>
</template>

<style scoped>
.box{
  display: flex;
  flex-direction: row;
  height: 100%;
  gap: 10px;
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
  flex: 0 0 69%;
  max-width: 69%;
}
.tree-overflow{
  height: 90%;
  overflow: auto;
}
.custom-tree-node{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.icon-actions{
  display: flex;
  gap: 3px;
  align-items: center;
  padding-left: 20px;
}
.icon-item{
  transition: background-color 0.3s ease;
}
.icon-item:hover{
  background-color: #e3edf6; /* 比 el-tree 默认 hover 背景更浅的蓝色 */
  border-radius: 4px;        /* 可选：让悬停区域圆润一些 */
}
.ca-btn{
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
::v-deep(.con-img-tip) {
  margin-left: 39px;
}

::v-deep(.advert-upload-img) {
  margin-left: 39px;
}
.btn-group-box{
  position:fixed;
  bottom:20px;
  margin:10px 0 10px 0;
  width: 50%;
}
.btn-box{
  display:flex;
  justify-content:center;
  align-items:center;
}
</style>
