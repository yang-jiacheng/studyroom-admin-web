import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";

/**
 * 获取验证码
 */
export const getKaptcha = (): Promise<R<any>> => {
  return request({
    url: '/Kaptcha',
    method: 'post'
  });
};
