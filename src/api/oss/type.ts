export interface StsTokenResp {
  credentials: {
    securityToken: string,
    accessKeyId: string,
    accessKeySecret: string,
    expiration: string
  },
  //压缩图片门槛 单位字节
  compressionSize: number,
  //oss文件访问域名 https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com
  ossPath: string
}
