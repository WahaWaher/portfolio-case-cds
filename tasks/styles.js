const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const cssimport = require('gulp-cssimport');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');
const inlineSvg = require('postcss-inline-svg');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;
const { server, stream } = require('./server');
const postcssConfig = require('../postcss.config.js');

sass.compiler = require('node-sass');

/**
 * CSS: App
 */
const stylesApp = () => {
  return src([
    `${source}/scss/**/*.scss`,
    `!${source}/scss/vendors/**/*`,
    `!${source}/scss/vendors~app.scss`,
  ])
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulpif(config[mode()].css.app.maps, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded', includePaths: ['./node_modules/'] }).on('error', sass.logError))
    .pipe(cssimport({ includePaths: ['./node_modules/'] }))
    .pipe(postcss(postcssConfig('app')[mode()].plugins))
    .pipe(gulpif(config[mode()].css.app.maps, sourcemaps.write()))
    .pipe(
      rename({
        // basename: 'app',
        suffix: config[mode()].css.app.min ? '.min' : '',
        extname: '.css',
      })
    )
    .pipe(
      dest(
        mode.is('dev')
          ? `${source}/css`
          : `${build}/css`
      )
    )
    .pipe(gulpif(mode.is('dev'), stream()));
};

/**
 * CSS: Vendors
 */
const stylesVendors = () => {
  return src([
    config[mode()].css.vendors.separate ? `${source}/scss/vendors/**/*.scss` : false,
    `${source}/scss/vendors~app.scss`,
  ].filter(Boolean))
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulpif(config[mode()].css.vendors.maps, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded', includePaths: ['./node_modules/'] }).on('error', sass.logError))
    .pipe(cssimport({ includePaths: ['./node_modules/'] }))
    .pipe(postcss(postcssConfig('vendors')[mode()].plugins))
    .pipe(gulpif(config[mode()].css.vendors.maps, sourcemaps.write()))
    .pipe(
      rename(function (path) {
          if (path.basename !== 'vendors~app') {
            path.dirname += "/vendors";
          }
          path.basename += config[mode()].css.vendors.min ? '.min' : '';
          path.extname = '.css';
      })
    )
    .pipe(
      dest(
        mode.is('dev')
          ? `${source}/css`
          : `${build}/css`
      )
    )
    .pipe(gulpif(mode.is('dev'), stream()));
};

module.exports = {
  stylesApp,
  stylesVendors,
};
