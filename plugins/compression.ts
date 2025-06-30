// plugins/compression.ts
import compression from 'vite-plugin-compression';
import type { PluginOption } from 'vite';

export default function createCompression (env: Record<string, string>): PluginOption[] {
  const { VITE_BUILD_COMPRESS } = env;
  if (!VITE_BUILD_COMPRESS) return [];

  const compressList = VITE_BUILD_COMPRESS
    .split(',')
    .map((s) => s.trim().toLowerCase());

  const plugins: PluginOption[] = [];
  const excludeFilesRegex = /bundle-analyzer\.html$/; // 匹配以 bundle-analyzer.html 结尾的文件

  if (compressList.includes('gzip')) {
    plugins.push(
      compression({
        verbose: true,
        threshold: 51200,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false,
        filter: (file: string) => {
          // 如果文件路径与排除的正则表达式匹配，则返回 false (不压缩)
          return !excludeFilesRegex.test(file);
        }
      })
    );
  }

  return plugins;
}
