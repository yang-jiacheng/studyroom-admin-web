export interface User {
  id: number; // 用户ID（可选，自动生成）

  password: string; // 密码

  name: string; // 姓名

  phone: string; // 手机号

  profilePath: string; // 头像地址

  coverPath: string; // 个人资料背景图

  gender: string; // 性别

  createTime: string; // 注册时间

  updateTime: string; // 修改时间

  registType: number; // 注册类型：1=用户注册，2=后台添加

  address: string; // 常驻地址
}

export interface UserEditDTO {
  id: number | null; // 用户ID（可选，自动生成）
  password: string  | null; // 密码
  name: string; // 姓名
  phone: string; // 手机号
  profilePath: string | null; // 头像地址
  coverPath: string | null; // 个人资料背景图
  gender: string ; // 性别
  address: string | null; // 常驻地址
}
