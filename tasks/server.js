const { task } = require('gulp');
const browserSync = require('browser-sync').create();
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;

/**
 * BrowserSync
 */
const server = () => {
  browserSync.init({
    ...config[mode()].server,
  });
};

module.exports = {
  server,
  browserSync,
  reload: browserSync.reload,
  stream: browserSync.stream,
};
