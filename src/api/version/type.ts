export interface Version {
  id: number;                // 主键ID
  versionCode: number;       // 版本号
  versionName: string;       // 版本名称
  downloadUrl: string;       // 下载地址
  status: number;            // 是否强制更新 (1 是，0 否)
  checkUpdate: number;       // 是否检测更新 (1 是，0 否)
  updateTime: string;        // 更新时间 (格式: yyyy-MM-dd HH:mm:ss)
}
