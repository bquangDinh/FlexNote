const { config } = require('@fortawesome/fontawesome-svg-core');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '/.env')
});

function enableShadowCss(config) {
  const configs = [
    config.module.rule('vue').use('vue-loader'),
    config.module.rule('css').oneOf('vue-modules').use('vue-style-loader'),
    config.module.rule('css').oneOf('vue').use('vue-style-loader'),
    config.module.rule('css').oneOf('normal-modules').use('vue-style-loader'),
    config.module.rule('css').oneOf('normal').use('vue-style-loader'),
    config.module.rule('postcss').oneOf('vue-modules').use('vue-style-loader'),
    config.module.rule('postcss').oneOf('vue').use('vue-style-loader'),
    config.module.rule('postcss').oneOf('normal-modules').use('vue-style-loader'),
    config.module.rule('postcss').oneOf('normal').use('vue-style-loader'),
    config.module.rule('scss').oneOf('vue-modules').use('vue-style-loader'),
    config.module.rule('scss').oneOf('vue').use('vue-style-loader'),
    config.module.rule('scss').oneOf('normal-modules').use('vue-style-loader'),
    config.module.rule('scss').oneOf('normal').use('vue-style-loader'),
    config.module.rule('sass').oneOf('vue-modules').use('vue-style-loader'),
    config.module.rule('sass').oneOf('vue').use('vue-style-loader'),
    config.module.rule('sass').oneOf('normal-modules').use('vue-style-loader'),
    config.module.rule('sass').oneOf('normal').use('vue-style-loader'),
    config.module.rule('less').oneOf('vue-modules').use('vue-style-loader'),
    config.module.rule('less').oneOf('vue').use('vue-style-loader'),
    config.module.rule('less').oneOf('normal-modules').use('vue-style-loader'),
    config.module.rule('less').oneOf('normal').use('vue-style-loader'),
    config.module.rule('stylus').oneOf('vue-modules').use('vue-style-loader'),
    config.module.rule('stylus').oneOf('vue').use('vue-style-loader'),
    config.module.rule('stylus').oneOf('normal-modules').use('vue-style-loader'),
    config.module.rule('stylus').oneOf('normal').use('vue-style-loader'),
  ];
  configs.forEach(c => c.tap(options => {
    options.shadowMode = true;
    return options;
  }));
}

function changeSCSSConfigs(config){
  const configs = [
    config.module.rule('scss').oneOf('vue-modules'),
    config.module.rule('scss').oneOf('vue'),
    config.module.rule('scss').oneOf('normal-modules'),
    config.module.rule('scss').oneOf('normal'),
  ];

  configs.forEach(function(c){
    c.uses.clear();
    c.use('style-loader').loader('style-loader');
    c.use('style-loader').options({
      insert: require('./css-loader-shim')
    });
    c.use('css-loader').loader('css-loader');
    c.use('css-loader').options({
      modules: true
    });
    c.use('sass-loader').loader('sass-loader');
  });
}

module.exports = {
  chainWebpack: config => {
    changeSCSSConfigs(config);
  },
  configureWebpack: {
    mode: 'production',
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    devtool: '(none)',
    plugins: [
      new webpack.ProvidePlugin({
        tether: 'tether',
        Tether: 'tether',
        'window.Tether': 'tether'
      }),
      new webpack.DefinePlugin({
        "process.env.TRANSLATION_API_KEY": JSON.stringify(process.env.TRANSLATION_API_KEY),
        "process.env.OXFORD_DICTIONARIES_API_KEY": JSON.stringify(process.env.OXFORD_DICTIONARIES_API_KEY),
        "process.env.OXFORD_DICTIONARIES_API_APP_ID": JSON.stringify(process.env.OXFORD_DICTIONARIES_API_APP_ID),
        "process.env.APP_NAME": JSON.stringify(process.env.APP_NAME),
        "process.env.APP_DEBUG": JSON.stringify(process.env.APP_DEBUG),
        "process.env.APP_PROXY_HOST": JSON.stringify(process.env.APP_PROXY_HOST),
      }),
    ],
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
        contentScripts: {
          entries: {
            'content-script': [
              //'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
              //'css-loader-shim.js',
              'src/content-scripts/content-script.js',
            ]
          }
        }
      }
    }
  }
}
