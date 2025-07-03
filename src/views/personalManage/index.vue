<script setup lang="ts">
import useOss from "@/hooks/useOSS.ts";
const { checkFile, uploadFile } = useOss();
import { showProgress, closeProgress, updateProgress } from "@/utils/progressOverlay.ts";
import { useMineInfoStore } from "@/store/mineInfo.ts";
import { updatePersonal } from "@/api/adminInfo";

//用户信息
const mineInfoStore = useMineInfoStore();
const { mine } = storeToRefs(mineInfoStore);

const formEditUserRef = ref<ElFormInstance>();
const formEditUser = reactive({
  id: 0 ,
  name: '',
  username: '',
  createTime: '',
  oldPassword: null as string | null,
  newPassword: null as string | null,
  profilePath: ''
});

watch(mine, (newVal) => {
  formEditUser.id = newVal.id;
  formEditUser.name = newVal.name;
  formEditUser.profilePath = newVal.profilePath;
  formEditUser.username = newVal.username;
  formEditUser.createTime = newVal.createTime;
},{ immediate: true, deep: true });

const rules = {
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ]
};

const submitFormEditUser = async () => {
  formEditUserRef.value?.validate( async (valid: boolean) => {
    if (valid){
      const { code } = await updatePersonal(formEditUser);
      if (code === 0){
        ElMessage.success("修改成功");
        mine.value.name = formEditUser.name;
        mine.value.profilePath = formEditUser.profilePath;
      }
    }
  });
};

const uploadOption: OssUploadOption = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  accept: ['.png','.jpg','.jpeg','.webp'],
  maxSizeMb: 10,// 10MB
  partSize: 1024 * 1024, // 1MB
  parallel: 5,
  onProgress: (percentage) => {
    // 更新进度条
    updateProgress(percentage);
  }
};

// 动态计算 accept 字符串
const acceptString = computed(() => {
  return uploadOption.accept.join(',') || '*';
});

const coverInputRef = ref<HTMLInputElement | null>(null);
const handleCoverChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    return;
  }
  const flag = checkFile(file,uploadOption);
  if (!flag) {
    return;
  }
  try {
    showProgress();
    const path = await uploadFile(file,uploadOption) || '';
    formEditUser.profilePath = path;
  }finally {
    setTimeout(() => {
      closeProgress();
    }, 500);
    if (coverInputRef.value) {
      coverInputRef.value.value = '';
    }
  }

};
const triggerCoverUpload = () => {
  coverInputRef.value?.click();
};

</script>

<template>
  <div>
    <div class="mb-10" >
      <el-card shadow="hover">
        <div class="edit-avatar" >
          <div style=" background-color: #f5f5f5;  margin-left: 26px;">
            <el-image
              class="edit-img"
              :src="formEditUser.profilePath"
              :preview-src-list="[formEditUser.profilePath]"
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
          <div class="avatar-divider"></div>
          <div class="edit-avatar-content">
            <input
              ref="coverInputRef"
              style="display: none;"
              type="file"
              :accept="acceptString"
              @change="handleCoverChange"
            >
            <el-button type="primary" plain  @click="triggerCoverUpload">
              <el-icon><i-ep-upload /></el-icon>
              <span>修改头像</span>
            </el-button>
            <p class="blue-color edit-tip">选择一张你喜欢的图片，建议 长宽比为1:1，上传图片大小不能超过10M。</p>
          </div>
        </div>
        <hr>

        <el-form ref="formEditUserRef" :rules="rules" label-position="top" :model="formEditUser" :inline="false" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formEditUser.username"  disabled />
          </el-form-item>

          <el-form-item label="注册时间" prop="createTime">
            <el-input v-model="formEditUser.createTime"  disabled />
          </el-form-item>

          <el-form-item label="昵称" prop="name">
            <el-input v-model="formEditUser.name" placeholder="请输入昵称"  clearable />
          </el-form-item>

          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="formEditUser.oldPassword" placeholder="请输入旧密码"  clearable />
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="formEditUser.newPassword" placeholder="请输入新密码"  clearable />
          </el-form-item>

          <div class="sub-btn-group">
            <el-button type="primary" class="sub-btn" round  @click="submitFormEditUser" >
              保存
            </el-button>
          </div>

        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.el-form){
  width: 35%;
}
.edit-img{
  width: 60px;
  height: 60px;
  background-color: #f5f7fa;
}
.edit-avatar {
  display: flex;
  align-items: flex-start;
}
.avatar-divider {
  display: inline-block;
  border-left: 1px solid #ccd0d7;
  height: 50px;
  align-self: center;
  margin: 0 20px;
}
.edit-avatar-content {
  display: inline-block;
}
.edit-tip{
  font-size: 13px;
  padding-top: 10px;
}
.sub-btn-group{
  text-align: center;
  margin-bottom: 15px;
}
.sub-btn{
  width: 200px;
}
</style>
