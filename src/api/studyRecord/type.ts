export interface StudyRecord {
  /** 主键ID */
  id: number;
  /** 用户ID */
  userId: number;
  /** 图书馆ID */
  classifyId: number;
  /** 节点ID */
  catalogId: number;
  /** 学习标签 */
  tag: string;
  /** 座位号 */
  seat: number;
  /** 计时方式：1 正计时，2 倒计时 */
  timingMode: number;
  /** 设置的自习时长（单位：分钟，仅倒计时） */
  settingDuration: number;
  /** 实际学习时长（单位：分钟） */
  actualDuration: number;
  /** 状态：1 自习中，3 已完成 */
  status: number;
  /** 学习笔记文字内容 */
  noteContent: string;
  /** 学习笔记图片路径 */
  notePath: string;
  /** 是否有笔记：0 否，1 是 */
  noteStatus: number
  /** 开始时间 */
  startTime: string; // ISO 字符串：'yyyy-MM-dd HH:mm:ss'
  /** 用户昵称 */
  name: string;
  /** 用户手机号 */
  phone: string;
  /** 图书馆名称 */
  classifyName: string;
  /** 自习室名称 */
  catalogName: string;
  /** 父级自习室名称 */
  parentCatalogName: string;
}
