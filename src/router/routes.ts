export const constantRoute = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    name: 'home',
    children: [
      {
        path: '/main',
        component: () => import('@/views/home/main.vue'),
        name: 'main',
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login'
  },
  {
    path: '/403',
    component: () => import('@/views/error/403.vue'),
    name: '403'
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    name: '404'
  },
  {
    path: '/exampleDragUploader',
    component: () => import('@/views/examples/DragUploaderExample.vue'),
    name: 'exampleDragUploader'
  }
];
