export interface Feedback {
  id: number;
  userId: number;            // 用户ID
  name: string;              // 用户姓名
  phone: string;             // 用户手机号
  content: string;           // 反馈内容
  pic: string;               // 反馈图片
  reply: string;             // 回复内容
  adminName: string;         // 回复人姓名
  adminId: number;           // 回复人ID
  createTime: string;        // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  replyTime: string;         // 回复时间 (格式: yyyy-MM-dd HH:mm:ss)
  status: number;            // 用户是否可见 (1 可见，2 不可见)
  replyStatus: number;       // 回复状态 (0 未回复，1 已回复)
}
