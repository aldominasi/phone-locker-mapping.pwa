const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Phone Locker Mapping",
    themeColor: "#868889",
    msTileColor: "#CC071E"
  }
})
