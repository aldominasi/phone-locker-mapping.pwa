const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/plm/',
  pwa: {
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png',
      // favicon16: 'img/icons/favicon-16x16.png',
      // favicon32: 'img/icons/favicon-32x32.png',
      // appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      // maskIcon: 'img/icons/safari-pinned-tab.svg',
    },
    name: "Phone Locker Mapping",
    themeColor: "#218c60",
    msTileColor: "#00C4EE",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
})
