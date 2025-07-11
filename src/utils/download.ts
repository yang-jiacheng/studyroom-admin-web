import type { AxiosRequestConfig } from 'axios';
import request from '@/utils/request.ts';
import { showLoading,closeLoading } from "@/utils/loading.ts";

/**
 * 通用文件下载
 *
 * @param url       下载接口地址
 * @param params    GET 时为 params、POST 时为 body data
 * @param method    'GET' | 'POST'，默认 GET
 */
export async function downloadFile (
  url: string,
  params?: Record<string, any>,
  method: 'GET' | 'POST' = 'GET'
): Promise<void> {
  const config: AxiosRequestConfig = {
    url,
    method,
    responseType: 'blob',
    ...(method === 'GET' ? { params } : { data: params })
  };

  try {
    showLoading("文件下载中...请稍候",1000 * 60);
    const response = await request.request<Blob>(config);
    const dataType = response.data.type;
    if (!dataType.includes('application/octet-stream')) {
      ElMessage.error('下载失败！');
      return;
    }
    // 解析文件名:attachment;filename=%E7%94%A8%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx
    const disposition = response.headers['content-disposition'] || '';
    let filename = 'download';
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    const quotedMatch = disposition.match(/filename="([^"]+)"/i);
    const unquotedMatch = disposition.match(/filename=([^;]+)/i);

    if (utf8Match?.[1]) {
      filename = decodeURIComponent(utf8Match[1]);
    } else if (quotedMatch?.[1]) {
      filename = quotedMatch[1];
    } else if (unquotedMatch?.[1]) {
      // 防止 filename=a.xlsx;foo=bar 情况
      filename = decodeURIComponent(unquotedMatch[1].trim().replace(/['"]/g, ''));
    }

    // 构造并点击下载链接
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    // 清理
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } catch (err: any) {
    console.error(err);
    ElMessage.error('下载失败！');
  }finally {
    closeLoading();
  }
}
