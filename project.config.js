const config = {
  source: 'src',
  build: 'build',

  /**
   * Development
   */
  development: {
    server: {
      server: 'src',
      port: 8000,
      // proxy: 'gulp-common-template.loc',
      browser: 'chrome',
      open: false,
      notify: false,
    },
    css: {
      // app styles
      app: {
        min: false,
        maps: true,
      },
      // vendor styles
      vendors: {
        min: true,
        maps: true,
        separate: true,
      },
    },
    js: {
      // app scripts
      app: {
        min: false,
      },
      // vendor scripts
      vendors: {
        min: true,
        separate: true,
      },
    },
  },

  /**
   * Production
   */
  production: {
    server: {
      server: 'build',
      port: 8080,
      // proxy: 'gulp-common-template.loc',
      browser: 'chrome',
      open: true,
      notify: false,
    },
    css: {
      // app styles
      app: {
        min: true,
        maps: false,
      },
      // vendor styles
      vendors: {
        min: true,
        maps: false,
        separate: false,
      },
    },
    js: {
      // app scripts
      app: {
        min: true,
      },
      // vendor scripts
      vendors: {
        min: true,
        separate: false,
      },
    },
  },
};

/**
 * Get current mode
 */
let mode = () => require('yargs').argv.env || 'development';

mode.is = arg => {
  if (arg === 'dev') {
    return mode() === 'development' ? true : false;
  }
  if (arg === 'prod') {
    return mode() === 'production' ? true : false;
  }
};

module.exports = {
  config,
  mode,
};
