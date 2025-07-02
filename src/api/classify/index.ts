import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { CatalogTreeVO, Classify, Catalog } from "@/api/classify/type.ts";

/**
 * 获取图书馆树
 */
export const getClassifyTree = (): Promise<R<CatalogTreeVO[]>> => {
  return request({
    url: `/classifyManage/getClassifyTree`,
    method: 'post'
  });
};

/**
 * 获取图书馆根据id
 */
export const getClassifyById = (id: number): Promise<R<Classify>> => {
  return request({
    url: `/classifyManage/getClassifyById?id=${id}`,
    method: 'post'
  });
};

/**
 * 修改图书馆
 */
export const updateClassify = (data: Classify): Promise<R<any>> => {
  return request({
    url: `/classifyManage/updateClassify`,
    method: 'post',
    data
  });
};

/**
 * 删除图书馆
 */
export const removeClassify = (id: number): Promise<R<any>> => {
  return request({
    url: `/classifyManage/removeClassify?id=${id}`,
    method: 'post'
  });
};

/**
 * 删除节点
 */
export const removeCatalog = (id: number): Promise<R<any>> => {
  return request({
    url: `/classifyManage/removeCatalog?id=${id}`,
    method: 'post'
  });
};

/**
 * 获取节点
 */
export const getCatalogById = (id: number): Promise<R<Catalog>> => {
  return request({
    url: `/classifyManage/getCatalogById?id=${id}`,
    method: 'post'
  });
};

/**
 * 编辑节点
 */
export const saveCatalog = (data: Catalog): Promise<R<any>> => {
  return request({
    url: `/classifyManage/saveCatalog`,
    method: 'post',
    data
  });
};
