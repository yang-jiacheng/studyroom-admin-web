import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { BusinessConfig } from "./type.ts";
import type { CollResult } from "@/api/common/page/CollResult.ts";

export const getBusinessList = (): Promise<R< CollResult<BusinessConfig> >> => {
  return request({
    url: `/businessConfigManage/getBusinessList`,
    method: 'post'
  });
};

export const updateBusiness = (data: any): Promise<R<any>> => {
  return request({
    url: `/businessConfigManage/updateBusiness`,
    method: 'post',
    data
  });
};
