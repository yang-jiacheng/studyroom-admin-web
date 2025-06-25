import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { PageResult } from "@/api/common/page/PageResult.ts";
import type { User } from "@/api/user/type.ts";

/**
 * 获取用户列表
 */
export const getUserPageList = (data: any): Promise<R< PageResult<User> >> => {
  return request({
    url: `/userManage/getUserPageList`,
    method: 'post',
    data: data
  });
};

/**
 * 保存用户
 */
export const saveUser = (data: any): Promise<R<any>> => {
  return request({
    url: `/userManage/saveUser`,
    method: 'post',
    data: data
  });
};

/**
 * 批量删除用户
 */
export const removeUserByIds = (ids: number[]): Promise<R<any>> => {
  return request({
    url: `/userManage/removeUserByIds`,
    method: 'post',
    data: ids
  });
};

