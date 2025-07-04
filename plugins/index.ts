import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import createAutoImport from './auto-import';
import createComponents from './components';
import createCompression from './compression';
import createSetupExtend from './setup-extend';
import createIcons from './icons';
import createVisualizer from './visualizer';
import path from 'path';

export default (viteEnv: any,isBuild: boolean): any[] => {
  const vitePlugins: any = [];
  vitePlugins.push(vue());
  vitePlugins.push(vueDevTools());
  vitePlugins.push(createAutoImport(path));
  vitePlugins.push(createComponents(path));
  vitePlugins.push(createIcons());
  vitePlugins.push(...createCompression(viteEnv));
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(...createVisualizer(path,isBuild));
  return vitePlugins;
};
