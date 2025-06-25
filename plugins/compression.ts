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

  if (compressList.includes('gzip')) {
    plugins.push(
      compression({
        verbose: true,
        threshold: 51200,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false
      })
    );
  }

  return plugins;
}
