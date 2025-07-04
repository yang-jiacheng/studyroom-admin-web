/**
 * 复制文本到剪切板
 * 提供多种回退方案以确保在不同环境下的兼容性
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // 方案1: 使用现代的 Clipboard API (需要 HTTPS)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API 复制失败，尝试回退方案:', err);
    }
  }

  // 方案2: 使用传统的 document.execCommand (已废弃但兼容性好)
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999); // 兼容移动设备

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        return true;
      }
    } catch (err) {
      console.warn('execCommand 复制失败:', err);
    }
  }

  // 方案3: 使用 Selection API 作为最后的回退
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(textArea);
    selection?.removeAllRanges();
    selection?.addRange(range);

    textArea.setSelectionRange(0, 99999);
    const successful = document.execCommand('copy');

    document.body.removeChild(textArea);
    selection?.removeAllRanges();

    if (successful) {
      return true;
    }
  } catch (err) {
    console.warn('Selection API 复制失败:', err);
  }

  return false;
};

/**
 * 复制文本到剪切板并显示相应的提示消息
 * @param text 要复制的文本
 * @param successMessage 成功提示消息
 * @param errorMessage 失败提示消息
 */
export const copyToClipboardWithMessage = async (
  text: string,
  successMessage: string = '下载地址已复制到剪切板',
  errorMessage: string = '复制失败，请手动复制'
): Promise<void> => {
  const success = await copyToClipboard(text);

  if (success) {
    ElMessage.success(successMessage);
  } else {
    ElMessage.error(errorMessage);
    console.error('所有复制方案都失败，文本内容:', text);
  }
};
