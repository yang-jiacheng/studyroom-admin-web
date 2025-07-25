## **studyroom-admin-web**

**English | [中文](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/README.zh-CN.md)**

### 1. Introduction

"TuanTuan Cloud Study Room" background management system is a modern backend management platform based on Vue3, providing comprehensive backend management functions for cloud study room applications. The system adopts the latest frontend technology stack and has complete permission management, user management, data statistics and other core functions.

#### 🚀 Main Features

- **🔐 Complete Permission System**: Dynamic permission control based on RBAC, supporting menu permissions and operation permissions
- **⚡ High Performance**: Built with Vue3 + Vite, supporting on-demand loading and lazy loading
- **🎨 Modern UI**: Based on Element Plus design, beautiful and easy-to-use interface
- **🔄 Real-time Data**: Support for real-time data updates and state synchronization
- **📊 Data Visualization**: Rich charts and statistical functions
- **🛡️ Security and Reliability**: Complete authentication and authorization mechanisms to ensure data security

#### 🎯 Core Function Modules

- **User Management**: User information management, status control, permission assignment
- **Role Management**: Role creation, permission configuration, user role binding
- **Menu Management**: Dynamic menu configuration, permission control, hierarchical management
- **Study Record Management**: Learning data statistics, record query, data analysis
- **Business Configuration**: System parameter configuration, business rule settings
- **Feedback Management**: User feedback processing, problem tracking
- **Version Management**: Application version release, update management
- **Object Storage Management**: File upload, storage management, CDN configuration


### 2. Technology Stack

#### 🔧 Development Environment Requirements

- **Node.js** 18.20.8+
- **npm**

#### 📦 Core Technologies

