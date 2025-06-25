import type { ComponentInternalInstance as ComponentInstance, PropType as VuePropType } from 'vue';

declare global {

  const tinymce: any;
  const tinyMCE: any;

  /** vue Instance */
  type ComponentInternalInstance = ComponentInstance;
  /**vue */
  type PropType<T> = VuePropType<T>;

  interface UploadOption {
    /** 设置上传的请求头部 */
    headers: { [key: string]: any };
    /** 上传的地址 */
    url: string;
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string;
    /**
     * 是否显示
     */
    visible: boolean;
  }

  /**
   * 导入属性
   */
  interface ImportOption extends UploadOption {
    /** 是否显示弹出层 */
    open: boolean;
    /** 弹出层标题 */
    title: string;
    /** 是否禁用上传 */
    isUploading: boolean;

    /** 其他参数 */
    [key: string]: any;
  }

  /**
   * 分页数据
   * T : 表单数据
   * D : 查询参数
   */
  interface PageResult<T, D> {
    form: T;
    queryParams: D;
    rules: ElFormRules;
  }
  /**
   * 分页查询参数
   */
  interface PageQuery {
    page: number;
    limit: number;
  }
}
export {};
