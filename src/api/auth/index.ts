import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { LoginVerifyCodeDTO,TokenPair } from "@/api/auth/type.ts";
import { RefreshTokenKey,getRefreshToken } from '@/utils/auth.ts';

/**
 * 登录
 */
export const loginWithVerifyCode = (data: LoginVerifyCodeDTO): Promise<R<TokenPair>> => {
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
    headers: {
      [RefreshTokenKey]: getRefreshToken()
    },
    method: 'post'
  });
};

/**
 * 使用refreshToken刷新accessToken
 */
export const refresh = (): Promise<R<any>> => {
  return request({
    url: '/token/refresh',
    headers: {
      [RefreshTokenKey]: getRefreshToken()
    },
    method: 'post'
  });
};
