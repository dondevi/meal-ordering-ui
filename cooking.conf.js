/**
 * =============================================================================
 *  Cooking Config
 * =============================================================================
 *
 * @see http://elemefe.github.io/cooking/
 * @permission Engineer
 *
 * @author dondevi
 * @create 2017-08-24
 *
 */

var path = require("path");
var cooking = require("cooking");


cooking.set({

  entry: "./src/main.js",
  template: "./src/index.html",

  dist: "dist",
  publicPath: "./",
  assetsPath: "./static",

  hash: true,
  chunk: true,
  clean: true,
  postcss: [],
  extends: ["vue2"],
  minimize: true,

  alias: {
    "src": path.join(__dirname, "src"),
    "mock": path.join(__dirname, "mock"),
    "pages": path.join(__dirname, "src/pages"),
    "views": path.join(__dirname, "src/views"),
    "router": path.join(__dirname, "src/router"),
    "themes": path.join(__dirname, "src/themes"),
    "modules": path.join(__dirname, "src/modules"),
    "service": path.join(__dirname, "src/service"),
  },

  devServer: {
    port: 8096,
    clean: false,
    hostname: "0.0.0.0",
    sourceMap: true,
    publicPath: "/",
    proxy: {
      "/api-oa/**" : {
        target: "http://(server_host)",
        pathRewrite: { "^/api-oa/": "/" },
        headers: {
          "Host": "(server_host)",
          "Origin": "http://(server_host)",
        },
      },
    },
  },

});


module.exports = cooking.resolve();
