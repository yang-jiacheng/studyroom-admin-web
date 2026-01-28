<script setup lang="ts">
import {
  getAdminInfoPageList,
  removeAdminInfoByIds,
  disabledAdminInfo,
  getRoleRecords,
  getAdminInfoById,
  editAdminInfo
} from "@/api/adminInfo";
import type { AdminInfo, AdminInfoDetail } from "@/api/adminInfo/type.ts";
import type { SelResult } from "@/api/common/page/CollResult.ts";
import { showLoading,closeLoading } from "@/utils/loading.ts";
import { encryptSha256 } from "@/utils/encrypt.ts";

const roleList = ref<SelResult[]>([]);
const getRoleList = async () => {
  const { result } = await getRoleRecords();
  if (result) {
    roleList.value = result.records || [];
  }
};
/**
 * 查询表单
 */
const queryFormRef = ref<ElFormInstance>();
const queryParams = ref({
  page: 1,
  limit: 10,
  name: ''
});
//查询
function handleQuery (){
  getAdminInfoList();
}
//重置
function resetQuery (){
  queryFormRef.value?.resetFields();
  if (queryParams.value.page > 1){
    queryParams.value.page = 1;
  }else {
    getAdminInfoList();
  }
}

/**
 * 表格
 */
const total = ref(0);
const loading = ref(false);
const adminList = ref<AdminInfo[]>([]);
const adminTableRef = ref<ElTableInstance>();

//获取后管用户
const getAdminInfoList = async () => {
  loading.value = true;
  const { result } = await getAdminInfoPageList(queryParams.value);
  loading.value = false;
  if (!result) {
    return;
  }
  total.value = result.total || 0;
  adminList.value = result.records || [];
};

async function changeAdminStatus (row: AdminInfo) {
  const { id, status } = row;
  const { code } = await disabledAdminInfo({ id, status });
  if (code === 0) {
    ElMessage.success('修改成功');
  }else {
    row.status = status === 1 ? 2 : 1;
  }
}

function addAdmin () {
  dialog.visible = true;
  dialog.title = '新增用户';
}

const adminInfo = ref<AdminInfoDetail>();
const getAdminInfo = async (id: number) => {
  showLoading();
  const { result } = await getAdminInfoById(id);
  if (result) {
    adminInfo.value = result;
    formEditRole.value = {
      id: result.adminInfo.id,
      username: result.adminInfo.username,
      name: result.adminInfo.name,
      phone: result.adminInfo.phone,
      password: '',
      status: result.adminInfo.status ,
      roleIds: result.roles || []
    };
  }
  closeLoading();
};
async function updateAdmin (row: AdminInfo) {
  await getAdminInfo(row.id);
  dialog.visible = true;
  dialog.title = '编辑用户';
}
function deleteAdmin (row: AdminInfo) {
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
      const adminIds = [row.id];
      const { code } = await removeAdminInfoByIds(adminIds);
      if (code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 2500
        });
        resetQuery();
      }
    });
}

function deleteAdminBatch () {
  const selectList = adminTableRef.value?.getSelectionRows();
  if (!selectList || selectList.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请至少选择一条数据',
      duration: 2500
    });
    return;
  }
  const adminIds = selectList.map((item: AdminInfo) => item.id);
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
      const { code } = await removeAdminInfoByIds(adminIds);
      if (code === 0) {
        resetQuery();
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 2500
        });
      }
    });

}

/**
 * 弹窗
 */
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//弹窗表单数据
const formEditRoleDefault = {
  id: null as number | null,
  username: '',
  name: '',
  phone: '',
  password: '',
  status: 1,
  roleIds: [] as number[]
};
const formEditRole = ref({ ...formEditRoleDefault });

//弹窗表单实例
const formEditRoleRef = ref<ElFormInstance>();
const rulesEditRole = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  phone: [
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        const phoneReg = /^1[3-9]\d{9}$/;
        if (value && !phoneReg.test(value))  {
          callback(new Error('请输入合法的手机号'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  roleIds: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
};

const submitDialog = () => {
  formEditRoleRef.value?.validate( async (valid: boolean) => {
    if (valid) {
      let password = null;
      if (formEditRole.value.password) {
        password = encryptSha256(formEditRole.value.password);
      }
      const payload = {
        adminInfo: {
          id: formEditRole.value.id,
          username: formEditRole.value.username,
          name: formEditRole.value.name,
          phone: formEditRole.value.phone,
          status: formEditRole.value.status,
          password: password
        },
        roleIds: formEditRole.value.roleIds
      };
      const { code } = await editAdminInfo(payload);
      if (code === 0) {
        ElMessage({
          type: 'success',
          message: '操作成功',
          duration: 2500
        });
        cancelDialog();
        resetQuery();
      }
    }
  });
};

const cancelDialog = () => {
  formEditRole.value = { ...formEditRoleDefault };
  dialog.visible = false;
};

onMounted(() => {
  getRoleList();
  getAdminInfoList();
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
        <el-row :gutter="10">
          <div>
            <el-button type="danger" plain @click="deleteAdminBatch">
              <el-icon ><i-ep-delete /></el-icon>
              <span>批量删除</span>
            </el-button>
            <el-button type="primary" plain @click="addAdmin">
              <el-icon ><i-ep-plus /></el-icon>
              <span>新增</span>
            </el-button>
          </div>
        </el-row>
      </template>

      <el-table
        row-key="id"
        :border="false"
        v-loading="loading"
        :show-overflow-tooltip="true"
        :data="adminList"
        ref="adminTableRef"
      >
        <el-table-column type="selection"   />
        <el-table-column label="用户名" prop="username"   />
        <el-table-column label="昵称" prop="name"   />
        <el-table-column label="手机号"  prop="phone" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="状态" >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              @change="changeAdminStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="200">
          <template #default="scope">
            <span class="operation-a blue-color" @click="updateAdmin(scope.row)">修改</span>
            <span class="operation-a red-color" @click="deleteAdmin(scope.row)">删除</span>
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
        @change="getAdminInfoList"
      />
    </el-card>

    <el-dialog :close-on-click-modal="false"  :destroy-on-close="true"   v-model="dialog.visible" :before-close="cancelDialog"  width="650px">
      <template #header>
        <span style="font-size: 15px">{{dialog.title}}</span>
      </template>
      <div style="margin: 20px 0;">
        <el-form  :inline="true" :rules="rulesEditRole" :model="formEditRole" ref="formEditRoleRef" label-width="80px">

          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item  label="用户名" prop="username">
                <el-input style="width: 200px"   placeholder="请输入" :disabled="formEditRole.id != null" clearable  v-model="formEditRole.username"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  label="昵称" prop="name">
                <el-input style="width: 200px"  placeholder="请输入" clearable  v-model="formEditRole.name"  />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item   label="角色" prop="roleIds">
                <el-select
                  v-model="formEditRole.roleIds"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  label="手机号" prop="phone">
                <el-input  style="width: 200px"  placeholder="请输入" clearable  v-model="formEditRole.phone"  />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item  label="密码" prop="password">
                <el-input style="width: 200px"  type="password"  placeholder="请输入" clearable  v-model="formEditRole.password"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  label="状态" prop="status">
                <el-radio-group v-model="formEditRole.status">
                  <el-radio :value="1" >正常</el-radio>
                  <el-radio :value="2" >禁用</el-radio>
                </el-radio-group>
              </el-form-item>
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
</template>

<style scoped>
</style>
