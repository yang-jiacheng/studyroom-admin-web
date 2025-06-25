import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import type { PermissionTreeVO } from "@/api/permission/type.ts";

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    // 标记路由是否添加
    isRoutesAdded: false,
    dynamicRoutes: [] as RouteRecordRaw[],
    tree: [] as PermissionTreeVO[]
  }),
  actions: {
    setRoutes (routes: RouteRecordRaw[]) {
      this.dynamicRoutes = routes;
    },
    setTree (list: PermissionTreeVO[]) {
      this.tree = list;
    },
    setRoutesAdded (status: boolean) {
      this.isRoutesAdded  = status;
    },
    reset () {
      this.$reset();
    }
  }
});
