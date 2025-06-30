<script setup lang="ts">
import { getUserPageList,saveUser,removeUserByIds } from "@/api/user/index.ts";
import type { User, UserEditDTO } from "@/api/user/type.ts";
import { downloadFile } from "@/utils/download.ts";
import { encryptSha256 } from "@/utils/encrypt.ts";
import { showProgress, updateProgress, closeProgress } from "@/utils/progressOverlay.ts";
import useOss from "@/hooks/useOSS.ts";
import { globalHeaders } from "@/utils/request.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";

const { checkFile,uploadFile } = useOss();

/**
 * 查询表单
 */
const queryFormRef = ref<ElFormInstance>();
const queryParams = ref({
  page: 1,
  limit: 10,
  name: '',
  phone: '',
  startTime: '',
  endTime: ''
});
const createTime = ref([]);
//监听注册时间变化
watch(createTime, (newVal) => {
  if (newVal && newVal.length === 2) {
    queryParams.value.startTime = newVal[0];
    queryParams.value.endTime = newVal[1];
  }else {
    queryParams.value.startTime = '';
    queryParams.value.endTime = '';
  }
});
//查询用户列表
const handleQuery = () => {
  getUserList();
};
//重置
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  createTime.value = [];
  nextTick(() => {
    if (queryParams.value.page > 1){
      queryParams.value.page = 1;
    }else {
      getUserList();
    }
  });
};

/**
 * 用户列表
 */
const total = ref(0);
const loading = ref(false);
const userTableRef = ref<ElTableInstance>();
const userList = ref<User[]>([]);
const getUserList = async () => {
  loading.value = true;
  const { result } = await getUserPageList(queryParams.value);
  loading.value = false;
  if (result) {
    userList.value = result.records || [];
    total.value = result.total;
  }
};

//新增用户
const addUser = () => {
  dialog.visible = true;
  dialog.title = '新增用户';
};
//修改用户
const updateUser = (row: User) => {
  formEditUser.id = row.id;
  formEditUser.password = null;
  formEditUser.name = row.name;
  formEditUser.phone = row.phone;
  formEditUser.profilePath = row.profilePath;
  formEditUser.coverPath = row.coverPath;
  formEditUser.gender = row.gender;
  formEditUser.address = row.address;

  dialog.visible = true;
  dialog.title = '编辑用户';
};

//批量删除
const deleteUserBatch = () => {
  const selectList = userTableRef.value?.getSelectionRows();
  if (!selectList || selectList.length === 0) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }
  const userIds = selectList.map((item: User) => item.id);
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
      const { code } = await removeUserByIds(userIds);
      if (code === 0) {
        ElMessage.success('删除成功');
        resetQuery();
      }
    });
};

//删除用户
const deleteUser = (row: User) => {
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
      const userIds = [row.id];
      const { code } = await removeUserByIds(userIds);
      if (code === 0) {
        ElMessage.success('删除成功');
        resetQuery();
      }
    });
};

const importUser = () => {
  dialogExport.visible = true;
};
//导出用户
const exportUser = () => {
  downloadFile('/userManage/exportUserInExcel', queryParams.value,"POST");
};

/**
 * 导入弹窗
 */
const uploadRef = ref<ElUploadInstance>();
const dialogExport = reactive<DialogOption>({
  visible: false,
  title: '导入用户',
  templateUrl: '/userManage/downloadMaterial',
  action: `${import.meta.env.VITE_SERVE}/userManage/importUsersInExcel`
});

const cancelExportDialog = () => {
  dialogExport.visible = false;
  uploadRef.value?.clearFiles();
};

const handleSuccess = (response: any, file: UploadFile) => {
  uploadRef.value?.handleRemove(file);
  dialogExport.visible = false;
  if (response.code === 0) {
    ElMessage.success('导入成功！');
  }else {
    ElMessage.error(response.msg);
  }
  resetQuery();
  closeLoading();
};

