import '@/styles/main.css';

import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import permissionDirective from '@/directives/permission.ts';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.directive('permission', permissionDirective);

app.mount('#app');
