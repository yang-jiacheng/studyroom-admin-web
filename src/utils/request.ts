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
  // 如果是文件下载请求，设置 responseType 为 'blob'
  if (config.responseType === 'blob') {
    config.headers['Accept'] = 'application/octet-stream';
  }
  return config;
});

//响应拦截器
request.interceptors.response.use((response) => {

  // 检查是否是文件下载请求，以及响应数据是否为 Blob 类型
  if (response.config.responseType === 'blob') {
    return response; // 直接返回响应，包含 Blob 数据
  }

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
  let message = error.message || '数据异常';

  const status = error.response?.status;
  // 状态码错误映射
  const statusMessageMap: Record<number, string> = {
    502: '后端服务连接失败',
    500: '服务器响应异常',
    404: '请求地址不存在',
    403: '无权限访问资源'
  };

  if (status && statusMessageMap[status]) {
    message = statusMessageMap[status];
  } else if (message === 'Network Error') {
    message = '后端接口连接异常';
  } else if (message.toLowerCase().includes('timeout')) {
    message = '系统接口请求超时';
  }

  ElMessage.error(message);
  return Promise.reject(error);
});
export default request;