const beforeUpload = (file: UploadFile) => {
  // 允许的 Excel 文件类型
  const allowedTypes = [
    'xls',
    'xlsx'
  ];
  const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
  const isExcel = allowedTypes.includes(fileType);
  if (!isExcel) {
    ElMessage.warning('请上传EXCEL文件');
    return false; // 阻止上传
  }
  const isSizeValid = file.size / 1024 / 1024 < 5; // 判断文件大小是否小于 5MB
  if (!isSizeValid) {
    ElMessage.warning('文件大小不能超过 5MB');
    return false; // 阻止上传
  }
  showLoading('上传中...');
  return true; // 允许上传
};

const handleError = (response: any, file: UploadFile) => {
  uploadRef.value?.handleRemove(file);
  dialogExport.visible = false;
  closeLoading();
  ElMessage.error('导入失败');
};

const submitExportDialog = () => {
  uploadRef.value?.submit();
};

/**
 * 编辑用户弹窗
 */
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//弹窗表单数据
const formEditUserDefault: UserEditDTO = {
  id: null ,
  password: null,
  name: '',
  phone: '',
  profilePath: null,
  coverPath: null,
  gender: '',
  address: ''
};

const formEditUser = reactive<UserEditDTO>(Object.assign({}, formEditUserDefault));
//弹窗表单实例
const formEditUserRef = ref<ElFormInstance>();
const rulesEditUser = {
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入合法的手机号',
      trigger: 'blur'
    }
  ]
};

const submitDialog = () => {
  formEditUserRef.value?.validate( async (valid: boolean) => {
    if (valid) {
      if (formEditUser.password) {
        formEditUser.password = encryptSha256(formEditUser.password);
      }
      let profilePath = formEditUser.profilePath;
      if (profilePath && profilePath.indexOf('/upload') !== -1){
        profilePath = profilePath.substring(profilePath.indexOf('/upload'));
      }
      let coverPath = formEditUser.coverPath;
      if (coverPath && coverPath.indexOf('/upload') !== -1){
        coverPath = coverPath.substring(coverPath.indexOf('/upload'));
      }
      const payload: UserEditDTO = {
        id: formEditUser.id,
        password: formEditUser.password,
        name: formEditUser.name,
        phone: formEditUser.phone,
        profilePath: profilePath,
        coverPath: coverPath,
        gender: formEditUser.gender,
        address: formEditUser.address
      };
      const { code } = await saveUser(payload);
      if (code === 0) {
        ElMessage.success('保存成功');
        dialog.visible = false;
        resetQuery();
      }
    }

  });
};

const cancelDialog = () => {
  Object.assign(formEditUser, formEditUserDefault);
  dialog.visible = false;
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

/**
 * 头像上传
 */
const profileInputRef = ref<HTMLInputElement | null>(null);
const handleProfileChange = async (event: Event) => {
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
    const path = await uploadFile(file,uploadOption);
    formEditUser.profilePath = path;
  }finally {
    setTimeout(() => {
      closeProgress();
    }, 500);
    if (profileInputRef.value) {
      profileInputRef.value.value = '';
    }
  }

};
const triggerProfileUpload = () => {
  profileInputRef.value?.click();
};

/**
 * 背景上传
 */
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
    const path = await uploadFile(file,uploadOption);
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

onMounted(() => {
  getUserList();
});
</script>

