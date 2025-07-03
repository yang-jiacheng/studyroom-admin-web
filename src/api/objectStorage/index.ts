import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { PageResult } from "@/api/common/page/PageResult.ts";
import type { ObjectStorage } from "@/api/objectStorage/type.ts";

export const getObjectStoragePageList = (data: any): Promise<R< PageResult<ObjectStorage> >> => {
  return request({
    url: `/objectStorageManage/getObjectStoragePageList`,
    method: 'post',
    data
  });
};

export const saveObjectStorage = (data: any): Promise<R<any>> => {
  return request({
    url: `/objectStorageManage/saveObjectStorage`,
    method: 'post',
    data
  });
};

export const deleteObjectStorage = (id: number): Promise<R<any>> => {
  return request({
    url: `/objectStorageManage/deleteObjectStorage?id=${id}`,
    method: 'post'
  });
};
