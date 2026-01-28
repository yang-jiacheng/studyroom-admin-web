export enum PermissionType {
  Directory = 1,
  Menu = 2,
  Button = 3
}

export interface PermissionTreeVO {
  /** 节点ID */
  id: string;
  /** 父节点ID */
  parentId?: string;
  /** 权限类型：1目录 2菜单 3按钮 */
  type: PermissionType;
  /** 权限显示名称 */
  title: string;
  /** 权限标识字符串 */
  permissionStr?: string;
  /** 前端路由元数据 */
  uiMeta?: UiMeta;
  /** 排序权重 */
  sort: number;
  createTime?: string;
  /** 子节点列表 */
  children?: PermissionTreeVO[];
}
export interface UiMeta {
  /** 路由名称（对应vue-router的name） */
  name: string;
  /** 路由路径（对应vue-router的path）*/
  path: string;
  /** 路由组件路径（对应vue-router的component）*/
  component?: string;
  icon?: string;
}
export interface Role{
  id: number;
  name: string;
  description: string;
  createTime: string;
}
export interface RoleDetail {
  role: Role;
  allPermission: PermissionTreeVO[];
  rolePermission: number[];
}
