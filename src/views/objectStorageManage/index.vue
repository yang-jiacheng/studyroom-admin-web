<script setup lang="ts">
import { getObjectStoragePageList, deleteObjectStorage,saveObjectStorage } from "@/api/objectStorage/index.ts";
import type { ObjectStorage } from "@/api/objectStorage/type.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";
import {  updateProgress } from "@/utils/progressOverlay.ts";
import { copyToClipboardWithMessage } from "@/utils/clipboard.ts";

/**
 * 查询表单
 */
const queryFormRef = ref<ElFormInstance>();
const queryParams = ref({
  page: 1,
  limit: 10,
  name: ''
});

//查询对象存储列表
const handleQuery = () => {
  getObjectStorageList();
};

//重置
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  nextTick(() => {
    if (queryParams.value.page > 1){
      queryParams.value.page = 1;
    }else {
      getObjectStorageList();
    }
  });
};

/**
 * 对象存储列表
 */
const total = ref(0);
const loading = ref(false);
const objectStorageTableRef = ref<ElTableInstance>();
const objectStorageList = ref<ObjectStorage[]>([]);

const getObjectStorageList = async () => {
  loading.value = true;
  const { result } = await getObjectStoragePageList(queryParams.value);
  loading.value = false;
  if (result) {
    objectStorageList.value = result.records || [];
    total.value = result.total;
  }
};

const handleDownloadUrl = async (row: ObjectStorage) => {
  window.open(row.downloadUrl);
};

const showExportDialog = () => {
  dialogExport.visible = true;
};

//删除对象存储
const deleteObjectStorageItem = (row: ObjectStorage) => {
  ElMessageBox.confirm(
    '这将同步删除OSS服务中的文件 确认删除此文件吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then( async () => {
      const { code } = await deleteObjectStorage(row.id);
      if (code === 0) {
        ElMessage.success('删除成功');
        resetQuery();
      }
    });
};

/**
 * 上传文件弹窗
 */
const uploadOption: OssUploadOption = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  accept: [],
  maxSizeMb: 1024,
  partSize: 1024 * 1024, // 1MB
  parallel: 5,
  onProgress: (percentage) => {
    // 更新进度条
    updateProgress(percentage);
  }
};
const dialogExport = reactive<DialogOption>({
  visible: false,
  title: '上传文件'
});
const singleUploaderRef = ref();
const handleSuccess = async (file: FileItem) => {
  ElMessage.success(`文件上传成功`);
  cancelExportDialog();

  const payload = {
    fileName: file.name,
    fileSize: (file.size / (1024 * 1024)).toFixed(2),
    downloadUrl: file.url || ''
  };
  await saveObjectStorage(payload);
  resetQuery();
};

const handleError = (error: Error, file: FileItem) => {
  console.error('上传失败:', error, file);
  ElMessage.error(`文件 ${file.name} 上传失败: ${error.message}`);
  singleUploaderRef.value?.clearFiles();
};

const cancelExportDialog = () => {
  dialogExport.visible = false;
  singleUploaderRef.value?.clearFiles();
};

const submitExportDialog = () => {
  singleUploaderRef.value?.uploadFiles();
};

onMounted(async () => {
  showLoading();
  await getObjectStorageList();
  closeLoading();
});
</script>

<template>
<div>
  <div class="mb-10" >
    <el-card shadow="hover">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="文件名" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入文件名" clearable @keyup.enter="handleQuery" class="wid-200" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery" >
            <el-icon ><i-ep-search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button @click="resetQuery" >
            <el-icon ><i-ep-refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>

  <el-card shadow="hover">
    <template #header>
      <el-row :gutter="10" style="display: flex; justify-content: space-between;">
        <div>
          <el-button type="primary" plain @click="showExportDialog">
            <el-icon ><i-ep-plus /></el-icon>
            <span>添加文件</span>
          </el-button>
        </div>
      </el-row>
    </template>
    <el-table
      row-key="id"
      :border="false"
      v-loading="loading"
      :show-overflow-tooltip="true"
      :data="objectStorageList"
      ref="objectStorageTableRef"
    >
      <el-table-column label="文件名" prop="fileName" />
      <el-table-column label="文件大小(MB)" prop="fileSize" width="120"/>
      <el-table-column label="下载地址" prop="downloadUrl" min-width="300">
        <template #default="scope">
          <span class="down-a" @click="handleDownloadUrl(scope.row)" v-if="scope.row.downloadUrl">{{ scope.row.downloadUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="创建人" prop="creatorName" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <span class="operation-a red-color" @click="deleteObjectStorageItem(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 50, 100, 200]"
      background
      v-show="total > 0"
      :total="total"
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.limit"
      @change="getObjectStorageList"
    />
  </el-card>

  <el-dialog :close-on-click-modal="false" :destroy-on-close="true"   v-model="dialogExport.visible" :before-close="cancelExportDialog"  width="500">
    <template #header>
      <span style="font-size: 15px">{{dialogExport.title}}</span>
    </template>
    <div style="margin: 20px 0;">
      <DragUploader
        ref="singleUploaderRef"
        :multiple="false"
        :upload-option="uploadOption"
        @success="handleSuccess"
        @error="handleError"
      >
        <template #tip>
          <span class="el-upload__tip">文件大小不能超过1024MB，仅支持单文件上传</span>
        </template>
      </DragUploader>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitExportDialog"> 确定 </el-button>
        <el-button @click="cancelExportDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>

</div>
</template>

<style scoped>

</style>
