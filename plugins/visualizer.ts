// plugins/visualizer.ts
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite'; // 导入 Vite 插件类型定义

export default (path: any,isBuild: boolean): PluginOption[] => {
  const plugins: PluginOption[] = [];
  if (isBuild) {
    plugins.push(visualizer({
      open: true, // 构建完成后自动在浏览器中打开报告
      gzipSize: true, // 显示 gzip 压缩后的大小
      brotliSize: false, // 显示 brotli 压缩后的大小（如果你的服务器支持）
      filename: path.resolve(__dirname, '../dist', 'bundle-analyzer.html') // 报告文件名，生成在 dist 目录下
    }));
  }
  return plugins;
};
