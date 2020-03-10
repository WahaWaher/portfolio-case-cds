const { src } = require('gulp');
const del = require('del');
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;
const { readyJsDir, readyCssDir } = config.development;

/**
 * Remove all from "build"
 */
const cleanBuild = () => del(`${build}/**/*`);

/**
 * Clean CSS
 */
const cleanCSS = () => del(`${source}/css/**/*`);

/**
 * Clean JS
 */
const cleanJS = () => del([
  `${source}/js/vendors/**/*`,
  `${source}/js/app.min.js`,
  `${source}/js/vendors~app.js`,
  `${source}/js/vendors~app.min.js`
]);

module.exports = {
  cleanBuild,
  cleanCSS,
  cleanJS,
};
