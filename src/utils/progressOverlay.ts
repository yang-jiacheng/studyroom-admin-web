import { createVNode, render } from 'vue';
import ProgressOverlay from '@/components/progress/ProgressOverlay.vue';

let container: HTMLElement | null = null;
let vnode: any = null;

/**
 * 展示进度蒙版
 * @param percent 初始百分比
 */
export function showProgress (percent = 0) {
  if (container) closeProgress (); // 避免重复创建

  container = document.createElement('div');
  document.body.appendChild(container);

  vnode = createVNode(ProgressOverlay, {
    visible: true,
    percentage: percent
  });
  render(vnode, container);
}

/**
 * 更新进度百分比
 * @param percent 新的进度值（0-100）
 */
export function updateProgress (percent: number) {
  if (vnode) {
    vnode.component!.props.percentage = percent;
  }
}

/**
 * 关闭并销毁进度蒙版
 */
export function closeProgress () {
  if (vnode && container) {
    render(null, container);
    document.body.removeChild(container);
    container = null;
    vnode = null;
  }
}
