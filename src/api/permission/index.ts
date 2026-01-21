import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { PermissionTreeVO, Role, RoleDetail } from "@/api/permission/type.ts";
import type { PageResult } from "@/api/common/page/PageResult.ts";

/**
 * 获取菜单
 */
export const getPermissionTree = (): Promise<R<PermissionTreeVO[]>> => {
  return request({
    url: `/permissionManage/getPermissionTree`,
    method: 'post'
  });
};

export const getMinePermissionTree = (): Promise<R<PermissionTreeVO[]>> => {
  return request({
    url: `/mine/getMinePermissionTree`,
    method: 'post'
  });
};

/**
 * 编辑菜单
 */
export const saveOrUpdatePermission = (data: any): Promise<R<PermissionTreeVO>> => {
  return request({
    url: '/permissionManage/saveOrUpdatePermission',
    method: 'post',
    data: data
  });
};

/**
 * 删除菜单
 */
export const removePermission = (id: string): Promise<R<any>> => {
  return request({
    url: `/permissionManage/removePermission?id=${id}`,
    method: 'post'
  });
};

/**
 * 获取角色
 */
export const getRolePageList = (data: any): Promise<R< PageResult<Role> >> => {
  return request({
    url: `/roleManage/getRolePageList`,
    method: 'post',
    data: data
  });
};

/**
 * 删除角色
 */
export const removeRoleById = (id: number): Promise<R<any>> => {
  return request({
    url: `/roleManage/removeRoleById?id=${id}`,
    method: 'post'
  });
};

/**
 * 编辑角色
 */
export const addOrUpdateRole = (data: any): Promise<R<number>> => {
  return request({
    url: '/roleManage/addOrUpdateRole',
    method: 'post',
    data: data
  });
};

/**
 * 获取角色详情
 */
export const getRoleById = (id: number): Promise<R<RoleDetail>> => {
  return request({
    url: `/roleManage/getRoleById?id=${id}`,
    method: 'post'
  });
};
