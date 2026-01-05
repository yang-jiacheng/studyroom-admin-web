import { loadScripts } from "@/utils/loadHttpSourse.ts";
import { getAccessToken, TokenKey } from "@/utils/auth.ts";
import type { R } from "@/api/R.ts";

const ossPrefixTiny = import.meta.env.VITE_APP_OSS_URL;
const tinyPlugins = 'fullscreen,code,lists,advlist,image,link,kityformula-editor';
const tinyToolbar = 'fullscreen | code | kityformula-editor | fontsizeselect | undo redo | image link | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | subscript superscript | bullist numlist';
const uploadUrlTiny = import.meta.env.VITE_SERVE + "/resources/upload";

export default function useTinymce () {

  // 使用一个 ref 来追踪 TinyMCE 是否已加载
  const isTinymceLoaded = ref(false);
  // 使用一个 Set 来存储当前 Hook 实例管理的编辑器 ID，以便在卸载时清理
  const activeEditorIds = new Set<string>();

  // 获取 HTML 内容
  const getContent = (tinyId: string) => {
    const editor = tinymce.get(tinyId);
    return editor ? editor.getContent() : '';
  };

  const setContent = (tinyId: string,newContent: string) => {
    const editor = tinymce.get(tinyId);
    if (editor) editor.setContent(newContent);
  };

  // 获取纯文本内容
  const getTextContent = (tinyId: string) => {
    const editor = tinymce.get(tinyId);
    return editor ? editor.getContent({ format: 'text' }) : '';
  };

  // 移除 TinyMCE 编辑器
  const removeEditor = (tinyId: string) => {
    console.log('移除 TinyMCE 编辑器：' + tinyId);
    const editor = tinymce.get(tinyId);
    if (editor) {
      editor.remove();
      activeEditorIds.delete(tinyId);
    }
  };

  // 初始化 TinyMCE 编辑器
  const initEditor = async (tinyId: string,content: string,height: number = 300) => {
    // 确保 tinymce 脚本已加载
    if (!isTinymceLoaded.value) {
      // 如果还没有加载，等待加载完成
      await loadScripts([
        'https://oss.fhzjedu.com/static/tinymce/tinymce.min.js'
      ]);
      isTinymceLoaded.value = true;
    }

    const existingEditor = tinyMCE.get(tinyId);
    if (existingEditor) {
      setContent(tinyId,content);
      return;
    }

    await tinymce.init({
      selector: `#${tinyId}`,
      branding: false,
      height: height,
      max_height: height,
      language: 'zh_CN',
      content_style: "img {max-width:100%;}",
      plugins: tinyPlugins,
      toolbar: tinyToolbar,
      images_upload_handler: (blobInfo: any, succFun: any, failFun: any, progress: any) => {
        const xhr = new XMLHttpRequest();
        const file = blobInfo.blob(); // 获取文件对象

        xhr.open('POST', uploadUrlTiny);
        xhr.setRequestHeader(TokenKey, getAccessToken() || '');
        xhr.upload.onprogress = (e) => progress(e.loaded / e.total * 100);

        xhr.onload = () => {
          if (xhr.status !== 200) {
            failFun('HTTP Error: ' + xhr.status);
            return;
          }
          const json = JSON.parse(xhr.responseText) as R<string []>;
          if (json.code !== 0 || !json.result) {
            failFun('上传失败，请刷新页面后重试');
            return;
          }
          succFun(ossPrefixTiny + json.result[0]);
        };

        const formData = new FormData();
        formData.append('file', file, blobInfo.filename());
        xhr.send(formData);
      },
      menubar: false,
      resize: false,
      statusbar: true,
      init_instance_callback: (editor: any) => {
        editor.setContent(content);
        activeEditorIds.add(tinyId);
      }
    });
  };

  onUnmounted(() => {
    activeEditorIds.forEach(id => {
      removeEditor(id);
    });
    activeEditorIds.clear();
  });

  return {
    initEditor,
    removeEditor,
    getContent,
    getTextContent,
    setContent
  };
}
