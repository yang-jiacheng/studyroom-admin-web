<template>
  <div class="drag-uploader">
    <!-- 上方插槽区域 -->
    <div v-if="$slots.header" class="drag-uploader-header">
      <slot name="header"></slot>
    </div>

    <!-- 拖拽区域 -->
    <div
      class="drag-uploader-dragger"
      :class="{
        'is-dragover': isDragOver,
        'is-uploading': isUploading
      }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <!-- 文件输入框 -->
      <input
        ref="fileInputRef"
        type="file"
        class="drag-uploader-input"
        :accept="acceptString"
        :multiple="multiple"
        @change="handleFileChange"
      />

      <!-- 上传图标 -->
      <el-icon class="drag-uploader-icon" :size="40">
        <i-ep-upload-filled />
      </el-icon>

      <!-- 上传文字 -->
      <div class="drag-uploader-text">
        将文件拖到此处，或<em>点击选择文件</em>
      </div>
    </div>

    <!-- 提示信息 -->
    <div v-if="$slots.tip" class="drag-uploader-tip">
      <slot name="tip"></slot>
    </div>

    <!-- 文件列表 -->
    <div v-if="showFileList && fileList.length > 0" class="drag-uploader-files">
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="drag-uploader-file"
        :class="{
          'is-success': file.status === 'success',
          'is-error': file.status === 'error',
          'is-waiting': file.status === 'waiting',
          'is-uploading': file.status === 'uploading'
        }"
      >
        <div class="drag-uploader-file-info">
          <el-icon class="drag-uploader-file-icon">
            <i-ep-document />
          </el-icon>
          <span class="drag-uploader-file-name">{{ file.name }}</span>
        </div>
        <div class="drag-uploader-file-actions">
          <el-icon
            v-if="file.status === 'success'"
            class="drag-uploader-file-status-icon is-success"
          >
            <i-ep-check />
          </el-icon>
          <el-icon
            v-if="file.status === 'error'"
            class="drag-uploader-file-status-icon is-error"
          >
            <i-ep-close />
          </el-icon>
          <el-icon
            v-if="file.status === 'waiting'"
            class="drag-uploader-file-status-icon is-waiting"
          >
            <i-ep-clock />
          </el-icon>
          <el-icon
            v-if="file.status === 'uploading'"
            class="drag-uploader-file-status-icon is-uploading"
          >
            <i-ep-loading />
          </el-icon>
          <el-icon
            v-if="file.status !== 'uploading'"
            class="drag-uploader-file-remove"
            @click="removeFile(index)"
          >
            <i-ep-delete />
          </el-icon>
        </div>
              </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useOss from "@/hooks/useOSS.ts";
import { showProgress, closeProgress, updateProgress } from "@/utils/progressOverlay.ts";

interface Props {
  multiple?: boolean;
  showFileList?: boolean;
  uploadOption?: OssUploadOption;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  showFileList: true,
  uploadOption: () => ({
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    accept: [],
    maxSizeMb: 5,
    partSize: 1024 * 1024, // 1MB
    parallel: 5
  })
});

const emit = defineEmits<{
  (e: 'success', file: FileItem, fileList: FileItem[]): void;
  (e: 'error', error: Error, file: FileItem, fileList: FileItem[]): void;
  (e: 'progress', percentage: number, file: FileItem): void;
  (e: 'change', fileList: FileItem[]): void;
}>();

const { checkFile, uploadFile } = useOss();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const isUploading = ref(false);
const fileList = ref<FileItem[]>([]);

// 动态计算 accept 字符串
const acceptString = computed(() => {
  return props.uploadOption?.accept && props.uploadOption.accept.length > 0 ? props.uploadOption.accept.join(',') : '*';
});

// 检查是否有等待上传的文件
const hasWaitingFiles = computed(() => {
  return fileList.value.some(file => file.status === 'waiting');
});

// 合并上传配置
const mergedUploadOption = computed(() => {
  return {
    ...props.uploadOption,
    onProgress: (percentage: number) => {
      updateProgress(percentage);
    }
  };
});

// 拖拽事件处理
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragOver.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  // 只有当离开整个拖拽区域时才设置为false
  if (!(e.currentTarget as Element)?.contains(e.relatedTarget as Node)) {
    isDragOver.value = false;
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragOver.value = false;

  const files = e.dataTransfer?.files;
  if (files) {
    handleFiles(Array.from(files));
  }
};

// 点击上传
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// 文件输入框变化
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    handleFiles(Array.from(files));
  }
  // 清空input值，允许重复上传同一文件
  target.value = '';
};

// 处理文件
const handleFiles = (files: File[]) => {
  if (!props.multiple && files.length > 1) {
    ElMessage.warning('只能上传一个文件');
    return;
  }

  // 单文件模式下，清空现有文件列表
  if (!props.multiple) {
    fileList.value = [];
  }

  files.forEach(file => {
    // 文件校验
    const isValid = checkFile(file, mergedUploadOption.value);
    if (!isValid) {
      return;
    }

    const fileItem: FileItem = {
      name: file.name,
      size: file.size,
      status: 'waiting',
      raw: file
    };

    fileList.value.push(fileItem);
  });

  emit('change', fileList.value);
};

