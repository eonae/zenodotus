module.exports = {
  ignorePatterns: [
    'files/',
    'dist/',
    'coverage/',
    'node_modules/',
    'generate-typings.ts',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: ['@mc/node'],
  extends: ['plugin:@mc/node/recommended'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
