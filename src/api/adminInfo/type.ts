export interface AdminInfo {
  /** 管理员自增主键 */
  id: number;
  /** 手机号 */
  phone: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  name: string;
  /** 密码 */
  password: string;
  /** 头像地址 */
  profilePath: string;
  /** 修改时间（格式: yyyy-MM-dd HH:mm:ss，通常是字符串类型） */
  updateTime: string | null;
  /** 创建时间（格式: yyyy-MM-dd HH:mm:ss，通常是字符串类型） */
  createTime: string;
  // 1正常 2停用
  status: number;
}

export interface AdminInfoDetail {
  adminInfo: AdminInfo;
  roles: number[];
}
