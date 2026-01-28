<template>
  <el-container class="layout-container">
    <!-- 侧边栏内容 -->
    <el-aside :width="asideWidth" class="sidebar">
      <!-- logo -->
      <div class="sidebar-logo" @click="goIndex">
        <span v-if="!isSidebarCollapsed">云自习后台</span>
        <span v-else>云自习</span>
      </div>
      <!-- 菜单 -->
      <el-scrollbar>
        <el-menu
          active-text-color="#ffd04b"
          text-color="#fff"
          background-color="#304156"
          class="el-menu-vertical-demo"
          :default-active="activeMenu"
          :unique-opened="true"
          :collapse="isSidebarCollapsed"
          :collapse-transition="false"
          >

          <el-menu-item @click="handleMenuClick('/main')" index="/main">
            <el-icon :size="iconSize"><i-ep-house /></el-icon>
            <span>首页</span>
          </el-menu-item>

          <template v-for="(item, index) in menuTree" :key="index">
            <el-menu-item v-if="item.type === PermissionType.Menu" :index="item.uiMeta?.path || ''" @click="handleMenuClick(item.uiMeta?.path || '')">
              <DynamicIcon v-if="item.uiMeta?.icon" :name="item.uiMeta.icon" :size="iconSize" />
              <span>{{item.title}}</span>
            </el-menu-item>

            <el-sub-menu v-else :index="item.uiMeta?.path || ''">
              <template #title>
                <DynamicIcon v-if="item.uiMeta?.icon" :name="item.uiMeta.icon" :size="iconSize" />
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="(child, index2) in item.children" :key="index2" :index="child.uiMeta?.path || ''" @click="handleMenuClick(child.uiMeta?.path || '')">
                <span>{{child.title}}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

  <!--页面主体内容-->
    <el-container>
      <!--页面头部-->
      <el-header class="header">
        <div class="header-left">
          <el-icon :size="18" class="collapse-icon" @click="toggleSidebar">
            <i-ep-expand v-if="isSidebarCollapsed" />
            <i-ep-fold v-else/>
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" >
              {{ item.meta?.title || item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
             <span class="el-dropdown-link">
               <el-avatar size="default" shape="square" :src="mine.profilePath" />
               <span style="margin-left: 8px;">{{mine.name}}</span>
               <el-icon class="el-icon--right">
                 <i-ep-arrow-down />
               </el-icon>
             </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logoutTo">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <!--页面内容-->
      <div class="main-content cm-body-BackCol">
        <router-view />

      </div>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { usePermissionStore } from "@/store/permission.ts";
import { PermissionType, type PermissionTreeVO } from "@/api/permission/type.ts";
import { useMineInfoStore } from "@/store/mineInfo.ts";
import { removeToken } from '@/utils/auth.ts';
import { logout } from "@/api/auth/index.ts";
import { getMine } from "@/api/adminInfo/index.ts";
import DynamicIcon from '@/components/icon/DynamicIcon.vue';

const router = useRouter();
const route = useRoute();
const breadcrumbList = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title);
});
//菜单
const permissionStore = usePermissionStore();
const { tree } = storeToRefs(permissionStore);
const filterMenuTree = (list: PermissionTreeVO[]): PermissionTreeVO[] => {
  const result: PermissionTreeVO[] = [];
  list.forEach(item => {
    if (item.type === PermissionType.Directory || item.type === PermissionType.Menu) {
      const newItem = { ...item };
      newItem.children = item.children ? filterMenuTree(item.children) : [];
      result.push(newItem);
    }
  });
  return result;
};
const menuTree = computed(() => filterMenuTree(tree.value || []));
//用户信息
const mineInfoStore = useMineInfoStore();
const { mine } = storeToRefs(mineInfoStore);
const getMineInfo = async () => {
  const res = await getMine();
  if (res.code !== 0){
    ElMessage.error(res.msg);
  }else {
    if (res.result){
      mineInfoStore.setMineInfo(res.result);
    }
  }
};
//图标大小
const iconSize = 15;
//侧边栏宽度
const asideWidth = ref('200px');
// 当前激活菜单
const activeMenu = ref(route.path);
// 路由变化时更新 activeMenu
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath;
}, { immediate: true });
// 控制侧边栏折叠的状态
const isSidebarCollapsed = ref(false);
// 切换侧边栏折叠状态的方法
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  if (isSidebarCollapsed.value) {
    asideWidth.value = '64px';
  } else {
    asideWidth.value = '200px';
  }
};

