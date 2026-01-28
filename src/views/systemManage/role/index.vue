<script setup lang="ts">
import {
  getPermissionTree,
  getRoleById,
  getRolePageList,
  removeRoleById,
  addOrUpdateRole
} from "@/api/permission/index.ts";
import type { PermissionTreeVO, Role } from "@/api/permission/type.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";

/**
 * 查询表单
 */
const queryParams = ref({
  page: 1,
  limit: 10,
  name: '',
  startTime: '',
  endTime: ''
});

const queryFormRef = ref<ElFormInstance>();
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

/**
 * 弹窗
 */
//树形组件
const menuRef = ref<ElTreeInstance>();
const treeList = ref<PermissionTreeVO[]>([]);
const expandAll = ref(false);
const toggleExpand = () => {
  expandAll.value = !expandAll.value;

  // 递归展开所有节点
  const toggle = (nodes: PermissionTreeVO[] = []) => {
    nodes.forEach(node => {
      const nodeItem = menuRef.value?.getNode(node.id);
      if (nodeItem) {
        nodeItem.expanded = expandAll.value;
      }
      if (node.children && node.children.length > 0) {
        toggle(node.children);
      }
    });
  };

  toggle(treeList.value);
};

//获取权限列表
const getTree = async () => {
  const { result } = await getPermissionTree();
  if (result) {
    treeList.value = result;
  }
};

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//弹窗表单数据
const formEditRoleDefault = {
  id: null as number | null,
  name: '',
  description: '' as string | null,
  permissionIds: [] as number[]
};
const formEditRole = ref({ ...formEditRoleDefault });

//弹窗表单实例
const formEditRoleRef = ref<ElFormInstance>();
const rulesEditRole = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ]
};
function cancelDialog () {
  Object.assign(formEditRole.value, formEditRoleDefault);
  dialog.visible = false;
}
/** 所有权限节点数据 */
const getMenuAllCheckedKeys = (): any => {
  // 目前被选中的权限节点
  const checkedKeys = menuRef.value?.getCheckedKeys();
  // 半选中的权限节点
  const halfCheckedKeys = menuRef.value?.getHalfCheckedKeys();
  if (halfCheckedKeys) {
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  }
  return checkedKeys;
};
async function submitDialog () {
  showLoading();
  formEditRole.value.permissionIds = getMenuAllCheckedKeys();
  const { code } = await addOrUpdateRole(formEditRole.value);
  closeLoading();
  if (code === 0) {
    ElMessage.success('操作成功');
    dialog.visible = false;
    resetQuery();
  }
}

/**
 * 表格
 */
const total = ref(0);
const loading = ref(false);
const roleList = ref<Role[]>([]);
const roleTableRef = ref<ElTableInstance>();

//获取角色
async function getRoleList () {
  loading.value = true;
  const { result } = await getRolePageList(queryParams.value);
  loading.value = false;
  if (!result) {
    return;
  }
  total.value = result.total || 0;
  roleList.value = result.records || [];
}

//修改角色
async function updateRole (row: any) {
  showLoading();
  const { result } = await getRoleById(row.id);
  if (!result) {
    ElMessage.error('获取角色信息失败');
    return;
  }
  formEditRole.value.id = result.role.id;
  formEditRole.value.name = result.role.name;
  formEditRole.value.description = result.role.description;
  formEditRole.value.permissionIds = result.rolePermission;
  dialog.visible = true;
  dialog.title = '修改角色';
  result.rolePermission.forEach((item: any) => {
    nextTick(() => {
      menuRef.value?.setChecked(item, true, false);
    });
  });

  closeLoading();
}
function addRole () {
  dialog.visible = true;
  dialog.title = '添加角色';
}

//删除角色
async function deleteRole (row: any) {
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
      const { code } = await removeRoleById(row.id);
      queryParams.value.page = 1;
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

//重置查询条件
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  nextTick(() => {
    if (queryParams.value.page > 1){
      queryParams.value.page = 1;
    }else {
      getRoleList();
    }
  });
};

function handleQuery (){
  getRoleList();
}

onMounted(() => {
  getRoleList();
  getTree();
});
</script>

<template>
<div>
  <div class="mb-10" >
    <el-card shadow="hover">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter="handleQuery" class="wid-200" />
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
        <el-col :span="1.5">
          <el-button type="primary" plain @click="addRole">
            <el-icon ><i-ep-plus /></el-icon>
            <span>新增</span>
          </el-button>
        </el-col>
      </el-row>
    </template>

    <el-table
      row-key="id"
      :border="false"
      v-loading="loading"
      :show-overflow-tooltip="true"
      :data="roleList"
      ref="roleTableRef"
    >
      <el-table-column label="角色名称" prop="name" width="200"  />
      <el-table-column label="角色描述"  prop="description" min-width="300"/>
      <el-table-column label="创建时间" prop="createTime" width="200"/>
      <el-table-column  label="操作" width="200">
        <template #default="scope">
          <span class="operation-a blue-color" @click="updateRole(scope.row)">修改</span>
          <span class="operation-a red-color" @click="deleteRole(scope.row)">删除</span>
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
      @change="getRoleList"
    />
  </el-card>

  <!-- 编辑弹窗 -->
  <el-dialog :close-on-click-modal="false"  :destroy-on-close="true"   v-model="dialog.visible" :before-close="cancelDialog"  width="550px">
    <template #header>
      <span style="font-size: 15px">{{dialog.title}}</span>
    </template>
    <div style="margin: 20px 0;">
      <el-form  :inline="false" :rules="rulesEditRole" :model="formEditRole" ref="formEditRoleRef" label-width="80px">

        <el-form-item label="角色名称" prop="name">
          <el-input  placeholder="请输入" clearable  v-model="formEditRole.name"  />
        </el-form-item>

        <el-form-item label="拥有权限">
          <el-button class="mt-5" type="info" size="small"  plain @click="toggleExpand" >
            <el-icon ><i-ep-sort /></el-icon>
            <span>展开/折叠</span>
          </el-button>
          <el-tree
            class="tree-border tree-overflow"
            :data="treeList"
            show-checkbox
            ref="menuRef"
            node-key="id"
            empty-text="加载中，请稍候"
            :default-expand-all="false"
            :props="{ label: 'title', children: 'children' }"
          ></el-tree>
        </el-form-item>

        <el-form-item label="角色描述"  prop="description">
          <el-input v-model="formEditRole.description" type="textarea" :rows="6" clearable placeholder="请输入内容"></el-input>
        </el-form-item>

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
.tree-overflow{
  height: 300px;
  overflow: auto;
}

</style>
