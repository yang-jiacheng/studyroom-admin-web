<script setup lang="ts">
import { getStudyRecord,getAllLibrary } from '@/api/studyRecord/index.ts';
import type { StudyRecord } from "@/api/studyRecord/type.ts";
import type { SelResult } from "@/api/common/page/CollResult.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";

/**
 * 查询表单
 */
const queryFormRef = ref<ElFormInstance>();
const queryParams = ref({
  page: 1,
  limit: 10,
  phone: '',
  classifyId: '',
  status: ''
});

/**
 * 表格数据
 */
const total = ref(0);
const loading = ref(false);
const userTableRef = ref<ElTableInstance>();
const recordData = ref<StudyRecord[]>([]);
const getRecordData = async () => {
  loading.value = true;
  const { result } = await getStudyRecord(queryParams.value);
  loading.value = false;
  if (result){
    recordData.value = result.records  || [];
    total.value = result.total;
  }
};

//记录详情
const userDetail = (row: StudyRecord) => {
  console.log(row);
};

const handleQuery = () => {
  getRecordData();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  nextTick(() => {
    if (queryParams.value.page > 1){
      queryParams.value.page = 1;
    }else {
      getRecordData();
    }
  });
};

/**
 * 图书馆
 */
const libraryData = ref<SelResult[]>([]);
const getLibraryData = async () => {
  const { result } = await getAllLibrary();
  if (result){
    libraryData.value = result.records;
  }
};

onMounted(async () => {
  showLoading();
  await getLibraryData();
  await getRecordData();
  closeLoading();
});
</script>

<template>
  <div>
    <div class="mb-10" >
      <el-card shadow="hover">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="queryParams.phone" placeholder="请输入" clearable @keyup.enter="handleQuery" class="wid-200" />
          </el-form-item>

          <el-form-item label="图书馆" prop="classifyId">
            <el-select
              v-model="queryParams.classifyId"
              clearable
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option
                v-for="item in libraryData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item  label="状态" prop="status">
            <el-radio-group v-model="queryParams.status">
              <el-radio value="1" >自习中</el-radio>
              <el-radio value="3" >已完成</el-radio>
            </el-radio-group>
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
      <el-table
        row-key="id"
        :border="false"
        v-loading="loading"
        :show-overflow-tooltip="true"
        :data="recordData"
        ref="userTableRef"
      >
        <el-table-column label="昵称" prop="name"   />
        <el-table-column label="手机号"  prop="phone" />
        <el-table-column label="图书馆" prop="classifyName" />
        <el-table-column label="自习室" >
          <template #default="scope">
            <span>{{scope.row.parentCatalogName}}{{scope.row.catalogName}}——{{scope.row.seat}}号</span>
          </template>
        </el-table-column>
        <el-table-column label="学习标签" prop="tag" />
        <el-table-column label="计时方式"  prop="timingMode" >
          <template #default="scope">
            <span class="blue-color" v-if="scope.row.timingMode === 1">正计时</span>
            <span class="green-color" v-else-if="scope.row.timingMode === 2">倒计时</span>
          </template>
        </el-table-column>
        <el-table-column label="状态"  prop="status" >
          <template #default="scope">
            <span class="blue-color" v-if="scope.row.status === 1">自习中</span>
            <span v-else-if="scope.row.status === 3">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间"  prop="startTime" />
        <el-table-column  label="操作" width="120">
          <template #default="scope">
            <span class="operation-a blue-color" @click="userDetail(scope.row)">详情</span>
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
        @change="getRecordData"
      />
    </el-card>

  </div>
</template>

<style scoped>

</style>
