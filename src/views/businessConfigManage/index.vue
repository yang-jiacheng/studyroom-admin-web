<script setup lang="ts">
import type { BusinessConfig } from "@/api/businessConfig/type.ts";
import { getBusinessList,updateBusiness } from "@/api/businessConfig";
import { closeLoading, showLoading } from "@/utils/loading.ts";

const list = ref<BusinessConfig[]>([]);
const getList = async () => {
  const { result } = await getBusinessList();
  if (result){
    list.value = result.records || [];
  }
};

const updateBus = async (row: BusinessConfig) => {
  const payload =  {
    id: row.id,
    value: row.bvalue
  };
  const { code } = await updateBusiness(payload);
  if (code === 0){
    ElMessage.success('修改成功');
  }
};

onMounted( async () => {
  showLoading();
  await getList();
  closeLoading();
});

</script>
<template>
  <div>
    <div class="mb-10" >
      <el-card shadow="hover">
        <el-table
          row-key="id"
          :border="true"
          :show-overflow-tooltip="true"
          :data="list"
        >
          <el-table-column type="index"  label="序号" width="100" align="center" />
          <el-table-column label="名称" prop="description" align="center"  />
          <el-table-column label="配置项"  prop="bvalue" align="center" >
            <template #default="scope">
              <el-input  placeholder="请输入" clearable  v-model="scope.row.bvalue"  />
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="120"  align="center" >
            <template #default="scope">
              <span class="operation-a blue-color" @click="updateBus(scope.row)">修改</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<style scoped>

</style>
