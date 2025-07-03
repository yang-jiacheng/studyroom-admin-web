import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { PageResult } from "@/api/common/page/PageResult.ts";
import type { Feedback } from "@/api/feedback/type.ts";

export const getFeedBackPageList = (data: any): Promise<R< PageResult<Feedback> >> => {
  return request({
    url: `/feedBackManage/getFeedBackPageList`,
    method: 'post',
    data: data
  });
};

export const removeFeedBackById = (id: number): Promise<R<any>> => {
  return request({
    url: `/feedBackManage/removeFeedBackById?id=${id}`,
    method: 'post'
  });
};

export const replyFeedBackById = (data: any): Promise<R<any>> => {
  return request({
    url: `/feedBackManage/replyFeedBackById`,
    method: 'post',
    data: data
  });
};