- **[Vue3](https://github.com/vuejs/core)** - Progressive JavaScript framework using Composition API
- **[TypeScript](https://github.com/microsoft/TypeScript)** - Type-safe JavaScript superset
- **[Vite](https://github.com/vitejs/vite)** - Extremely fast frontend build tool
- **[Pinia](https://github.com/vuejs/pinia)** - Modern state management library for Vue
- **[Element-plus](https://github.com/element-plus/element-plus)** - Vue3-based component library

#### 🛠️ Engineering Tools

- **Vue Router 4** - Official router manager supporting dynamic routing
- **Axios** - HTTP client for API requests
- **ESLint** - Code quality checking tool
- **Sass/SCSS** - CSS preprocessor
- **unplugin-auto-import** - Auto import plugin
- **unplugin-vue-components** - Component auto import
- **@iconify/vue** - Icon library integration

#### 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend App  │────│   Backend API   │────│   Database      │
│  (Vue3 + TS)   │    │  (Spring Boot)  │    │   (MySQL)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN Service   │    │   Object Storage│    │   Cache Service │
│  (Static Assets)│    │   (File Storage)│    │   (Redis)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

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

### 4. Quick Start

#### 📋 Environment Preparation

Ensure your development environment meets the following requirements:

```bash
# Check Node.js version
node --version  # Requires >= 18.20.8

# Check npm version
npm --version   # Requires >= 9.0.0
```

#### ⚡ Installation and Running

```bash
# 1. Install dependencies
npm i --verbose
# 2. Start development server
npm run dev
# 3. Build production version
npm run build
```

#### 🌐 Environment Configuration

The project supports multi-environment configuration, create corresponding environment files in the project root directory:

```bash
# Development environment configuration
.env.development

# Production environment configuration  
.env.production
```

### 5. Core Features Details

#### 🔐 Permission System

The system adopts a permission model based on RBAC (Role-Based Access Control):

- **Dynamic Routing**: Dynamically generate menus and routes based on user permissions
- **Permission Control**: Support page-level and operation-level permission control
- **Role Management**: Flexible role creation and permission assignment
- **Permission Caching**: Use Pinia for permission state management

#### 📱 Responsive Layout

- **Adaptive Sidebar**: Support expand/collapse, adapt to different screen sizes
- **Mobile Optimization**: Interaction optimization for mobile devices
- **Theme Switching**: Support light/dark theme mode switching

#### 🔄 State Management

Use Pinia for global state management

#### 📊 Data Processing

- **Request Interception**: Unified API request processing and error handling
- **Loading State**: Global Loading management
- **Data Caching**: Reasonable data caching strategy

### 6. Preview

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

### 7. Project Link

#### 🔗 Related Repositories

- **🖥️ Server:** https://github.com/yang-jiacheng/selfstudy-server
- **🌐 Background Management:** https://github.com/yang-jiacheng/studyroom-admin-web  
- **📱 Android Client:** https://github.com/yang-jiacheng/StudyRoom

#### 🏗️ Project Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloud Study Room Ecosystem               │
├─────────────────────────────────────────────────────────────┤
│  📱 Android App          🌐 Admin Web         🖥️ Backend    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   User App      │    │   Admin Panel   │    │   API Server    │ │
│  │                │    │                │    │                │ │
│  │ • Room Booking  │◄──►│ • User Mgmt     │◄──►│ • Spring Boot   │ │
│  │ • Study Records │    │ • Data Stats    │    │ • MySQL DB      │ │
│  │ • Profile       │    │ • System Config │    │ • Redis Cache   │ │
│  │ • Notifications │    │ • Permission    │    │ • OSS Storage   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 8. Demo Link

#### 🌐 Online Experience

**Admin Backend:** http://115.29.185.30/studyRoomAdminWeb/#/

**Demo Accounts:**
- Administrator: `yjc123` / `123456`
- Other Role: `xiuyu123` / `123456`

**Android Client Download:** https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/android/studyroom/apk/studyroom-1.0.6-7-0125.apk

**Mobile Demo Account:** `17508660924` / `123456`

> ⚠️ **Note:** Due to Aliyun SMS service restrictions, individual developers cannot apply for SMS signatures, please use password login

#### 📱 Feature Preview

You can try the following features during your experience:

- ✅ User login and permission switching
- ✅ Dynamic menus and routing
- ✅ User management and role assignment  
- ✅ Study record query and statistics
- ✅ System configuration and parameter management
- ✅ OSS file upload and storage management
- ✅ Responsive layout adaptation

### 9. Deployment Guide

#### 🚀 Production Deployment

```bash
# 1. Build production version
npm run build

# 2. Build artifacts in dist directory
ls dist/

# 3. Deploy to static server (such as Nginx)
# Copy dist directory contents to server web root directory
```

#### ⚙️ Nginx Configuration Example

```nginx
location /studyRoomAdminWeb {
    root /java/;    
    index index.html;
    try_files $uri $uri/ /index.html?$args;
}
```

### Contact Me

#### 👨‍💻 Author Information

**Yang Jiacheng** - Full Stack Developer

**Contact Information:**
- 📧 **Email:** yjc1529425632@gmail.com
- 💬 **WeChat:** crushed_whiskey
- 🐙 **GitHub:** https://github.com/yang-jiacheng

**About the Author:**

- 💼 Focus on full-stack development and system architecture
- 🌟 Love open source projects and technology sharing
- 🎯 Committed to building elegant and efficient software systems

#### 💡 Feedback and Suggestions

If you have any questions, suggestions or feedback, please feel free to contact through the following ways:

1. **GitHub Issues** - Report bugs or feature requests
2. **Email Contact** - Technical exchange and cooperation
3. **WeChat Consultation** - Quick response and technical support

#### 🙏 Acknowledgments

Special thanks to the following open source projects:
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Element Plus](https://element-plus.org/) - Vue3 component library
- [Vite](https://vitejs.dev/) - Extremely fast build tool

### License

studyroom-admin-web is licensed under the Apache License, Version 2.0. See [LICENSE](https://github.com/yang-jiacheng/studyroom-admin-web/blob/master/LICENSE) for the full license text.

---

<div style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
<p><strong>⭐ If this project helps you, please give me a Star! ⭐</strong></p>
<p><strong>📢 Welcome to share with more friends in need! 📢</strong></p>
</div>