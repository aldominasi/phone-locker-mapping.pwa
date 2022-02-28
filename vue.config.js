const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Phone Locker Mapping",
    themeColor: "#41E296",
    msTileColor: "#00C4EE"
  }
})
