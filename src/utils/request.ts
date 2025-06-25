import  axios from 'axios';
import { TokenKey,getToken,removeToken } from './auth.ts';
import { logout } from "@/api/auth/index.ts";
// 全局请求头
export const globalHeaders = () => {
  return {
    [TokenKey]: getToken()
  };
};

//默认配置
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

//创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_PROXY_API,
  timeout: 30000,
  withCredentials: true
});

//请求拦截器
request.interceptors.request.use(config => {
  // 让每个请求携带token
  const token = getToken();
  if (token) {
    config.headers[TokenKey] = token;
  }
  return config;
});

//响应拦截器
request.interceptors.response.use((response) => {
  const code = response.data.code;
  const msg = response.data.msg;
  if (code === 0){
    return Promise.resolve(response.data);
  }else if (code === 1000){
    // 登录失效
    ElMessage({
      type: 'error',
      message: msg,
      duration: 2500
    });
    // 清除token
    logout().then(() => {
      removeToken();
    });
    // 跳转登录页面
    location.href = import.meta.env.VITE_APP_CONTEXT_PATH + '#/login';
    return Promise.reject(msg);
  }else {
    ElMessage({
      type: 'error',
      message: msg,
      duration: 2500
    });
    return Promise.reject(msg);
  }

}, (error) => {
  let message = error.message;

  // 如果是代理第一次超时/连接被拒绝返回的 502
  if (error.response?.status === 502) {
    message = '后端服务连接失败';
  }
  else if (message === 'Network Error') {
    message = '后端接口连接异常';
  }
  else if (message.includes('timeout')) {
    message = '系统接口请求超时';
  }
  else if (error.response?.status === 500) {
    message = '服务器响应异常';
  }

  ElMessage({ type: 'error', message, duration: 2500 });
  return Promise.reject(error);
});
export default request;
