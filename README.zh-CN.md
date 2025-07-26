## **studyroom-admin-web**

**[English](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/README.md) | 中文**

### 1. 简介

"团团云自习" 后台管理系统是一个基于Vue3的现代化后台管理平台，为云自习室应用提供全面的后台管理功能。系统采用最新的前端技术栈，具备完善的权限管理、用户管理、数据统计等核心功能。

#### 🚀 主要特性

- **🔐 完善的权限系统**：基于RBAC的动态权限控制，支持菜单权限和操作权限
- **⚡ 高性能**：采用Vue3 + Vite构建，支持按需加载和懒加载
- **🎨 现代化UI**：基于Element Plus设计，界面美观易用
- **🔄 实时数据**：支持数据实时更新和状态同步
- **📊 数据可视化**：丰富的图表和统计功能
- **🛡️ 安全可靠**：完整的认证授权机制，保障数据安全

#### 🎯 核心功能模块

- **用户管理**：用户信息管理、状态控制、权限分配
- **角色管理**：角色创建、权限配置、用户角色绑定
- **菜单管理**：动态菜单配置、权限控制、层级管理
- **学习记录管理**：学习数据统计、记录查询、数据分析
- **业务配置**：系统参数配置、业务规则设置
- **反馈管理**：用户反馈处理、问题跟踪
- **版本管理**：应用版本发布、更新管理
- **对象存储管理**：文件上传、存储管理、CDN配置


### 2. 技术栈

#### 🔧 开发环境要求

- **Node.js** 18.20.8+
- **npm**

#### 📦 核心技术

