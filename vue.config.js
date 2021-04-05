const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("pages", resolve("src/pages"));
  },
  devServer: {
    proxy: {
      "/api": {
        target:
          "https://service-agthqjcf-1256505457.cd.apigw.tencentcs.com/release",
        changeOrigin: true
      }
    }
  }
};
