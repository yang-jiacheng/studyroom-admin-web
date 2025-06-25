import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";

export const getAgreement = (type: number): Promise<R<any>> => {
  return request({
    url: `/userAgreementManage/getAgreement-${type}`,
    method: 'post'
  });
};

export const saveAgreement = (data: any): Promise<R<any>> => {
  return request({
    url: `/userAgreementManage/saveAgreement`,
    method: 'post',
    data
  });
};
