## **studyroom-admin-web**

**English | [中文](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/README.zh-CN.md)**

### 1. Introduction

"TuanTuan Cloud Study Room" background management system


### 2. Technology Stack

Node.js 18.20.8+

- [Vue3](https://github.com/vuejs/core)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [Vite](https://github.com/vitejs/vite)
- [Pinia](https://github.com/vuejs/pinia)
- [Element-plus](https://github.com/element-plus/element-plus)

### 3. Structure

```txt
studyroom-admin-web
├── plugins             // Vite plug-ins, third-party plug-ins
├── public              // Static resources, such as logo.png, are not packaged
├── src                 // Project source directory
│   ├── api                // API interface definition, request module encapsulated by Axios
│   ├── assets             // Static resource files, such as images, fonts, SVG
│   ├── components         // Reusable Vue Components
│   ├── hooks              // Custom Hook
│   ├── router             // Vue Router Routing Configuration
│   ├── store              // Pinia State Management Module
│   ├── styles             // Style files, CSS, SCSS, etc.
│   ├── types              // Global TypeScript Type Definition
│   ├── utils              // General Tool Functions
│   └── views              // Page Components
│   ├── App.vue            // Root Component
│   └── main.ts            // Entry file
├── .env.development    // Development Environment Variables
├── .env.production     // Production environment variables
├── env.d.ts            // TypeScript declaration file for Vite environment variables
├── eslint.config.ts    // ESLint Configuration
├── index.html          // Entry HTML file
├── package.json        // Dependency Configuration
├── tsconfig.json       // TypeScript Compiler Configuration
└── vite.config.ts      // Vite Configuration
```

### 4. Preview

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

### 5. Project Link

- **Server:** https://github.com/yang-jiacheng/selfstudy-server
- **Background management:** https://github.com/yang-jiacheng/studyroom-admin-web
- **Android:** https://github.com/yang-jiacheng/StudyRoom


### 6. Demo Link

Admin Backend：http://115.29.185.30/studyRoomAdminWeb/#/

Demo account: administrator：yjc123/123456; Other role：xiuyu123/123456

Android Client: https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/android/studyroom/apk/studyroom-1.0.6-7-0125.apk

Demo account: 17508660924/123456

Due to the restriction of Aliyun SMS service, individual developers cannot apply for SMS signature, so please use the password to log in.

### 7. Project Setup

```sh
## Install dependencies
npm i --verbose
## Start
npm run dev
## Packing
npm run build
```

### Contact Me
For any inquiries, please contact: jiacheng yang

WeChat：crushed_whiskey

Email：yjc1529425632@gmail.com

### License

studyroom-admin-web is licensed under the Apache License, Version 2.0. See [LICENSE](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/LICENSE) for the full license text.
