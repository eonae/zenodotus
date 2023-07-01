module.exports = {
  root: true,
  plugins: ['@rsdk/eslint-plugin'],
  extends: ['plugin:@rsdk/eslint-plugin/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
};