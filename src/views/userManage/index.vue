<script setup lang="ts">
import { getUserPageList,saveUser,removeUserByIds } from "@/api/user/index.ts";
import type { User } from "@/api/user/type.ts";
import { downloadFile } from "@/utils/download.ts";

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
  const { result } = await getUserPageList(queryParams.value);
  if (result) {
    userList.value = result.records || [];
    total.value = result.total;
  }
};
//批量删除
const deleteUserBatch = () => {

};
//新增用户
const addUser = () => {
  downloadFile("/userManage/downloadMaterial",{ name: '模板文件' });
};
//修改用户
const updateUser = (row: User) => {

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
      <el-row :gutter="10">
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
      <el-table-column label="注册类型"  prop="registType" />
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

</div>
</template>

<style scoped>

</style>
