// Configs
const { mode, config } = require('./project.config');

module.exports = (type) => {
  return {
    /**
     * Development
     */
    development: {
      plugins: [
        require('postcss-inline-svg'),
        require('autoprefixer')({
          overrideBrowserslist: ['> 0.1%'],
        }),
        config[mode()].css[type].min
          ? require('cssnano')({
              preset: ['default', { discardComments: { removeAll: true } }],
            })
          : false,
      ].filter(Boolean),
    },

    /**
     * Production
     */
    production: {
      plugins: [
        require('postcss-inline-svg'),
        require('autoprefixer')({
          overrideBrowserslist: ['> 0.1%'],
        }),
        require('css-mqpacker'),
        config[mode()].css[type].min
          ? require('cssnano')({
              preset: ['default', { discardComments: { removeAll: true } }],
            })
          : false,
      ].filter(Boolean),
    },
  }
};
