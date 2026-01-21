import type { Directive, DirectiveBinding } from 'vue';
import { usePermissionStore } from '@/store/permission.ts';

type PermissionValue = string | string[];

// 将指令值标准化为字符串数组
const normalizePermissions = (value: PermissionValue | undefined): string[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value.filter(Boolean) : [value];
};

// 基于权限决定元素是否显示
const applyPermission = (el: HTMLElement, binding: DirectiveBinding<PermissionValue>) => {
  const permissionStore = usePermissionStore();
  const permissions = normalizePermissions(binding.value);
  const hasPermission = permissions.some(item => permissionStore.hasPermission(item));
  if (!hasPermission) {
    // 记录原始 display，便于权限变化时恢复
    if (el.dataset.permissionDisplay === undefined) {
      el.dataset.permissionDisplay = el.style.display || '';
    }
    el.style.display = 'none';
    return;
  }
  // 有权限时恢复原有 display
  if (el.dataset.permissionDisplay !== undefined) {
    el.style.display = el.dataset.permissionDisplay;
    delete el.dataset.permissionDisplay;
  }
};

// v-permission 指令：无权限时隐藏
const permissionDirective: Directive<HTMLElement, PermissionValue> = {
  mounted (el, binding) {
    applyPermission(el, binding);
  },
  updated (el, binding) {
    applyPermission(el, binding);
  }
};

export default permissionDirective;
