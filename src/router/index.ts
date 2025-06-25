import { createRouter, createWebHashHistory,type RouteRecordRaw }  from 'vue-router';
import { constantRoute } from '@/router/routes.ts';
import { usePermissionStore } from '@/store/permission.ts';
import { getToken } from '@/utils/auth.ts';
import { getMinePermissionTree } from "@/api/permission";
import type { PermissionTreeVO } from "@/api/permission/type.ts";

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
    const normalizedPath  =  route.component;
    // 匹配预加载的组件
    const componentPath = Object.keys(views).find(key  =>
      key.includes(`${normalizedPath}.vue`)
    ) || '';
    const r: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      component: views[componentPath],
      meta: {
        title: route.title
      },
      children: []
    };
    // 若有 children，则继续递归
    if (route.children && route.children.length) {
      r.children = transformRoutes(route.children);
    }
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
  const token = getToken();

  // 🧤 保护 login 页面不再获取权限路由
  if (to.path === '/login') {
    next();
    return;
  }

  if (token && !permissionStore.isRoutesAdded) {
    // 如果尚未添加动态路由，则获取后端菜单并动态添加
    try {
      //获取后端路由
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

      next(to.fullPath);
      return;
    } catch (error) {
      console.error('获取路由失败：', error);
      next('/login');
      return;
    }
  }
  // 未登录，或 token 不存在
  if (!token && to.path  !== '/login') {
    next('/login');
    return;
  }

  next();

});

export default router;
