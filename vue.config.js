const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/plm/',
  pwa: {
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png',
    },
    name: "Phone Locker Mapping",
    short_name: "Plm",
    themeColor: "#218c60",
    msTileColor: "#00C4EE",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
})
