export interface CatalogTreeVO {
  id: string;
  parentId: string;
  level: number;
  name: string;
  sort: number;
  children: CatalogTreeVO[];
}

export interface Classify {
  id: number | null;
  name: string;              // 名称
  description: string;       // 描述
  iconPath: string | null;          // 头像地址
  coverPath: string | null;         // 封面地址
  personCount: number;       // 容纳人数
  useType: number;           // 是否开放使用 (0 否 1 是)
  sort: number;              // 排序
}

export interface Catalog {
  id: number | null;
  classifyId: number | null;        // 图书馆ID
  parentId: number;          // 父ID
  level: number;             // 层级
  name: string;              // 节点名称
  personCount: number;       // 容纳人数
  sort: number;              // 排序
}

