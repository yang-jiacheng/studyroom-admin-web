import  axios from 'axios';
import { TokenKey,getAccessToken,getRefreshToken,removeToken,setToken } from './auth.ts';
import { logout,refresh } from "@/api/auth/index.ts";

// 全局请求头
export const globalHeaders = () => {
  return {
    [TokenKey]: getAccessToken()
  };
};

//默认配置
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

//创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_NODE_ENV === 'development'
    ? import.meta.env.VITE_APP_PROXY_API
    : import.meta.env.VITE_SERVE,
  timeout: 30000,
  withCredentials: true
});

//请求拦截器
request.interceptors.request.use(config => {
  // 让每个请求携带token
  const token = getAccessToken();
  if (token) {
    config.headers[TokenKey] = token;
  }
  // 如果是文件下载请求，设置 responseType 为 'blob'
  if (config.responseType === 'blob') {
    config.headers['Accept'] = 'application/octet-stream';
  }
  return config;
});

// --- 全局状态，用于处理Token刷新逻辑 ---
// 标记是否正在刷新Token
let isRefreshing = false;
// 存储在刷新期间需要重新发送的请求
type Subscriber = (token: string | null) => void;
let subscribers: Subscriber[] = [];

/**
 * 将请求推入等待队列
 */
const subscribeTokenRefresh = (callback: Subscriber) => {
  subscribers.push(callback);
};

/**
 * 刷新成功后，通知所有等待者新 Token
 */
const onRefreshed = (token: string) => {
  subscribers.forEach(callback => callback(token));
  subscribers = [];
};

/**
 * 刷新失败，通知所有等待者任务失败 (token为null)
 */
const onRefreshFailed = () => {
  subscribers.forEach(callback => callback(null));
  subscribers = [];
};

// 跳转登录页函数
const redirectToLogin = () => {
  onRefreshFailed();
  logout().finally(() => {
    removeToken();
    location.href = `${import.meta.env.VITE_APP_CONTEXT_PATH}#/login`;
  });
};

//响应拦截器
request.interceptors.response.use((response) => {

  // 检查是否是文件下载请求，以及响应数据是否为 Blob 类型
  if (response.config.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
    return response; // 直接返回响应，包含 Blob 数据
  }

  const code = response.data.code;
  const msg = response.data.msg;
  if (code === 0){
    return Promise.resolve(response.data);
  }else if (code === 1000){
    // 登录失效
    ElMessage.error(msg);
    redirectToLogin();
    return Promise.reject(msg);

  } else if (code === 401){
    // AccessToken 失效,使用RefreshToken获取新的AccessToken
    const originalRequest = response.config;
    // 如果当前没有在刷新，则发起刷新请求
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken){
        // 无RefreshToken，跳转登录页面
        redirectToLogin();
        return Promise.reject("没有 refreshToken");
      }

      return refresh().then((res) => {
        if (res.code === 0) {
          const tokenPair = res.result;
          setToken(tokenPair);
          onRefreshed(tokenPair.accessToken);
          // retry 原请求并返回
          originalRequest.headers![TokenKey] = tokenPair.accessToken;
          return request(originalRequest);
        } else {
          // refresh API 返回业务失败，例如 refreshToken 也无效了
          throw new Error(res.msg || "会话刷新失败");
        }
      }).catch((err) => {
        redirectToLogin();
        return Promise.reject(err);
      }).finally(() => {
        isRefreshing = false;
      });

    }

    // 正在刷新中，挂起当前请求
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(token => {
        if (token) {
          // 成功后，更新 header，重发请求
          originalRequest.headers![TokenKey] = token;
          resolve(request(originalRequest));
        } else {
          // 刷新失败
          reject('token刷新失败，未重新发起请求');
        }
      });
    });

  } else {
    ElMessage.error(msg);
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
