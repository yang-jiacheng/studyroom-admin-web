---
name: RBAC升级改造
overview: 调整动态路由与侧边栏菜单生成逻辑以适配新的PermissionTreeVO结构，并补齐按钮级权限方案与相关页面适配。
todos:
  - id: update-transform-routes
    content: 更新 transformRoutes 使用 uiMeta 并过滤 type=1/2
    status: completed
  - id: update-sidebar-menu
    content: 左侧菜单按 type 过滤并改为 uiMeta 渲染
    status: completed
  - id: update-menu-manage
    content: 菜单管理页字段迁移到 uiMeta 并补 type
    status: completed
  - id: button-permission-plan
    content: 给出按钮权限存取与用法方案
    status: completed
  - id: scan-other-refs
    content: 检查旧字段引用并做必要适配
    status: completed
---

# RBAC升级改造计划

## 关键结论

- 动态路由与左侧菜单仅基于 `type=1/2`（目录/菜单）生成，`type=3`（按钮）不生成路由、不出现在菜单中（已确认）。
- 路由/菜单的 `name`、`path`、`component`、`icon` 来源从 `PermissionTreeVO` 顶层字段迁移到 `uiMeta`。

## 需要改动的代码点

- 动态路由转换逻辑：`src/router/index.ts`
- 左侧菜单渲染与数据筛选：`src/views/home/index.vue`
- 菜单管理页面的字段读写/展示：`src/views/systemManage/menu/index.vue`（用于适配新的 `uiMeta` 和 `type`）
- 可能新增/补充权限工具与存储结构：`src/store/permission.ts`（用于按钮权限方案落地）

## 实施步骤

1. **更新动态路由转换**

- 在 `transformRoutes` 中使用 `route.uiMeta?.name/path/component/icon` 生成 `RouteRecordRaw`。
- 仅处理 `type=1/2`；跳过 `type=3`。
- 目录节点（`type=1`）无 `component` 时，不绑定组件或仅作为分组节点；菜单节点（`type=2`）需要匹配 `views` 中的组件路径。
- 处理 `uiMeta` 为空或 `component` 缺失的兜底逻辑（避免生成无效路由）。

2. **更新左侧菜单渲染**

- 将菜单来源改为基于 `permissionStore.tree` 过滤后的 `type=1/2` 节点集合。
- 渲染时使用 `uiMeta.path` 作为 `index`/跳转路径，`uiMeta.icon` 作为图标。
- 目录渲染为 `el-sub-menu`，菜单渲染为 `el-menu-item`。

3. **适配菜单管理页面**

- 表格和表单读写改为 `uiMeta` 结构（显示/编辑 `uiMeta.name/path/component/icon`）。
- 补充 `type` 的展示与编辑（目录/菜单/按钮），避免后端新增字段在前端缺失导致的问题。
- 保存时将表单数据组装为后端所需结构（`uiMeta` + 其他字段）。

4. **按钮级权限方案（技术方案输出）**

- 设计权限提取：从 `PermissionTreeVO` 中抽取 `type=3` 的 `permissionStr` 列表。
- 存储与使用：存到 `permissionStore` 中，并提供 `hasPermission(permissionStr)` 方法。
- 使用方式：支持 `v-permission` 指令或组合式函数在按钮上做显示/禁用控制。
- 兼容性：若按钮权限为空，按默认可见策略处理。

5. **补漏检查**

- 搜索使用旧字段 `name/path/component/icon` 的位置，逐一切换到 `uiMeta` 或明确不需要修改。
- 检查是否有根据权限树生成数据的其他逻辑（如面包屑、缓存等）。

## 参考文件

- 路由转换：[`d:/frontEnd/wcode/studyroom-admin-web/src/router/index.ts`](d:/frontEnd/wcode/studyroom-admin-web/src/router/index.ts)
- 左侧菜单：[`d:/frontEnd/wcode/studyroom-admin-web/src/views/home/index.vue`](d:/frontEnd/wcode/studyroom-admin-web/src/views/home/index.vue)
- 菜单管理：[`d:/frontEnd/wcode/studyroom-admin-web/src/views/systemManage/menu/index.vue`](d:/frontEnd/wcode/studyroom-admin-web/src/views/systemManage/menu/index.vue)
- 类型定义：[`d:/frontEnd/wcode/studyroom-admin-web/src/api/permission/type.ts`](d:/frontEnd/wcode/studyroom-admin-web/src/api/permission/type.ts)