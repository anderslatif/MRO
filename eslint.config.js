import globals from 'globals';
import pluginJs from '@eslint/js';
import airbnbBase from 'eslint-config-airbnb-base';
import airbnbRules from 'eslint-config-airbnb-base/rules/style';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-async-promise-executor': 'off',
      indent: ['error', 4],
      ...airbnbBase.rules,
      ...airbnbRules.rules,
    },
  },
];
