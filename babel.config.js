// 判断是开发阶段还是发布阶段
const productPlugins = []

if (process.env.NODE_ENV === 'production') {
  // 发布阶段
  productPlugins.push("transform-remove-console")
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
