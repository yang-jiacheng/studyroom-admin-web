/**
 * 并行加载多个 JS 脚本
 * @param urls 要加载的脚本 URL 数组
 */
export const loadScripts = async (urls: string[]): Promise<void[]> => {
  const loadSingleScript = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`加载脚本失败: ${url}`));
      document.head.appendChild(script);
    });
  };

  const promises = urls.map(url => loadSingleScript(url));
  return await Promise.all(promises);
};

