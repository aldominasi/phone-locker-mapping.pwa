const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/plm/',
  pwa: {
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png'
    },
    name: "Phone Locker Mapping",
    themeColor: "#41E296",
    msTileColor: "#00C4EE",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
})
