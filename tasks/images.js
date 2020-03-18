const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const imageResize = require('gulp-image-resize');
const ico = require('gulp-to-ico');
const svgSprite = require('gulp-svg-sprite');
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;

/**
 * Favicon generation
 */
const genFavicons = () => {
  return src(`${source}/img/favicon/original.png`)
    .pipe(imageResize({ width: 114, height: 114 }))
    .pipe(rename('apple-touch-icon-114x114.png'))
    .pipe(dest(`${source}/img/favicon/`))

    .pipe(imageResize({ width: 72, height: 72 }))
    .pipe(rename('apple-touch-icon-72x72.png'))
    .pipe(dest(`${source}/img/favicon/`))

    .pipe(imageResize({ width: 57, height: 57 }))
    .pipe(rename('apple-touch-icon.png'))
    .pipe(dest(`${source}/img/favicon/`))

    .pipe(ico('favicon.ico', { resize: true, sizes: [32, 32] }))
    .pipe(dest(`${source}`));
};

/**
 * SVG-sprite generation
 */
const genSprite = () => {
  return src(`${source}/svg/app-sprite-icons/*.svg`)
    .pipe(svgSprite({
      mode: {
        symbol: {
          example: {
            dest: 'app-sprite-preview.html',
          },
          dest: '',
          sprite: 'app-sprite.svg',
        }
      }
    }))
    .pipe(dest(`${mode.is('dev') ? source : build}/svg/`));
};

/**
 * Сopy images
 */
const copyIMG = () => {
  return src([
    `${source}/img/**/*.{jpg,jpeg,png,gif}`,
    `!${source}/img/favicon/original.*`,
  ]).pipe(dest(`${build}/img/`));
};

/**
 * Сopy/Сompress svg to build
 */
const copySVG = () => {
  return src([
    `${source}/svg/**/*.svg`,
    `!${source}/svg/app-sprite.svg`,
    `!${source}/svg/app-sprite-icons/**/*`,
  ]).pipe(dest(`${build}/svg/`));
};

module.exports = {
  genFavicons,
  genSprite,
  copySVG,
  copyIMG
};
