<script setup lang="ts">
import { getPermissionTree,saveOrUpdatePermission,removePermission } from '@/api/permission/index.ts';
import type { PermissionTreeVO } from "@/api/permission/type.ts";
import DynamicIcon from "@/components/icon/DynamicIcon.vue";
import type { TreeNode } from "@/api/common/tree/tree.ts";

/**
 * 查询表单
 */
//是否显示查询条件
const showSearch = ref(false);
const queryFormRef = ref<ElFormInstance>();
//查询条件
const queryParams = ref({
  name: ''
});

/**
 * 表格
 */
//表单实例
const menuTableRef = ref<ElTableInstance>();
//表格数据
const menuList = ref<PermissionTreeVO[]>([]);
//加载状态
const loading = ref(false);
//获取菜单列表
const getMenuList = async () => {
  loading.value = true;
  const { result } = await getPermissionTree();
  loading.value = false;
  if (result) {
    menuList.value = result;
  }
};
const handleQuery = () => {
  getMenuList();
};
function findNodeById (tree: PermissionTreeVO[], id: number): PermissionTreeVO | null {
  for (const node of tree) {
    if (node.id === id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/** 展开/折叠所有 */
const expandAll = ref(false);
const toggleExpandAll = (data: PermissionTreeVO[], status: boolean) => {
  data.forEach((item: PermissionTreeVO) => {
    menuTableRef.value?.toggleRowExpansion(item, status);
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status);
  });
};
const handleToggleExpandAll = () => {
  if (!menuList.value) {
    return;
  }
  expandAll.value = !expandAll.value;
  toggleExpandAll(menuList.value, expandAll.value);
};

/**
 * 增删改
 */
//弹窗
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

//treesel数据
const treeSelectOptions = ref<TreeNode[]>([]);
function transformToTreeSelectData (list: PermissionTreeVO[]): TreeNode[] {
  return list.map(item => ({
    label: item.title,
    value: item.id,
    children: item.children ? transformToTreeSelectData(item.children) : []
  }));
}
//监菜单数据 生成treesel数据
watch(() => menuList, (newVal) => {
  treeSelectOptions.value = transformToTreeSelectData(newVal.value);
}, { deep: true });

//弹窗表单数据
const defaultMenuForm = {
  id: null as number | null,
  parentId: null as number | null,
  level: null as number | null,
  title: '',
  sort: 0,
  name: '',
  path: '',
  component: null as string | null,
  icon: null as string | null,
  permissionStr: null as string | null
};
const menuForm = ref({ ...defaultMenuForm });
const formRef = ref<ElFormInstance>();
//弹窗的表单验证规则
const rulesMenu = {
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入路由名称', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ]
};

const cancelDialog = () => {
  Object.assign(menuForm.value, defaultMenuForm);
  dialog.visible = false;
};
const updateMenu = (row: PermissionTreeVO) => {
  let parentId = row.parentId || null;
  if (parentId === -1) {
    parentId = null;
  }
  menuForm.value = {
    id: row.id,
    parentId: parentId,
    level: row.level,
    title: row.title,
    sort: row.sort,
    name: row.name,
    path: row.path,
    component: row.component || null,
    icon: row.icon || null,
    permissionStr: row.permissionStr || null
  };
  dialog.visible = true;
  dialog.title = '修改菜单';
};
const insertMenu = (row: PermissionTreeVO | null) => {
  if (row){
    menuForm.value.parentId = row.id;
  }
  dialog.visible = true;
  dialog.title = '添加菜单';
};
const removeMenu =  (id: number) => {
  const res =  removePermission(id);
  return res;
};
const deleteMenu =  (row: PermissionTreeVO) => {
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
      const res = await removeMenu(row.id);
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功',
          duration: 2500
        });
        await getMenuList();
      }
    });
};
const saveMenuList = async () => {
  const res = await saveOrUpdatePermission(menuForm.value);
  return res;
};

//弹窗确认按钮
const submitDialog = async () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage({
        type: 'warning',
        message: '校验失败，无法提交',
        duration: 2500
      });
      return;
    }
    //设置层级
    if (menuForm.value.parentId) {
      const parentNode = findNodeById(menuList.value, menuForm.value.parentId);
      if (parentNode) {
        menuForm.value.level = parentNode.level + 1;
      }
    }else {
      menuForm.value.level = 1;
    }
    const permissionStr = menuForm.value.permissionStr;
    menuForm.value.permissionStr = permissionStr ? permissionStr : null;
    //提交表单
    const res = await saveMenuList();
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '操作成功',
        duration: 2500
      });
      cancelDialog();
      await getMenuList();
    }
  });

};

onMounted(() => {
  getMenuList();
});
</script>

