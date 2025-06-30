import type { ComponentInternalInstance as ComponentInstance, PropType as VuePropType } from 'vue';

declare global {
  //tinymce 富文本编辑器
  const tinymce: any;
  const tinyMCE: any;

  const OSS: any;

  /** vue Instance */
  type ComponentInternalInstance = ComponentInstance;
  /**vue */
  type PropType<T> = VuePropType<T>;

  /**
   * 导入属性
   */
  interface OssUploadOption {
    /** 设置上传的请求头部 */
    headers?: { [key: string]: any };
    /** 上传的文件类型 */
    accept: string[];
    //大小限制 MB
    maxSizeMb: number;
    //分片大小 字节
    partSize: number;
    //设置并发上传的分片数量
    parallel: number;
    //上传进度回调
    onProgress?: (progress: number) => void;
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
    /**
     * 模板文件路径
     */
    templateUrl?: string;
    /**
     * 请求地址
     */
    action?: string;
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
