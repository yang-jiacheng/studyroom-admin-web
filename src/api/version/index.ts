import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { CollResult } from "@/api/common/page/CollResult.ts";
import type { Version } from "@/api/version/type.ts";

export const getVersionList = (): Promise<R< CollResult<Version> >> => {
  return request({
    url: `/versionManage/getVersionList`,
    method: 'post'
  });
};

export const saveVersion = (data: any): Promise<R<any>> => {
  return request({
    url: `/versionManage/saveVersion`,
    method: 'post',
    data
  });
};
