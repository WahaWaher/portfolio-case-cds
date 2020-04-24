const { watch, parallel } = require('gulp');
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;
// Tasks
const { stylesApp, stylesVendors } = require('./styles');
const { scriptsApp, scriptsVendors, scriptsVendorsSep } = require('./scripts');
const { includeHTML } = require('./pages');
const { server, reload } = require('./server');
const { genSprite } = require('./images');

/**
 * Watcher
 */
const watcher = () => {
  if (!mode.is('dev')) return server();
    else server();

  // Styles
  watch([
    `${source}/scss/**/*.scss`,
    `!${source}/scss/vendors/**/*`,
    `!${source}/scss/vendors~app.scss`,
  ], stylesApp);

  watch([
    `${source}/scss/vendors/**/*`,
    `${source}/scss/vendors~app.scss`,
  ], stylesVendors);

  // Scripts
  watch(
    ['vendors.list.js'],
    parallel(
      [
        scriptsVendors,
        config[mode()].js.vendors.separate ? scriptsVendorsSep : false,
      ].filter(Boolean)
    )
  ).on('change', reload);
  watch(
    [
      `${source}/js/**/*.js`,
      `!${source}/js/vendors/**/*`,
      `!${source}/js/vendors~app`,
    ],
    scriptsApp
  ).on('change', reload);

  // SVG
  watch([`${source}/svg/app-sprite-icons/**/*.svg`], genSprite).on(
    'change',
    reload
  );

  // HTML
  watch([`${source}/{page-templates,parts}/*.(html|php)`], includeHTML).on('all', reload);
};

module.exports = {
  watcher,
};
