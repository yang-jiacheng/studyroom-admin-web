import { createRouter, createWebHashHistory, type RouteRecordRaw, RouterView } from 'vue-router';
import { constantRoute } from '@/router/routes.ts';
import { usePermissionStore } from '@/store/permission.ts';
import { getAccessToken } from '@/utils/auth.ts';
import { getMinePermissionTree } from "@/api/permission";
import type { PermissionTreeVO } from "@/api/permission/type.ts";
import { closeLoading, showLoading } from "@/utils/loading.ts";

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute
});

// 匹配views里面所有的.vue文件
const views = import.meta.glob('@/views/**/*.vue');

/**
 * 递归函数：将后端返回的路由数据转换成 RouteRecordRaw
 */
function transformRoutes (backendRoutes: PermissionTreeVO[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = [];
  backendRoutes.forEach((route) => {
    if (route.type === 3) {
      return;
    }
    // 获取当前路由的元数据（例如路径、名称、图标等）
    const uiMeta = route.uiMeta;
    // 如果有子路由，则递归转换子路由
    const children = route.children && route.children.length
      ? transformRoutes(route.children)
      : [];
    // 如果没有路径或名称，跳过该路由
    if (!uiMeta?.path || !uiMeta?.name) {
      return;
    }
    // 如果是目录类型的路由
    if (route.type === 1) {
      const r: RouteRecordRaw = {
        path: uiMeta.path,
        name: uiMeta.name,
        component: RouterView,
        meta: {
          title: route.title,
          icon: uiMeta.icon,
          permissionStr: route.permissionStr,
          type: route.type
        },
        children
      };
      res.push(r);
      return;
    }
    const normalizedPath = uiMeta.component;
    if (!normalizedPath) {
      return;
    }
    // 匹配预加载的组件
    const componentPath = Object.keys(views).find(key =>
      key.includes(`${normalizedPath}.vue`)
    );
    if (!componentPath) {
      return;
    }
    const r: RouteRecordRaw = {
      path: uiMeta.path,
      name: uiMeta.name,
      component: views[componentPath],
      meta: {
        title: route.title,
        icon: uiMeta.icon,
        permissionStr: route.permissionStr,
        type: route.type
      },
      children
    };
    res.push(r);
  });
  return res;
}

/**
 * 全局路由前置守卫
 */
router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionStore();
  // 假设有一个判断是否已登录的逻辑
  const token = getAccessToken();
  // 🧤 保护 login 页面不再获取权限路由
  if (to.path === '/login') {
    next();
    return;
  }

  if (token && !permissionStore.isRoutesAdded) {
    // 如果尚未添加动态路由，则获取后端菜单并动态添加
    try {
      //获取后端路由
      showLoading("正在加载系统资源...", 10000);
      const backendRoutes = await getMinePermissionTree();
      const r = backendRoutes.result ? backendRoutes.result : [];
      const newRoutes = transformRoutes(r);
      // 动态添加路由
      newRoutes.forEach((route) => {
        //挂载到 home 下
        router.addRoute('home', route);
      });
      // 存储到 Pinia
      permissionStore.setRoutes(newRoutes);
      permissionStore.setTree(r);
      // 标记已添加
      permissionStore.setRoutesAdded(true);
      closeLoading();
      next(to.fullPath);
      return;
    } catch (error) {
      closeLoading();
      console.error('获取路由失败：', error);
      next('/login');
      return;
    }
  }
  // 未登录，或 token 不存在
  if (!token && to.path !== '/login') {
    next('/login');
    return;
  }

  next();

});

export default router;
