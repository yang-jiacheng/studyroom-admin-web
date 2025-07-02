import request from "@/utils/request.ts";
import type { R } from "@/api/R.ts";
import type { StudyRecord } from "./type.ts";
import type { PageResult } from "@/api/common/page/PageResult.ts";

/**
 * 获取自习记录
 */
export const getStudyRecord = (data: any): Promise<R< PageResult<StudyRecord> >> => {
  return request({
    url: `/studyRecord/getStudyRecord`,
    method: 'post',
    data
  });
};
