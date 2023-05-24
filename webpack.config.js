const dotenv = require('dotenv');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const process = require('process');

module.exports = () => {
  const env = dotenv.config().parsed || { USE_API: 'false' };

  return {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/content-script.ts',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new EnvironmentPlugin(['TARGET_BROWSER']),
      new CopyPlugin({
        patterns: [
          { from: 'public/style.css' },
          process.env.TARGET_BROWSER === 'firefox'
            ? { from: 'public/manifest.firefox.json', to: 'manifest.json' }
            : { from: 'public/manifest.json' },
        ],
      }),
      new DefinePlugin({
        'process.env': JSON.stringify(env),
      }),
    ],
  };
};