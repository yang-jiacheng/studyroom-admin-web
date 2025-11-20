import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  // 忽略构建及测试相关的路径
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**']),
  // Vue 基础规则
  pluginVue.configs['flat/essential'],

  // Vue + TypeScript 推荐规则
  vueTsConfigs.recommended,

  // 添加自定义代码风格及最佳实践规则
  {
    rules: {
      // 禁止使用 var
      'no-var': 'error',
      // 强制语句以分号结尾
      'semi': ['error', 'always'],
      // 规定必须使用单引号
      // 'quotes': ['error', 'single'],
      // 强制使用 2 空格缩进
      'indent': ['error', 2],
      // 禁止行尾出现多余空格
      'no-trailing-spaces': 'error',
      // 禁止尾随逗号（你也可根据需要设置 other 选项）
      'comma-dangle': ['error', 'never'],
      // 要求箭头函数两侧有空格
      'arrow-spacing': 'error',
      // 限制连续空行数为 1
      'no-multiple-empty-lines': ['error', { max: 1 }],
      // 在变量使用前定义
      'no-use-before-define': 'off',
      // 要求对象字面量的大括号内始终保留空格
      'object-curly-spacing': ['error', 'always'],
      // 要求中缀操作符两侧有空格
      'space-infix-ops': 'error',
      // 要求函数括号前加空格
      'space-before-function-paren': ['error', 'always'],
      // 禁止额外的分号
      'no-extra-semi': 'error',
      // 禁止不必要的布尔转换
      'no-extra-boolean-cast': 'error',
      // 优先使用 const
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'vue/multi-word-component-names': 'off',
      'prefer-spread': 'off'
    }
  }
);
