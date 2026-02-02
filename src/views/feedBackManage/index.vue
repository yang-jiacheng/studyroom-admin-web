<script setup lang="ts">
import { getFeedBackPageList,removeFeedBackById,replyFeedBackById } from "@/api/feedback";
import type { Feedback } from "@/api/feedback/type.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";
import { FeedBackManageEnum } from "@/enums/permission/feedBackManage.ts";

/**
 * 查询表单
 */
const queryFormRef = ref<ElFormInstance>();
const queryParams = ref({
  page: 1,
  limit: 10,
  phone: '',
  content: '',
  replyStatus: '',
  userId: '',
  status: ''
});

/**
 * 表格数据
 */
const total = ref(0);
const loading = ref(false);
const userTableRef = ref<ElTableInstance>();
const recordData = ref<Feedback[]>([]);
const getRecordData = async () => {
  loading.value = true;
  const { result } = await getFeedBackPageList(queryParams.value);
  loading.value = false;
  if (result){
    recordData.value = result.records  || [];
    total.value = result.total;
  }
};

/**
 * 反馈图片预览
 */
const pic = ref('');
const imagePreviewer = ref<ElImageInstance>();
const handlePreview = async (row: Feedback) => {
  pic.value = row.pic;
  await nextTick();
  imagePreviewer.value?.showPreview();
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

const handleReply = (row: Feedback) => {
  dialog.visible = true;
  formEdit.id = row.id;
  formEdit.reply = row.reply;
};

const handleRemove = (row: Feedback) => {
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
      const { code } = await removeFeedBackById(row.id);
      if (code === 0) {
        ElMessage.success('删除成功');
        resetQuery();
      }
    });
};

/**
 * 回复弹窗
 */
const dialog = reactive<DialogOption>({
  visible: false,
  title: '回复'
});

//弹窗表单数据
const formEditDefault = {
  id: 0,
  reply: ''
};

const formEdit = reactive(Object.assign({}, formEditDefault));

//弹窗表单实例
const formEditUserRef = ref<ElFormInstance>();
const rulesEditUser = {
  reply: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value && value.length > 255)  {
          callback(new Error('最多输入255个字符'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const submitDialog = () => {
  formEditUserRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { code } = await replyFeedBackById(formEdit);
      if (code === 0) {
        ElMessage.success('回复成功');
        cancelDialog();
        await getRecordData();
      }
    }
  });
};

const cancelDialog = () => {
  Object.assign(formEdit, formEditDefault);
  dialog.visible = false;
};

onMounted(async () => {
  showLoading();
  await getRecordData();
  closeLoading();
});

</script>

<template>
  <div>
    <div class="mb-10" >
      <el-card shadow="hover">
        <el-form v-permission="FeedBackManageEnum.List" ref="queryFormRef"  :model="queryParams" :inline="true" >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="queryParams.phone" placeholder="请输入" clearable @keyup.enter="handleQuery" class="wid-200" />
          </el-form-item>

          <el-form-item label="反馈内容" prop="content">
            <el-input v-model="queryParams.content" placeholder="请输入" clearable @keyup.enter="handleQuery" class="wid-200" />
          </el-form-item>

          <el-form-item  label="状态" prop="replyStatus">
            <el-radio-group v-model="queryParams.replyStatus">
              <el-radio value="0" >未回复</el-radio>
              <el-radio value="1" >已回复</el-radio>
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
        <el-table-column label="反馈人" prop="name"   />
        <el-table-column label="手机号"  prop="phone" />
        <el-table-column label="反馈内容" prop="content" min-width="200" />
        <el-table-column label="反馈图片" prop="pic" >
          <template #default="scope">
            <div v-if="scope.row.pic">
              <span class="operation-a blue-color" @click="handlePreview(scope.row)">查看</span>
            </div>
            <div v-else>暂无图片</div>
          </template>
        </el-table-column>
        <el-table-column label="反馈时间"  prop="createTime" />
        <el-table-column label="状态"  prop="replyStatus" >
          <template #default="scope">
            <span  v-if="scope.row.replyStatus === 0">未回复</span>
            <span class="blue-color" v-else-if="scope.row.replyStatus === 1">已回复</span>
          </template>
        </el-table-column>
        <el-table-column label="回复人"  prop="adminName" />
        <el-table-column label="回复时间"  prop="replyTime" />
        <el-table-column  label="操作" width="120">
          <template #default="scope">
            <span v-permission="FeedBackManageEnum.Reply" class="operation-a blue-color" @click="handleReply(scope.row)">回复</span>
            <span v-permission="FeedBackManageEnum.Delete" class="operation-a red-color" @click="handleRemove(scope.row)">删除</span>
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

    <el-image
      class="visually-hidden"
      ref="imagePreviewer"
      :src="pic"
      :preview-src-list="[pic]"
      :initial-index="0"
      loading="eager"
      fit="contain"
    />

    <el-dialog :close-on-click-modal="false"  :destroy-on-close="true"   v-model="dialog.visible" :before-close="cancelDialog"  width="650px">
      <template #header>
        <span style="font-size: 15px">{{dialog.title}}</span>
      </template>
      <div style="margin: 20px 0;">
        <el-form  :inline="false" :rules="rulesEditUser" :model="formEdit" ref="formEditUserRef" label-position="top" label-width="80px">
          <el-form-item label="回复内容"  prop="reply">
            <el-input v-model="formEdit.reply" type="textarea" :rows="6" clearable placeholder="请输入内容"></el-input>
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

</style>
