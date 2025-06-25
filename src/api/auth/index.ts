import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { LoginVerifyCodeDTO } from "@/api/auth/type.ts";

/**
 * 登录
 */
export const loginWithVerifyCode = (data: LoginVerifyCodeDTO): Promise<R<any>> => {
  return request({
    url: '/token/login',
    method: 'post',
    data: data
  });
};

/**
 * 登出
 */
export const logout = (): Promise<R<any>> => {
  return request({
    url: '/token/logout',
    method: 'post'
  });
};
