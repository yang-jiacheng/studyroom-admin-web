let loading: any = null;
let loadingTimer: number | null = null;

/**
 * 关闭加载组件
 */
const closeLoading = () => {
  if (loading) {
    loading.close();
    loading = null;
  }
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
};

/**
 * 显示加载组件,默认5秒
 * @param {string} text - 加载文本（如“10%”）
 * @param {number} duration - 超时时间（毫秒）
 */
const showLoading = (text: string = '加载中...', duration: number = 5000) => {
  if (loading) loading.close();  // 关闭之前的加载组件
  if (loadingTimer) clearTimeout(loadingTimer); // 清除之前的定时器

  loading = ElLoading.service({
    lock: true,
    text,
    background: 'rgba(0, 0, 0, 0.7)'
  });

  // 设置默认超时关闭
  loadingTimer = window.setTimeout(() => {
    closeLoading();
  }, duration);
};

/**
 * 更新加载组件的文本
 * @param {string} text - 新的加载文本（如“50%”）
 */
const updateLoadingText = (text: string) => {
  if (loading) {
    loading.setText(text);
  }
};

export { showLoading, updateLoadingText, closeLoading };
