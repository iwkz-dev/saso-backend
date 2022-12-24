const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8')
);

module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'import/no-unresolved': [2, { ignore: ['/^@.*$/'] }],
    'no-unused-vars': 1,
    'no-else-return': 0,
    'consistent-return': 0,
    strict: 0,
    'no-throw-literal': 0,
    'no-underscore-dangle': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'no-plusplus': 0,
    'guard-for-in': 0,
    'no-restricted-syntax': 0,
  },
};