<template>
<div>
  <div class="mb-10" >
    <el-card shadow="hover">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter="handleQuery" class="wid-200" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryParams.phone" placeholder="请输入" clearable @keyup.enter="handleQuery" class="wid-200" />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            style="width: 340px;"
            v-model="createTime"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :editable="false"
          ></el-date-picker>
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
          <el-button type="danger" plain @click="deleteUserBatch">
            <el-icon ><i-ep-delete /></el-icon>
            <span>批量删除</span>
          </el-button>
          <el-button type="primary" plain @click="addUser">
            <el-icon ><i-ep-plus /></el-icon>
            <span>新增</span>
          </el-button>
        </div>
        <div>
          <el-button type="primary" plain @click="importUser">
            <el-icon ><i-ep-upload /></el-icon>
            <span>导入</span>
          </el-button>
          <el-button type="primary" plain @click="exportUser">
            <el-icon ><i-ep-download /></el-icon>
            <span>导出</span>
          </el-button>
        </div>
      </el-row>
    </template>

    <el-table
      row-key="id"
      :border="false"
      v-loading="loading"
      :show-overflow-tooltip="true"
      :data="userList"
      ref="userTableRef"
    >
      <el-table-column type="selection"   />
      <el-table-column label="昵称" prop="name"   />
      <el-table-column label="手机号"  prop="phone" />
      <el-table-column label="性别"  prop="gender" />
      <el-table-column label="注册时间" prop="createTime" />
      <el-table-column label="注册类型"  prop="registType" >
        <template #default="scope">
          <span v-if="scope.row.registType === 1">用户注册</span>
          <span v-else-if="scope.row.registType === 2">后台添加</span>
        </template>
      </el-table-column>
      <el-table-column label="地址"  prop="address" />
      <el-table-column  label="操作" width="200">
        <template #default="scope">
          <span class="operation-a brightBlue-color" @click="updateUser(scope.row)">修改</span>
          <span class="operation-a deepRed-color" @click="deleteUser(scope.row)">删除</span>
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
      @change="getUserList"
    />
  </el-card>

  <el-dialog :close-on-click-modal="false"  :destroy-on-close="true"   v-model="dialog.visible" :before-close="cancelDialog"  width="650px">
    <template #header>
      <span style="font-size: 15px">{{dialog.title}}</span>
    </template>
    <div style="margin: 20px 0;">
      <el-form  :inline="false" :rules="rulesEditUser" :model="formEditUser" ref="formEditUserRef" label-width="80px">

        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item  label="昵称" prop="name">
              <el-input style="width: 200px"  placeholder="请输入" clearable  v-model="formEditUser.name"  />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item  label="手机号" prop="phone">
              <el-input  style="width: 200px"  placeholder="请输入" clearable  v-model="formEditUser.phone"  />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item  label="密码" prop="password">
              <el-input style="width: 200px"  type="password"  placeholder="请输入" clearable  v-model="formEditUser.password"  />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item  label="性别" prop="gender">
              <el-radio-group v-model="formEditUser.gender">
                <el-radio value="男" >男</el-radio>
                <el-radio value="女" >女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item  label="地址" prop="address">
              <el-input style="width: 95%"  placeholder="请输入" clearable  v-model="formEditUser.address"  />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <div class="con-img">
                <div class="con-img-title">头像</div>
                <div>
                  <input
                    ref="profileInputRef"
                    style="display: none;"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    @change="handleProfileChange"
                  >
                  <el-button type="primary" plain size="small" @click="triggerProfileUpload" >
                    <el-icon ><i-ep-upload /></el-icon>
                    <span>上传</span>
                  </el-button>
                </div>
                <div class="con-img-tip">图片大小不能超过10M。</div>

                <el-image
                  class="advert-upload-img"
                  :src="formEditUser.profilePath || ''"
                  :preview-src-list="formEditUser.profilePath ? [formEditUser.profilePath] : []"
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
          </el-col>

          <el-col :span="12">
            <div class="con-img">
              <div class="con-img-title">背景图</div>
              <div>
                <input
                  ref="coverInputRef"
                  style="display: none;"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  @change="handleCoverChange"
                >
                <el-button type="primary" plain size="small" @click="triggerCoverUpload" >
                  <el-icon ><i-ep-upload /></el-icon>
                  <span>上传</span>
                </el-button>
              </div>
              <div class="con-img-tip">图片大小不能超过10M。</div>
              <el-image
                class="advert-upload-img"
                :src="formEditUser.coverPath || ''"
                :preview-src-list="formEditUser.coverPath ? [formEditUser.coverPath] : []"
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

  <el-dialog :close-on-click-modal="false" :destroy-on-close="true"   v-model="dialogExport.visible" :before-close="cancelExportDialog"  width="500">
    <template #header>
      <span style="font-size: 15px">导入学员</span>
    </template>
    <div style="margin: 20px 0;">
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx,.xls"
        :auto-upload="false"
        :action="dialogExport.action"
        :headers="globalHeaders()"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        drag
      >
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="downloadFile(dialogExport.templateUrl!)">下载模板</el-link>
          </div>
        </template>
      </el-upload>
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
.con-img{
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  gap: 5px;
}
.con-img-title{
  font-weight: 600;
}
.con-img-tip{
  font-size: 12px;
}
</style>
