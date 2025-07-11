<template>
  <div class="con-img">
    <div class="con-img-operate">
      <div class="con-img-title">{{ title }}</div>
      <input
        ref="coverInputRef"
        style="display: none;"
        type="file"
        :accept="acceptString"
        @change="handleCoverChange"
      >
      <el-button type="primary" plain size="small" @click="triggerCoverUpload">
        <el-icon><i-ep-upload /></el-icon>
        <span>上传</span>
      </el-button>
    </div>
    <div class="con-img-tip">{{ tip }}</div>
    <el-image
      class="advert-upload-img"
      :src="modelValue || ''"
      :preview-src-list="modelValue ? [modelValue] : []"
      :initial-index="0"
      loading="eager"
      fit="contain"
    >
      <template #error>
        <div class="advert-img-error">
          <el-icon :size="25" color="#c0c4cc"><i-ep-picture /></el-icon>
        </div>
      </template>
    </el-image>
  </div>
</template>

<script setup lang="ts">
import useOss from "@/hooks/useOSS.ts";
const { checkFile, uploadFile } = useOss();
import { showProgress, closeProgress } from "@/utils/progressOverlay.ts";

const props = defineProps<{
  modelValue: string | null;
  title: string;
  tip: string;
  uploadOption?: OssUploadOption;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const coverInputRef = ref<HTMLInputElement | null>(null);

const handleCoverChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    return;
  }
  const flag = checkFile(file,props.uploadOption);
  if (!flag) {
    return;
  }

  try {
    showProgress();
    emit('update:modelValue', await uploadFile(file, props.uploadOption) || '');
  } finally {
    setTimeout(() => {
      closeProgress();
      if (props.modelValue){
        ElMessage.success('上传成功');
      }
    }, 500);
    if (coverInputRef.value) {
      coverInputRef.value.value = '';
    }
  }
};

const triggerCoverUpload = () => {
  coverInputRef.value?.click();
};

// 动态计算 accept 字符串
const acceptString = computed(() => {
  return props.uploadOption?.accept?.join(',') || '*';
});
</script>

<style scoped>
.con-img {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 18px;
}
.con-img-operate {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}
.con-img-title {
  font-weight: 600;
  font-size: 14px;
  color: #606266;
}
.con-img-tip {
  font-size: 12px;
}
</style>
