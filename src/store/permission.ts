import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import type { PermissionTreeVO } from "@/api/permission/type.ts";

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    // 标记路由是否添加
    isRoutesAdded: false,
    dynamicRoutes: [] as RouteRecordRaw[],
    tree: [] as PermissionTreeVO[],
    buttonPermissions: [] as string[]
  }),
  actions: {
    setRoutes (routes: RouteRecordRaw[]) {
      this.dynamicRoutes = routes;
    },
    setTree (list: PermissionTreeVO[]) {
      this.tree = list;
      this.buttonPermissions = collectButtonPermissions(list);
    },
    hasPermission (permissionStr: string) {
      return this.buttonPermissions.includes(permissionStr);
    },
    setRoutesAdded (status: boolean) {
      this.isRoutesAdded  = status;
    },
    reset () {
      this.$reset();
    }
  }
});

const collectButtonPermissions = (list: PermissionTreeVO[]) => {
  const permissions = new Set<string>();
  // 定义一个递归函数，遍历权限树节点
  const walk = (nodes: PermissionTreeVO[]) => {
    nodes.forEach((node) => {
      if (node.type === 3 && node.permissionStr) {
        permissions.add(node.permissionStr);
      }
      // 如果当前节点有子节点，递归处理子节点
      if (node.children && node.children.length > 0) {
        walk(node.children);
      }
    });
  };
  // 调用递归函数，开始遍历权限树
  walk(list);
  // 将 Set 转换为数组并返回
  return Array.from(permissions);
};
