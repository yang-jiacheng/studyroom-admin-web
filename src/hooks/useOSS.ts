import { loadScripts } from "@/utils/loadHttpSourse.ts";
import { getStsToken } from "@/api/oss";
import { compressImageFile, generateFilePath } from "@/utils/fileUtil.ts";

const defaultOssUploadOption: OssUploadOption = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  accept: [],
  maxSizeMb: 5,// 5MB
  partSize: 1 * 1024 * 1024, // 1MB
  parallel: 5
};

export default function () {
  const compressionSize = ref(0);

  // 获取OSS上传凭证
  async function getOssStaToken () {
    const { result } = await getStsToken();
    if (result) {
      compressionSize.value = result.compressionSize;
      return result.credentials;
    }
    throw new Error("获取OSS上传凭证失败");
  }

  // 初始化OSS客户端
  async function initOssClient () {
    try {
      const stsResponse = await getOssStaToken(); // 获取临时凭证
      return new OSS({
        authorizationV4: true,
        region: 'oss-cn-hangzhou', // OSS区域
        accessKeyId: stsResponse.accessKeyId, // 临时凭证AccessKeyId
        accessKeySecret: stsResponse.accessKeySecret, // 临时凭证AccessKeySecret
        stsToken: stsResponse.securityToken, // 临时凭证SecurityToken
        secure: true, // 使用HTTPS
        refreshSTSToken: async () => {
          const stsResponse = await getOssStaToken(); // 获取新凭证
          return {
            accessKeyId: stsResponse.accessKeyId,
            accessKeySecret: stsResponse.accessKeySecret,
            stsToken: stsResponse.securityToken
          };
        },
        refreshSTSTokenInterval: 3500000, // 刷新间隔时间，单位毫秒
        bucket: 'selfstudy-server' // 存储桶名称
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * 校验文件类型和大小
   * @param file
   * @param uploadOpt
   */
  function checkFile (file: File,uploadOpt: OssUploadOption = defaultOssUploadOption){
    // 校验文件类型
    if (uploadOpt.accept.length > 0) {
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!uploadOpt.accept.includes(fileExtension)) {
        ElMessage.warning(`只允许上传 ${uploadOpt.accept.join(', ')} 文件！`);
        return false;
      }
    }
    // 校验文件大小
    const maxSize = uploadOpt.maxSizeMb * 1024 * 1024;
    if (file.size > maxSize) {
      ElMessage.warning(`文件大小不能超过 ${uploadOpt.maxSizeMb}MB！`);
      return false;
    }

    return true;
  }

  /**
   * 上传文件到OSS
   * @param file
   * @param uploadOpt
   */
  async function uploadFile (file: File,uploadOpt: OssUploadOption = defaultOssUploadOption) {
    try {
      // 压缩图片 (如果需要)
      let fileToUpload = file;
      if (file.size >= compressionSize.value && file.type.startsWith('image/')) {
        fileToUpload = await compressImageFile(file);
      }

      // 生成文件路径
      const fileName = fileToUpload.name;
      const filePath = generateFilePath(fileName);
      const client = await initOssClient();
      const options = {
        partSize: uploadOpt.partSize,
        parallel: uploadOpt.parallel,
        headers: uploadOpt.headers,
        progress: (p: number) => {
          if (uploadOpt.onProgress) {
            // 更新进度
            const progress = (p * 100).toFixed(2);
            uploadOpt.onProgress(Number(progress));
          }
        }
      };
      const result = await client.multipartUpload(filePath, fileToUpload, options);
      // 拼接最终路径
      let finalPath = result.res.requestUrls[0];
      const queryIndex = finalPath.lastIndexOf("?");
      if (queryIndex > 0) {
        finalPath = finalPath.substring(finalPath.indexOf("aliyuncs.com/") + 12, queryIndex);
      } else {
        finalPath = finalPath.substring(finalPath.indexOf("aliyuncs.com/") + 12);
      }
      return import.meta.env.VITE_APP_OSS_URL + finalPath;
    }catch (error: any) {
      console.error(error);
      ElMessage.error('上传失败！');
      return null;
    }

  }

  onMounted(async () => {
    await loadScripts([
      'https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/static/ali-oss-6.22.0/aliyun-oss-sdk.min.js'
    ]);
  });

  return {
    checkFile,
    uploadFile
  };
}
