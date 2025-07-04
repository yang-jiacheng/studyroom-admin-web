<script setup lang="ts">
import { closeLoading, showLoading } from "@/utils/loading.ts";
import type { Version } from "@/api/version/type.ts";
import { getVersionList,saveVersion } from "@/api/version";
import { closeProgress, showProgress, updateProgress } from "@/utils/progressOverlay.ts";
import useOss from "@/hooks/useOSS.ts";
import { copyToClipboardWithMessage } from "@/utils/clipboard.ts";

const loading = ref(false);
const userTableRef = ref<ElTableInstance>();
const versionList = ref<Version[]>([]);
const getVersionData = async () => {
  loading.value = true;
  const { result } = await getVersionList();
  loading.value = false;
  if (result) {
    versionList.value = result.records || [];
  }
};

const handleUpdate = (row: Version) => {
  formEditUser.id = row.id;
  formEditUser.versionCode = row.versionCode;
  formEditUser.versionName = row.versionName;
  formEditUser.downloadUrl = row.downloadUrl;
  formEditUser.status = row.status;
  formEditUser.checkUpdate = row.checkUpdate;
  dialog.visible = true;
};

const handleDownloadUrl = async (row: Version) => {
  window.open(row.downloadUrl);
};

/**
 * 编辑用户弹窗
 */
const dialog = reactive<DialogOption>({
  visible: false,
  title: '编辑版本信息'
});

//弹窗表单数据
const formEditUserDefault = {
  id: 0 ,
  versionCode: null as number | null,
  versionName: '',
  downloadUrl: '',
  status: 0,
  checkUpdate: 0
};

const formEditUser = reactive(Object.assign({}, formEditUserDefault));
//弹窗表单实例
const formEditUserRef = ref<ElFormInstance>();
const rulesEditUser = {
  versionCode: [
    { required: true, message: '请输入版本号', trigger: 'blur' }
  ],
  versionName: [
    { required: true, message: '请输入版本名称', trigger: 'blur' }
  ]
};
const submitDialog = () => {
  formEditUserRef.value?.validate(async (valid: boolean) => {
    if (valid){
      if (!/^https?:\/\//i.test(formEditUser.downloadUrl)){
        ElMessage.warning('下载链接不合法');
      }
      const { code } = await saveVersion(formEditUser);
      if (code === 0){
        ElMessage.success('修改成功');
        dialog.visible = false;
        await getVersionData();
      }
    }
  });
};

const cancelDialog = () => {
  Object.assign(formEditUser, formEditUserDefault);
  dialog.visible = false;
};

/**
 * 下载地址
 */

const uploadOption: OssUploadOption = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  accept: ['.apk'],
  maxSizeMb: 500,
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
const { checkFile, uploadFile } = useOss();
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
    formEditUser.downloadUrl = path;
  }finally {
    setTimeout(() => {
      closeProgress();
      ElMessage.success('上传成功');
    }, 500);
    if (coverInputRef.value) {
      coverInputRef.value.value = '';
    }
  }

};
const triggerCoverUpload = () => {
  coverInputRef.value?.click();
};

onMounted(async () => {
  showLoading();
  await getVersionData();
  closeLoading();
});
</script>

<template>
  <div>
    <div class="mb-10" >
      <el-card shadow="hover">
        <el-table
          row-key="id"
          :border="false"
          v-loading="loading"
          :show-overflow-tooltip="true"
          :data="versionList"
          ref="userTableRef"
        >
          <el-table-column label="版本号" prop="versionCode"  width="120"  />
          <el-table-column label="版本名称" prop="versionName"  width="120" />
          <el-table-column label="下载地址" prop="downloadUrl" min-width="200"  >
            <template #default="scope">
              <span class="down-a" @click="handleDownloadUrl(scope.row)" v-if="scope.row.downloadUrl">{{ scope.row.downloadUrl }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测更新" prop="checkUpdate" width="120" >
            <template #default="scope">
              <span class="blue-color" v-if="scope.row.checkUpdate === 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="强制更新" prop="status" width="120"  >
            <template #default="scope">
              <span class="blue-color" v-if="scope.row.status === 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" prop="updateTime"   />
          <el-table-column  label="操作" width="120">
            <template #default="scope">
              <span class="operation-a blue-color" @click="handleUpdate(scope.row)">修改</span>
            </template>
          </el-table-column>

        </el-table>
      </el-card>

      <el-dialog :close-on-click-modal="false"  :destroy-on-close="true"   v-model="dialog.visible" :before-close="cancelDialog"  width="650px">
        <template #header>
          <span style="font-size: 15px">{{dialog.title}}</span>
        </template>
        <div style="margin: 20px 0;">
          <el-form  :inline="false" :rules="rulesEditUser" label-position="top"  :model="formEditUser" ref="formEditUserRef" >

            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item  label="版本号" prop="versionCode">
                  <el-input   placeholder="请输入" clearable  v-model="formEditUser.versionCode"  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item  label="版本名称" prop="versionName">
                  <el-input    placeholder="请输入" clearable  v-model="formEditUser.versionName"  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item  label="检测更新" prop="gender">
                  <el-radio-group v-model="formEditUser.checkUpdate">
                    <el-radio :value="0" >否</el-radio>
                    <el-radio :value="1" >是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item  label="强制更新" prop="gender">
                  <el-radio-group v-model="formEditUser.status">
                    <el-radio :value="0" >否</el-radio>
                    <el-radio :value="1" >是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <div class="con-img">
                  <div class="con-img-operate">
                    <div class="con-img-title">下载地址</div>
                    <input
                      ref="coverInputRef"
                      style="display: none;"
                      type="file"
                      :accept="acceptString"
                      @change="handleCoverChange"
                    >
                    <el-button type="primary" plain @click="triggerCoverUpload">
                      <el-icon><i-ep-upload /></el-icon>
                      <span>上传</span>
                    </el-button>
                  </div>
                  <div class="con-img-tip">请上传apk安装包,文件大小不超过500MB</div>
                  <el-tooltip
                    :content="formEditUser.downloadUrl"
                    placement="top"
                    effect="dark"
                  >
                    <el-input  disabled v-model="formEditUser.downloadUrl"  />
                  </el-tooltip>
                </div>
              </el-col>

            </el-row>

          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitDialog"> 确定 </el-button>
            <el-button @click="cancelDialog">取消</el-button>
          </div>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

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
