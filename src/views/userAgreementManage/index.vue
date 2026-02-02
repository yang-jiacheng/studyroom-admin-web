<script setup lang="ts">
import { getAgreement,saveAgreement } from "@/api/agreement";
import useTinymce from "@/hooks/useTinymce.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";
import { UserAgreementManageEnum } from "@/enums/permission/userAgreementManage.ts";

const tinyId = 'content';
const {  initEditor, getContent, setContent } = useTinymce();

const activeIndex = ref('1');
const handleSelect = async (index: string) => {
  showLoading();
  activeIndex.value = index;
  const content = await getAgreementByType();
  setContent(tinyId, content);
  closeLoading();
};
async function getAgreementByType (){
  const { result } = await getAgreement(Number(activeIndex.value));
  return result || '';
}

async function saveData () {
  const content = getContent(tinyId);
  const payload = {
    type: Number(activeIndex.value),
    content
  };
  const { code } = await saveAgreement(payload);
  if (code === 0) {
    ElMessage.success('保存成功');
  }
}

onMounted(async () => {
  showLoading();
  const content = await getAgreementByType();
  await initEditor(tinyId, content,400);
  closeLoading();
});
</script>

<template>
  <div>
    <!-- 顶部菜单 -->
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">隐私政策</el-menu-item>
      <el-menu-item index="2">用户协议</el-menu-item>
    </el-menu>

    <el-card class="mt-10" shadow="hover">
      <div >
        <div v-permission="UserAgreementManageEnum.List" :id="tinyId"></div>
        <div class="mt-10">
          <el-button v-permission="UserAgreementManageEnum.Save" class="advert-btn" type="primary" plain @click="saveData">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
</style>
