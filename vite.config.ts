import { UserConfig, ConfigEnv, loadEnv, defineConfig } from 'vite';
import createPlugins from './plugins/index';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.xxx.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
    // 例如，如果你的应用被部署在 https://www.xxx.com/admin/，则设置 baseUrl 为 /admin/。
    base: env.VITE_APP_CONTEXT_PATH,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.ts', '.js', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: false,
      strictPort: true,
      proxy: {
        [env.VITE_APP_PROXY_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_PROXY_API), '')
        }
      }

    },
    plugins: createPlugins(env, command === 'build'),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variable.scss";`
        }
      }
    }
  };
});
