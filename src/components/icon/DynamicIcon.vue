<script setup lang="ts">
import {
  CircleCheck,
  Collection,
  Connection,
  Document,
  Eleme,
  Flag,
  Goods,
  Monitor,
  Notebook,
  Operation,
  Promotion,
  QuestionFilled,
  Setting,
  Shop,
  Tickets,
  Upload,
  UploadFilled,
  User
} from '@element-plus/icons-vue';

// 1. 用泛型声明 props 类型，name 必须传
const props = defineProps<{
  name: string;
  size?: number;
}>();

const iconMap: Record<string, any> = {
  "Setting": Setting,
  "User": User,
  "Operation": Operation,
  "Document": Document,
  "QuestionFilled": QuestionFilled,
  "Connection": Connection,
  "UploadFilled": UploadFilled,
  "Upload": Upload,
  "Notebook": Notebook,
  "Shop": Shop,
  "Monitor": Monitor,
  "Goods": Goods,
  "Tickets": Tickets,
  "Collection": Collection,
  "Promotion": Promotion,
  "CircleCheck": CircleCheck,
  "Flag": Flag,
  "Eleme": Eleme
};

const currentIcon = computed(() => {
  const key = props.name;
  return iconMap[key] || null;
});
</script>
<template>
  <el-icon :size="props.size || 16">
    <component :is="currentIcon"/>
  </el-icon>
</template>
