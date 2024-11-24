const { defineConfig } = require('@vue/cli-service')
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "process": require.resolve("process/browser")
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser", // Обеспечиваем доступ к process в браузере
      }),
    ],
  }
})
