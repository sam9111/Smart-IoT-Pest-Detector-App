const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const webpack = require("webpack");
const dotenv = require("dotenv");
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  const environment = dotenv.config().parsed;

  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(environment).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(environment[next]);
    return prev;
  }, {});

  config.plugins.push(new webpack.DefinePlugin(envKeys));

  return config;
};
