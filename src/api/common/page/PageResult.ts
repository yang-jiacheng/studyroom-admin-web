export interface PageResult<T> {
  /**
   * 当前页码
   */
  current: number;

  /**
   * 每页显示的信息条数
   */
  size: number;

  /**
   * 总的信息条数
   */
  total: number;

  /**
   * 总的页数
   */
  pages: number;

  /**
   * 数据集合
   */
  records: T[] | null;
}