const handleMenuClick = (index: string) => {
  router.replace(index);
};
const  goIndex = () => {
  // router.replace('/');
  location.href = import.meta.env.VITE_APP_CONTEXT_PATH + '#/main';
};
const logoutTo = async () => {
  await logout();
  permissionStore.reset();
  mineInfoStore.reset();
  removeToken();
  await router.replace('/login');
};

onMounted(async () => {
  await getMineInfo();
});
</script>

<style scoped>

.el-menu-item{
  height: 50px !important;
  font-size: 14px !important;
}
.el-sub-menu__title{
  height: 50px !important;
  font-size: 14px !important;
}
.el-menu-item.is-active{
  color: #409EFF !important;
  background-color: #263445 !important;
}

.el-menu--collapse .el-sub-menu.is-active .el-sub-menu__title{
  color: #409EFF !important;
}

.el-sub-menu.is-active .el-sub-menu__title {
  border-bottom-color: #409EFF !important;
}

/* ---整体布局容器样式--- */
.layout-container {
  height: 100vh; /* 使布局容器高度占满整个视口 */
  background-color: #f0f2f5; /* 设置主背景色，通常用于页面背景 */
}
/* 移除下拉菜单焦点外边框 */
.el-dropdown-link:focus {
  outline: none !important;
}

/* ---侧边栏（Sidebar）样式--- */
.layout-container .sidebar {
  background-color: #304156; /* 侧边栏的深色背景 */
  color: #bfcbd9; /* 侧边栏内文字的默认颜色 */
  transition: width 0.3s; /* 当侧边栏宽度改变时（例如展开/折叠），应用平滑过渡效果 */
  height: 100%; /* 使侧边栏高度占满其父容器 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 子元素垂直排列 */
  overflow-x: hidden; /* 防止在侧边栏宽度折叠或展开动画期间内容横向溢出 */
}

/* el-sub-menu 下的 el-menu-item 样式 */
/* 注意：由于使用了 scoped，此规则需要 Element Plus 内部样式未完全覆盖，或可能需要 :deep() 深度选择器 */
/* 如果此规则不生效，请考虑使用 :deep(.el-sub-menu .el-menu-item) */
.el-sub-menu .el-menu-item {
  background: #1f2d3d !important; /* 设置子菜单项的背景色，通常比父菜单背景色更深或不同 */
}

/* 点击/激活时的样式 */
.el-sub-menu .el-menu-item.is-active {
  background-color: #263445 !important; /* 示例：点击/激活时的背景色，可以比hover色更亮或不同 */
  color: #409EFF !important; /* 示例：点击/激活时的文字颜色，通常是主题色 */
}
/* 侧边栏 Logo 区域样式 */
.layout-container .sidebar .sidebar-logo {
  height: 50px; /* Logo 区域的高度，与顶部 Header 高度保持一致，使其对齐 */
  line-height: 50px; /* 使 Logo 文字垂直居中 */
  text-align: center; /* 文字水平居中 */
  font-size: 16px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #fff; /* 文字颜色 */
  flex-shrink: 0; /* 防止 Logo 区域在 Flex 容器中被压缩 */
  overflow: hidden; /* 隐藏 Logo 区域内溢出的内容 */
  white-space: nowrap; /* 防止 Logo 文字换行 */
  cursor: pointer;
}

/* Logo 文字在侧边栏折叠时的样式 */
.layout-container .sidebar .sidebar-logo.collapsed span {
  display: none; /* 当侧边栏折叠时，隐藏 Logo 文本，只显示图标（如果有的化） */
  /* 其他替代方案：opacity: 0; visibility: hidden; 可以提供更平滑的过渡效果 */
}