// 上传所有等待的文件
const uploadFiles = async () => {
  const waitingFiles = fileList.value.filter(file => file.status === 'waiting');
  if (waitingFiles.length === 0) {
    ElMessage.warning('没有等待上传的文件');
    return;
  }

  isUploading.value = true;
  showProgress();

  try {
    for (const fileItem of waitingFiles) {
      await uploadSingleFile(fileItem);
    }
  } finally {
    isUploading.value = false;
    // 无论上传成功还是失败，都清空文件列表
    fileList.value = [];
    emit('change', fileList.value);
    setTimeout(() => {
      closeProgress();
    }, 300);
  }
};

// 上传单个文件
const uploadSingleFile = async (fileItem: FileItem) => {
  if (!fileItem.raw) return;

  try {
    fileItem.status = 'uploading';

    // 上传文件
    const url = await uploadFile(fileItem.raw, mergedUploadOption.value);

    if (url) {
      fileItem.status = 'success';
      fileItem.url = url;
      emit('success', fileItem, fileList.value);
    } else {
      throw new Error('上传失败');
    }
  } catch (error) {
    fileItem.status = 'error';
    emit('error', error as Error, fileItem, fileList.value);
  }
};

// 移除文件
const removeFile = (index: number) => {
  fileList.value.splice(index, 1);
  emit('change', fileList.value);
};

// 清空文件列表
const clearFiles = () => {
  fileList.value = [];
  emit('change', fileList.value);
};

// 获取成功上传的文件列表
const getSuccessFiles = () => {
  return fileList.value.filter(file => file.status === 'success');
};

// 暴露方法
defineExpose({
  uploadFiles,
  clearFiles,
  getSuccessFiles,
  hasWaitingFiles
});
</script>

<style scoped>
.drag-uploader {
  width: 100%;
}

.drag-uploader-header {
  margin-bottom: 10px;
}

.drag-uploader-dragger {
  position: relative;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 180px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.drag-uploader-dragger:hover {
  border-color: #409eff;
}

.drag-uploader-dragger.is-dragover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.drag-uploader-dragger.is-uploading {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.drag-uploader-input {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
}

.drag-uploader-icon {
  color: #8c939d;
  margin-bottom: 16px;
}

.drag-uploader-text {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

.drag-uploader-text em {
  color: #409eff;
  font-style: normal;
}

.drag-uploader-tip {
  color: #606266;
  font-size: 12px;
  margin-top: 7px;
  text-align: center;
}

.drag-uploader-files {
  margin-top: 10px;
}

.drag-uploader-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 5px;
  background-color: #fff;
  transition: all 0.3s;
}

.drag-uploader-file:hover {
  background-color: #f5f7fa;
}

.drag-uploader-file.is-success {
  border-color: #67c23a;
  background-color: #f0f9ff;
}

.drag-uploader-file.is-error {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.drag-uploader-file.is-waiting {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.drag-uploader-file.is-uploading {
  border-color: #e6a23c;
  background-color: #fdf6ec;
}

.drag-uploader-file-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.drag-uploader-file-icon {
  color: #8c939d;
  margin-right: 8px;
}

.drag-uploader-file-name {
  color: #606266;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drag-uploader-file-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-uploader-file-status-icon.is-success {
  color: #67c23a;
}

.drag-uploader-file-status-icon.is-error {
  color: #f56c6c;
}

.drag-uploader-file-status-icon.is-waiting {
  color: #409eff;
}

.drag-uploader-file-status-icon.is-uploading {
  color: #e6a23c;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.drag-uploader-file-remove {
  color: #8c939d;
  cursor: pointer;
  transition: color 0.3s;
}

.drag-uploader-file-remove:hover {
  color: #f56c6c;
}

/* 适配深色主题 */
.dark .drag-uploader-dragger {
  border-color: #4c4d4f;
  background-color: #2d2d2d;
}

.dark .drag-uploader-dragger:hover,
.dark .drag-uploader-dragger.is-dragover,
.dark .drag-uploader-dragger.is-uploading {
  border-color: #409eff;
  background-color: #1a1a1a;
}

.dark .drag-uploader-text {
  color: #a3a6ad;
}

.dark .drag-uploader-file {
  border-color: #4c4d4f;
  background-color: #2d2d2d;
}

.dark .drag-uploader-file:hover {
  background-color: #3a3a3a;
}

.dark .drag-uploader-file.is-waiting {
  border-color: #409eff;
  background-color: #1a1a1a;
}

.dark .drag-uploader-file.is-uploading {
  border-color: #e6a23c;
  background-color: #2a2a2a;
}

.dark .drag-uploader-file.is-success {
  border-color: #67c23a;
  background-color: #1a1a1a;
}

.dark .drag-uploader-file.is-error {
  border-color: #f56c6c;
  background-color: #2a1a1a;
}
</style>
