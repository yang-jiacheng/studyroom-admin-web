<template>
  <div class="drag-uploader-example">
    <el-card shadow="hover">
      <template #header>
        <span>拖拽上传组件示例</span>
      </template>

      <!-- 基本使用 -->
      <div class="example-section">
        <h3>基本使用（单文件）</h3>
        <DragUploader
          ref="singleUploaderRef"
          :upload-option="uploadOption"
          @success="handleSuccess"
          @error="handleError"
          @change="handleChange"
        >
          <template #tip>
            <span class="el-upload__tip">文件大小和类型限制通过uploadOption配置，单文件模式</span>
          </template>
        </DragUploader>

        <!-- 上传按钮 -->
        <div class="upload-buttons">
          <el-button
            type="primary"
            :loading="isUploading"
            :disabled="!singleUploaderRef?.hasWaitingFiles"
            @click="uploadSingleFiles"
          >
            <el-icon><i-ep-upload /></el-icon>
            <span>{{ isUploading ? '上传中...' : '开始上传' }}</span>
          </el-button>
          <el-button
            @click="clearSingleFiles"
            :disabled="isUploading"
          >
            <el-icon><i-ep-delete /></el-icon>
            <span>清空列表</span>
          </el-button>
        </div>
      </div>

      <!-- 多文件上传 -->
      <div class="example-section">
        <h3>多文件上传</h3>
        <DragUploader
          ref="multiUploaderRef"
          multiple
          :upload-option="uploadOption"
          @success="handleSuccess"
          @error="handleError"
          @change="handleChange"
        >
          <template #header>
            <el-alert
              title="支持多文件上传"
              type="info"
              show-icon
              :closable="false"
            />
          </template>
          <template #tip>
            <span class="el-upload__tip">文件大小和类型限制通过uploadOption配置，多文件模式</span>
          </template>
        </DragUploader>

        <!-- 上传按钮 -->
        <div class="upload-buttons">
          <el-button
            type="primary"
            :loading="isUploading"
            :disabled="!multiUploaderRef?.hasWaitingFiles"
            @click="uploadMultiFiles"
          >
            <el-icon><i-ep-upload /></el-icon>
            <span>{{ isUploading ? '上传中...' : '开始上传' }}</span>
          </el-button>
          <el-button
            @click="clearMultiFiles"
            :disabled="isUploading"
          >
            <el-icon><i-ep-delete /></el-icon>
            <span>清空列表</span>
          </el-button>
        </div>
      </div>

      <!-- 自定义头部内容 -->
      <div class="example-section">
        <h3>自定义头部内容（单文件）</h3>
        <DragUploader
          ref="customUploaderRef"
          :upload-option="uploadOption"
          @success="handleSuccess"
          @error="handleError"
          @change="handleChange"
        >
          <template #header>
            <div class="custom-header">
              <el-button type="primary" size="small">
                <el-icon><i-ep-download /></el-icon>
                <span>下载模板</span>
              </el-button>
              <el-button type="success" size="small">
                <el-icon><i-ep-question-filled /></el-icon>
                <span>使用说明</span>
              </el-button>
            </div>
          </template>
          <template #tip>
            <div class="custom-tip">
              <span>文件大小和类型限制通过uploadOption配置</span>
              <br>
              <span>单文件模式</span>
            </div>
          </template>
        </DragUploader>

        <!-- 上传按钮 -->
        <div class="upload-buttons">
          <el-button
            type="primary"
            :loading="isUploading"
            :disabled="!customUploaderRef?.hasWaitingFiles"
            @click="uploadCustomFiles"
          >
            <el-icon><i-ep-upload /></el-icon>
            <span>{{ isUploading ? '上传中...' : '开始上传' }}</span>
          </el-button>
          <el-button
            @click="clearCustomFiles"
            :disabled="isUploading"
          >
            <el-icon><i-ep-delete /></el-icon>
            <span>清空列表</span>
          </el-button>
        </div>
      </div>

            <!-- 上传结果展示 -->
      <div class="example-section">
        <h3>上传结果</h3>
        <el-table :data="uploadResults" style="width: 100%">
          <el-table-column prop="name" label="文件名" />
          <el-table-column prop="size" label="文件大小">
            <template #default="scope">
              {{ formatFileSize(scope.row.size) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 'success'" type="success">成功</el-tag>
              <el-tag v-else-if="scope.row.status === 'error'" type="danger">失败</el-tag>
              <el-tag v-else-if="scope.row.status === 'uploading'" type="warning">上传中</el-tag>
              <el-tag v-else type="info">等待上传</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="文件链接">
            <template #default="scope">
              <el-link v-if="scope.row.url" :href="scope.row.url" target="_blank">查看</el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import DragUploader from "@/components/upload/DragUploader.vue";
import { updateProgress } from "@/utils/progressOverlay.ts";

// 上传配置
const uploadOption: OssUploadOption = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  accept: ['.jpg', '.jpeg', '.png', '.pdf' ,'.docx',  '.xlsx', '.pptx', '.exe'],
  maxSizeMb: 100,
  partSize: 1024 * 1024, // 1MB
  parallel: 5,
  onProgress: (percentage) => {
    updateProgress(percentage);
  }
};

// 组件引用
const singleUploaderRef = ref();
const multiUploaderRef = ref();
const customUploaderRef = ref();

// 上传状态
const isUploading = ref(false);

// 上传结果
const uploadResults = ref<FileItem[]>([]);

// 事件处理
const handleSuccess = (file: FileItem, fileList: FileItem[]) => {
  console.log('上传成功:', file);
  ElMessage.success(`文件 ${file.name} 上传成功`);

  // 更新上传结果
  const existingIndex = uploadResults.value.findIndex(item => item.name === file.name);
  if (existingIndex !== -1) {
    uploadResults.value[existingIndex] = file;
  } else {
    uploadResults.value.push(file);
  }
};

const handleError = (error: Error, file: FileItem, fileList: FileItem[]) => {
  console.error('上传失败:', error, file);
  ElMessage.error(`文件 ${file.name} 上传失败: ${error.message}`);

  // 更新上传结果
  const existingIndex = uploadResults.value.findIndex(item => item.name === file.name);
  if (existingIndex !== -1) {
    uploadResults.value[existingIndex] = file;
  } else {
    uploadResults.value.push(file);
  }
};

const handleChange = (fileList: FileItem[]) => {
  console.log('文件列表变化:', fileList);
};

// 上传方法
const uploadSingleFiles = async () => {
  if (singleUploaderRef.value) {
    isUploading.value = true;
    try {
      await singleUploaderRef.value.uploadFiles();
    } finally {
      isUploading.value = false;
    }
  }
};

const uploadMultiFiles = async () => {
  if (multiUploaderRef.value) {
    isUploading.value = true;
    try {
      await multiUploaderRef.value.uploadFiles();
    } finally {
      isUploading.value = false;
    }
  }
};

const uploadCustomFiles = async () => {
  if (customUploaderRef.value) {
    isUploading.value = true;
    try {
      await customUploaderRef.value.uploadFiles();
    } finally {
      isUploading.value = false;
    }
  }
};

// 清空方法
const clearSingleFiles = () => {
  if (singleUploaderRef.value) {
    singleUploaderRef.value.clearFiles();
  }
};

const clearMultiFiles = () => {
  if (multiUploaderRef.value) {
    multiUploaderRef.value.clearFiles();
  }
};

const clearCustomFiles = () => {
  if (customUploaderRef.value) {
    customUploaderRef.value.clearFiles();
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.drag-uploader-example {
  padding: 20px;
}

.example-section {
  margin-bottom: 30px;
}

.example-section h3 {
  color: #409eff;
  margin-bottom: 15px;
  font-size: 16px;
}

.custom-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.custom-tip {
  color: #909399;
  font-size: 12px;
}

.el-upload__tip {
  color: #606266;
  font-size: 12px;
}

.upload-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
}
</style>
