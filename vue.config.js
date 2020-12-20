const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '/.env')
});

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        tether: 'tether',
        Tether: 'tether',
        'window.Tether': 'tether'
      }),
      new webpack.DefinePlugin({
        "process.env.TRANSLATION_API_KEY": JSON.stringify(process.env.TRANSLATION_API_KEY)
      })
    ]
  },
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js'
            ]
          }
        }
      }
    }
  }
}
