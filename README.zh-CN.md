## **studyroom-admin-web**

**[English](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/README.md) | 中文**

### 1. 简介

"团团云自习" 后台管理系统


### 2. 技术栈

Node.js 18.20.8+

- [Vue3](https://github.com/vuejs/core)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [Vite](https://github.com/vitejs/vite)
- [Pinia](https://github.com/vuejs/pinia)
- [Element-plus](https://github.com/element-plus/element-plus)

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

### 4. 预览

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

### 5. 项目地址

- **服务端:** https://github.com/yang-jiacheng/selfstudy-server
- **后台管理系统:** https://github.com/yang-jiacheng/studyroom-admin-web
- **Android 客户端:** https://github.com/yang-jiacheng/StudyRoom


### 6. 演示地址

后台管理系统：http://115.29.185.30/studyRoomAdminWeb/#/

演示账号：管理员：yjc123/123456；其他角色：xiuyu123/123456

Android 客户端：https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/android/studyroom/apk/studyroom-1.0.6-7-0125.apk

演示账号：17508660924/123456

由于阿里云SMS短信服务限制，个人开发者无法申请短信签名，所以请使用密码登录

### 7. 项目设置

```sh
## 安装依赖
npm i --verbose
## 启动
npm run dev
## 打包
npm run build
```

### 联系我

如有任何问题请联系：杨嘉诚

微信号：crushed_whiskey

邮箱：yjc1529425632@gmail.com

### License

studyroom-admin-web 是根据Apache许可证2.0版获得许可的。有关完整的许可证文本，请参阅[LICENSE](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/LICENSE)
