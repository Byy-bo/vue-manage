module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: ['off', 2],
    indent: ['off', 2],
    'space-before-function-paren': 0,
    'space-before-clocks': 0,
    'key-spacing': 0,
    'no-console': 'off', // 在这禁止掉console报错检查
    'no-irregular-whitespace': 'off'// 这禁止掉 空格报错检查
  }
}
