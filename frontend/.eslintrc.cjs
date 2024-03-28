module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'typescript-airbnb-prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'react',
    'import',
    '@typescript-eslint',
    'prettier',
    'html',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-expressions': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
