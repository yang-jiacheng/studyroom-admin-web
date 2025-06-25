// 缓动函数（easeInOutQuad）实现先加速后减速的动画效果
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;  // 加速阶段
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b; // 减速阶段
};

// requestAnimationFrame 兼容处理，保证动画平滑执行
const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||  // 兼容老版本webkit浏览器
    (window as any).mozRequestAnimationFrame ||     // 兼容老版本Firefox浏览器
    function (callback) {
      window.setTimeout(callback, 1000 / 60);       // fallback，60FPS动画
    }
  );
})();

/**
 * 滚动页面到指定位置
 * 由于不同浏览器和页面结构不一，为了保证兼容，给多个可能的滚动元素赋值
 * @param {number} amount - 要滚动到的位置（像素）
 */
const move = (amount: number) => {
  document.documentElement.scrollTop = amount;            // 标准文档滚动元素
  (document.body.parentNode as HTMLElement).scrollTop = amount;  // 备用（兼容某些特殊情况）
  document.body.scrollTop = amount;                        // 备用（老式浏览器）
};

/**
 * 获取当前页面垂直滚动距离
 * 兼容多种浏览器和文档结构
 * @returns 当前滚动位置（像素）
 */
const position = () => {
  return (
    document.documentElement.scrollTop ||                  // 标准滚动元素
    (document.body.parentNode as HTMLElement).scrollTop || // 备用
    document.body.scrollTop                                 // 备用
  );
};

/**
 * 平滑滚动函数
 * @param {number} to - 目标滚动位置（像素）
 * @param {number} duration - 滚动持续时间（毫秒）
 * @param {Function} [callback] - 滚动结束后的回调函数
 */
export const scrollTo = (to: number, duration: number, callback?: any) => {
  const start = position();         // 当前滚动位置
  const change = to - start;        // 需要滚动的总距离
  const increment = 20;             // 每次动画执行间隔（ms）
  let currentTime = 0;              // 当前动画已进行时间

  // 如果未传入duration，默认500毫秒
  duration = typeof duration === 'undefined' ? 500 : duration;

  // 递归动画函数，通过requestAnimationFrame执行动画
  const animateScroll = function () {
    currentTime += increment;       // 更新时间
    // 计算当前时间对应的滚动位置，使用缓动函数实现自然动画
    const val = easeInOutQuad(currentTime, start, change, duration);
    move(val);                      // 移动滚动条到该位置
    if (currentTime < duration) {
      // 如果动画未结束，继续请求下一帧
      requestAnimFrame(animateScroll);
    } else {
      // 动画结束，执行回调（如果有）
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  animateScroll();  // 启动动画
};
