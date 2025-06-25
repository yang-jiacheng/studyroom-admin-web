export interface PermissionTreeVO {
  /** 节点ID */
  id: number;
  /** 父节点ID */
  parentId?: number;
  /** 层级深度 */
  level: number;
  /** 权限显示名称 */
  title: string;
  /** 权限标识字符串 */
  permissionStr?: string;
  /** 路由名称（对应vue-router的name） */
  name: string;
  /** 路由路径（对应vue-router的path）*/
  path: string;
  /** 路由组件路径（对应vue-router的component）*/
  component?: string;
  createTime?: string;
  /** 排序权重 */
  sort: number;
  icon?: string;
  /** 子节点列表 */
  children?: PermissionTreeVO[];
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