<template>
  <div>
    <div class="mb-10" v-show="showSearch">
      <el-card shadow="hover">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter="handleQuery" class="wid-200" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleQuery" >
              <el-icon ><i-ep-search /></el-icon>
              <span>搜索</span>
            </el-button>
          </el-form-item>

        </el-form>
      </el-card>
    </div>

    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button type="primary" plain @click="insertMenu(null)">
              <el-icon ><i-ep-plus /></el-icon>
              <span>新增</span>
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" @click="handleToggleExpandAll()" plain>
              <el-icon ><i-ep-sort /></el-icon>
              <span>展开/折叠</span>
            </el-button>
          </el-col>
        </el-row>
      </template>

      <el-table
        row-key="id"
        :border="false"
        v-loading="loading"
        :show-overflow-tooltip="true"
        :data="menuList"
        :default-expand-all="expandAll"
        ref="menuTableRef"
      >
        <el-table-column label="名称" prop="title" width="250"  />
        <el-table-column label="图标" width="100">
          <template #default="scope">
            <DynamicIcon v-if="scope.row.icon" :name="scope.row.icon" :size="15" />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100"  prop="sort" />
        <el-table-column label="权限标识"  prop="permissionStr" min-width="200"/>
        <el-table-column label="组件路径" prop="component" min-width="200"/>
        <el-table-column label="创建时间"  prop="createTime" />
        <el-table-column  label="操作" width="200">
          <template #default="scope">
            <span class="operation-a brightBlue-color" @click="updateMenu(scope.row)">修改</span>
            <span class="operation-a brightBlue-color" @click="insertMenu(scope.row)">新增</span>
            <span class="operation-a deepRed-color" @click="deleteMenu(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 编辑菜单的弹窗 -->
  <el-dialog :close-on-click-modal="false"  :destroy-on-close="true"   v-model="dialog.visible" :before-close="cancelDialog"  width="750px">
    <template #header>
      <span style="font-size: 15px">{{dialog.title}}</span>
    </template>
    <div style="margin: 20px 0;">
        <el-form  :inline="true" :rules="rulesMenu" :model="menuForm" ref="formRef" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                  v-model="menuForm.parentId"
                  :data="treeSelectOptions"
                  check-strictly
                  :render-after-expand="true"
                  style="width: 220px"
                  clearable
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="title">
                <el-input  placeholder="请输入" clearable @keyup.enter="handleQuery" v-model="menuForm.title" class="wid-220" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item  prop="name" label-width="100px">
                <template #label>
                <span>
                  <el-tooltip
                    effect="dark"
                    content="路由的name字段"
                    placement="top"
                  >
                    <el-icon :size="12"><i-ep-question-filled /></el-icon>
                  </el-tooltip>
                  路由名称
                </span>
                </template>
                <el-input  placeholder="请输入" clearable @keyup.enter="handleQuery" v-model="menuForm.name" class="wid-200" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item  prop="path" label-width="100px">
                <template #label>
                <span>
                  <el-tooltip
                    effect="dark"
                    content="路由的path字段,例如`/systemManage/user`"
                    placement="top"
                  >
                    <el-icon :size="12"><i-ep-question-filled /></el-icon>
                  </el-tooltip>
                  路由路径
                </span>
                </template>
                <el-input  placeholder="请输入" clearable @keyup.enter="handleQuery" v-model="menuForm.path" class="wid-200" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item  prop="component" label-width="100px">
                <template #label>
                <span>
                  <el-tooltip
                    effect="dark"
                    content="路由的component字段,去掉 末尾的.vue,例如`/systemManage/user/index`"
                    placement="top"
                  >
                    <el-icon :size="12"><i-ep-question-filled /></el-icon>
                  </el-tooltip>
                  路由组件
                </span>
                </template>
                <el-input  placeholder="请输入" clearable @keyup.enter="handleQuery" v-model="menuForm.component" class="wid-200" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  prop="permissionStr" label-width="100px">
                <template #label>
                <span>
                  <el-tooltip
                    effect="dark"
                    content="控制器中的权限标识,例如`system:manage`"
                    placement="top"
                  >
                    <el-icon :size="12"><i-ep-question-filled /></el-icon>
                  </el-tooltip>
                  权限标识
                </span>
                </template>
                <el-input  placeholder="请输入" clearable @keyup.enter="handleQuery" v-model="menuForm.permissionStr" class="wid-200" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item  prop="icon" label-width="100px">
                <template #label>
                <span>
                  <el-tooltip
                    effect="dark"
                    content="element-plus的图标名,例如`Setting`"
                    placement="top"
                  >
                    <el-icon :size="12"><i-ep-question-filled /></el-icon>
                  </el-tooltip>
                  图标
                </span>
                </template>
                <el-input  placeholder="请输入" clearable @keyup.enter="handleQuery" v-model="menuForm.icon" class="wid-200" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="显示排序" prop="sort">
                <el-input-number v-model="menuForm.sort" controls-position="right" :min="0" />
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
</template>

<style scoped>
/** .el-col{
  display: flex;
  justify-content: center;
}
*/
</style>
