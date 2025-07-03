import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { PageResult } from "@/api/common/page/PageResult.ts";
import type { AdminInfo, AdminInfoDetail } from "@/api/adminInfo/type.ts";
import type { CollResult, SelResult } from "@/api/common/page/CollResult.ts";

/**
 * 获取后管用户列表
 */
export const getAdminInfoPageList = (data: any): Promise<R< PageResult<AdminInfo> >> => {
  return request({
    url: `/adminManage/getAdminInfoPageList`,
    method: 'post',
    data: data
  });
};

/**
 * 获取后管用户根据id
 */
export const getAdminInfoById = (id: any): Promise<R<AdminInfoDetail>> => {
  return request({
    url: `/adminManage/getAdminInfoById?id=${id}`,
    method: 'post'
  });
};

/**
 * 修改后管用户
 */
export const editAdminInfo = (data: any): Promise<R<any>> => {
  return request({
    url: `/adminManage/editAdminInfo`,
    method: 'post',
    data: data
  });
};

/**
 * 修改后管用户状态
 */
export const disabledAdminInfo = (data: any): Promise<R<any>> => {
  return request({
    url: `/adminManage/disabledAdminInfo`,
    method: 'post',
    data: data
  });
};

/**
 * 删除后管用户
 */
export const removeAdminInfoByIds = (data: any): Promise<R<any>> => {
  return request({
    url: `/adminManage/removeAdminInfoByIds`,
    method: 'post',
    data: data
  });
};

/**
 * 获取角色列表
 */
export const getRoleRecords = (): Promise<R< CollResult<SelResult> >> => {
  return request({
    url: `/roleManage/getRoleRecords`,
    method: 'post'
  });
};

/**
 * 获取当前登录用户信息
 */
export const getMine = (): Promise<R<AdminInfo>> => {
  return request({
    url: `/mine/getMineInfo`,
    method: 'post'
  });
};

/**
 * 修改个人资料
 */
export const updatePersonal = (data: any): Promise<R<any>> => {
  return request({
    url: `/personalManage/updatePersonal`,
    method: 'post',
    data: data
  });
};
