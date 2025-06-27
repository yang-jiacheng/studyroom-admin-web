import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { StsTokenResp } from "./type.ts";

export const getStsToken = (): Promise<R<StsTokenResp>> => {
  return request({
    url: `/resources/getStsToken`,
    method: 'post'
  });
};