/* 侧边栏内滚动区域样式 (通常用于 el-scrollbar) */
.layout-container .sidebar .el-scrollbar {
  flex-grow: 1; /* 让滚动区域填充侧边栏的剩余垂直空间 */
  height: calc(100% - 50px); /* 计算滚动区域的实际高度：总高度减去 Logo 区域高度 */
}

/* 侧边栏内菜单 (el-menu) 样式 */
.layout-container .sidebar .el-scrollbar .el-menu {
  border-right: none; /* 移除 Element Plus el-menu 默认的右边框 */
  height: 100%; /* 使菜单高度占满滚动区域 */
  width: 100% !important; /* 强制菜单宽度占满，覆盖 Element Plus 可能设置的内联宽度 */
}

/* 菜单项 Hover 和子菜单标题 Hover 时的背景色 */
.layout-container .sidebar .el-scrollbar .el-menu-item:hover,
.layout-container .sidebar .el-scrollbar .el-sub-menu__title:hover {
  background-color: #263445 !important; /* 设置鼠标悬停时的背景色 */
}

/* 侧边栏滚动条的颜色（这个选择器可能不直接作用于滚动条本身，
   而是作用于滚动条所在的容器背景或其中的文本，具体效果需测试） */
.layout-container .sidebar .el-scrollbar {
  color: #409EFF !important; /* 激活菜单项的颜色，这里可能是误写，通常用于文字颜色 */
  background-color: #263445 !important; /* 设置滚动条区域的背景色，可能与菜单的背景色冲突 */
}

/* 顶部 Header 样式 */
.layout-container .header {
  height: 50px; /* Header 高度 */
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 左右内容两端对齐 */
  align-items: center; /* 垂直居中对齐 */
  background-color: #fff; /* 白色背景 */
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); /* 底部阴影，增加层次感 */
  padding: 0 20px; /* 左右内边距 */
}

/* Header 左侧区域样式 */
.layout-container .header .header-left {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
}

/* 面包屑样式调整 */
.layout-container .header .header-left .el-breadcrumb {
  margin-left: 10px; /* 面包屑左侧外边距，与折叠图标或标题分离 */
}

/* Header 右侧区域样式 */
.layout-container .header .header-right {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
}

/* 下拉菜单链接样式 */
.layout-container .header .header-right .el-dropdown-link {
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
}

/* 主要内容区域样式 */
.main-content {
  height: calc(100vh - 50px); /* 计算内容区域的高度：视口总高减去 Header 高度 */
  overflow-y: auto; /* 当内容超出高度时，显示垂直滚动条 */
}

/* 搜索卡片样式 */
.layout-container .main-content .search-card {
  margin-bottom: 15px; /* 搜索卡片下边距 */
}

/* 覆盖 Element Plus 卡片主体部分的内边距 */
/* 注意：这里没有使用 :deep()。如果 .el-card__body 是 Element Plus 组件的内部样式，
   在 scoped 样式中直接这样写可能不生效，需使用 :deep() */
.layout-container .main-content .search-card .el-card__body {
  padding-bottom: 0px; /* 减少卡片底部内边距 */
}

/* 搜索表单项间距 */
.layout-container .main-content .search-card .search-form .el-form-item {
  margin-bottom: 18px; /* 搜索表单项的下外边距 */
}

/* 表格卡片样式 */
.layout-container .main-content .table-card {
  /* 如果有针对 .table-card 的直接样式，可以添加到这里 */
}

/* 表格工具栏样式 */
.layout-container .main-content .table-card .table-toolbar {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 左右内容两端对齐 */
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 15px; /* 工具栏下边距 */
}

/* 表格工具栏右侧按钮间距 */
.layout-container .main-content .table-card .table-toolbar .toolbar-right .el-button {
  margin-left: 10px; /* 按钮左侧外边距 */
}

/* 折叠图标样式 */
.collapse-icon {
  margin-right: 10px; /* 图标右侧外边距 */
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
}
</style>
