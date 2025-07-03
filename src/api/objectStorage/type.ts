export interface ObjectStorage {
  id: number;                // 主键ID
  fileName: string;          // 原始文件名
  fileSize: number;          // 文件大小（单位：MB）
  downloadUrl: string;       // 下载地址
  creatorId: number;         // 创建人ID
  creatorName: string;       // 创建人姓名
  createTime: string;        // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
}