- **[Vue3](https://github.com/vuejs/core)** - 渐进式JavaScript框架，使用Composition API
- **[TypeScript](https://github.com/microsoft/TypeScript)** - 类型安全的JavaScript超集
- **[Vite](https://github.com/vitejs/vite)** - 极速的前端构建工具
- **[Pinia](https://github.com/vuejs/pinia)** - Vue的现代状态管理库
- **[Element-plus](https://github.com/element-plus/element-plus)** - 基于Vue3的组件库

#### 🛠️ 工程化工具

- **Vue Router 4** - 官方路由管理器，支持动态路由
- **Axios** - HTTP客户端，用于API请求
- **ESLint** - 代码质量检查工具
- **Sass/SCSS** - CSS预处理器
- **unplugin-auto-import** - 自动导入插件
- **unplugin-vue-components** - 组件自动导入
- **@iconify/vue** - 图标库集成


### 3. 结构

```txt
studyroom-admin-web
├── plugins             // Vite 插件，第三方插件
├── public              // 静态资源 (如logo.png) 不打包
├── src                 // 项目源目录
│   ├── api                // API 接口定义，Axios 封装的请求模块
│   ├── assets             // 静态资源文件，如图像、字体、SVG
│   ├── components         // 可重复使用 Vue 组件
│   ├── hooks              // 自定义 Hook
│   ├── router             // Vue Router 路由配置
│   ├── store              // Pinia 状态管理模块
│   ├── styles             // 样式文件, CSS, SCSS, 等.
│   ├── types              // 全局 TypeScript 类型 定义
│   ├── utils              // 通用工具函数
│   └── views              // 页面组件
│   ├── App.vue            // 根组件
│   └── main.ts            // 入口文件
├── .env.development    // 开发环境变量
├── .env.production     // 生产环境变量
├── env.d.ts            // Vite 环境变量的 TypeScript 声明文件
├── eslint.config.ts    // ESLint 配置
├── index.html          // 入口 HTML 文件
├── package.json        // 依赖 配置
├── tsconfig.json       // TypeScript 编译器配置
└── vite.config.ts      // Vite 构建工具配置
```

### 4. 快速开始

#### 📋 环境准备

确保你的开发环境满足以下要求：

```bash
# 检查Node.js版本
node --version  # 需要 >= 18.20.8

# 检查npm版本
npm --version   # 需要 >= 9.0.0
```

#### ⚡ 安装与运行

```bash
# 1. 安装依赖
npm i --verbose
# 2. 启动开发服务器
npm run dev
# 3. 构建生产版本
npm run build
```

#### 🌐 环境配置

项目支持多环境配置，在项目根目录创建对应的环境文件：

```bash
# 开发环境配置
.env.development
# 生产环境配置  
.env.production
```

### 5. 核心特性详解

#### 🔐 权限系统

系统采用基于RBAC（Role-Based Access Control）的权限模型：

- **动态路由**：根据用户权限动态生成菜单和路由
- **权限控制**：支持页面级和操作级权限控制
- **角色管理**：灵活的角色创建和权限分配
- **权限缓存**：使用Pinia进行权限状态管理

#### 📱 响应式布局

- **自适应侧边栏**：支持展开/收起，适配不同屏幕尺寸
- **移动端优化**：针对移动设备的交互优化
- **主题切换**：支持明/暗主题模式切换

#### 🔄 状态管理

使用Pinia进行全局状态管理

#### 📊 数据处理

- **请求拦截**：统一的API请求处理和错误处理
- **Loading状态**：全局Loading管理
- **数据缓存**：合理的数据缓存策略

### 6. 预览

<table>
<tr>
<td>
<img src="https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/picture/01.png">
</td>
<td>
<img src="https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/picture/02.png">
</td>
</tr>
</table>

### 7. 项目地址

#### 🔗 相关仓库

- **🖥️ 服务端:** https://github.com/yang-jiacheng/selfstudy-server
- **🌐 后台管理系统:** https://github.com/yang-jiacheng/studyroom-admin-web  
- **📱 Android 客户端:** https://github.com/yang-jiacheng/StudyRoom

#### 🏗️ 项目架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         云自习生态系统                        │
├─────────────────────────────────────────────────────────────┤
│  📱 Android App          🌐 Admin Web         🖥️ Backend    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   用户端应用     │    │   管理后台       │    │   API服务器      │ │
│  │                │    │                │    │                │ │
│  │ • 自习室预约    │◄──►│ • 用户管理       │◄──►│ • Spring Boot   │ │
│  │ • 学习记录      │    │ • 数据统计       │    │ • MySQL数据库   │ │
│  │ • 个人中心      │    │ • 系统配置       │    │ • Redis缓存     │ │
│  │ • 消息通知      │    │ • 权限控制       │    │ • OSS存储       │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 8. 演示地址

#### 🌐 在线体验

**后台管理系统：** http://115.29.185.30/studyRoomAdminWeb/#/

**演示账号：**
- 管理员：`yjc123` / `123456`
- 其他角色：`xiuyu123` / `123456`

**Android 客户端下载：** https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/android/studyroom/apk/studyroom-1.0.6-7-0125.apk

**移动端演示账号：** `17508660924` / `123456`

> ⚠️ **注意：** 由于阿里云SMS短信服务限制，个人开发者无法申请短信签名，请使用密码登录方式

#### 📱 功能预览

体验时可以尝试以下功能：

- ✅ 用户登录与权限切换
- ✅ 动态菜单和路由
- ✅ 用户管理和角色分配  
- ✅ 学习记录查询和统计
- ✅ 系统配置和参数管理
- ✅ OSS文件上传和存储管理
- ✅ 响应式布局适配

### 9. 部署指南

#### 🚀 生产环境部署

```bash
# 1. 构建生产版本
npm run build

# 2. 构建产物在 dist 目录
ls dist/

# 3. 部署到静态服务器（如Nginx）
# 将 dist 目录内容复制到服务器web根目录
```

#### ⚙️ Nginx配置示例

```nginx
location /studyRoomAdminWeb {
    root /java/;    
    index index.html;
    try_files $uri $uri/ /index.html?$args;
}
```

### 联系我

#### 👨‍💻 作者信息

**杨嘉诚** - 全栈开发工程师

**联系方式：**
- 📧 **邮箱：** yjc1529425632@gmail.com
- 💬 **微信：** crushed_whiskey
- 🐙 **GitHub：** https://github.com/yang-jiacheng

**关于作者：**

- 💼 专注于全栈开发和系统架构
- 🌟 热爱开源项目和技术分享
- 🎯 致力于构建优雅高效的软件系统

#### 💡 反馈与建议

如果您有任何问题、建议或反馈，欢迎通过以下方式联系：

1. **GitHub Issues** - 报告Bug或功能请求
2. **邮件联系** - 技术交流和合作
3. **微信咨询** - 快速响应和技术支持

#### 🙏 致谢

特别感谢以下开源项目：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue3组件库
- [Vite](https://vitejs.dev/) - 极速的构建工具

### License

studyroom-admin-web 是根据Apache许可证2.0版获得许可的。有关完整的许可证文本，请参阅[LICENSE](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/LICENSE)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我一个Star！⭐**

**📢 欢迎分享给更多需要的朋友！📢**

</div>

