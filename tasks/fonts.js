const { src, dest } = require('gulp');
const merge = require('merge-stream');
const fontkit = require('fontkit');
const vinylPaths = require('vinyl-paths');
const rename = require('gulp-rename');
const del = require('del');
const ttf2eot = require('gulp-ttf2eot');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2svg = require('gulp-ttf-svg');
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;

/**
 * Copy fonts from "src/" to "build/"
 */
const copyFonts = () => {
  return src([`${source}/fonts/**/*`])
    .pipe(dest(`${build}/fonts`))
};

/**
 * Fonts: Clear temp directories
 */
const fontsClear = () => {
  del(`${source}/fonts/_collected`);
  del(`${source}/fonts/_renamed`);
  del(`${source}/fonts/_sorted`);
  return del(`${source}/fonts/_ready`);
};

/**
 * Fonts: Collect all .ttf fonts in single directory
 */
const fontsCollect = () => {
  return src(`${source}/fonts/**/*.ttf`)
    .pipe(rename(path => path.dirname = ''))
    .pipe(dest(`${source}/fonts/_collected/`));
};

/**
 * Fonts: Rename all fonts (postscriptName)
 */
const fontsRename = () => {
  return src(`./${source}/fonts/_collected/**/*.ttf`)

    .pipe(rename(path => {
      const font = fontkit.openSync(
        `./${source}/fonts/_collected/${path.basename}${path.extname}`
      );

      path.basename = font.postscriptName;
    }))
    .pipe(dest(`${source}/fonts/_renamed/`))
};

/**
 * Fonts: Sort all fants (sub directories)
 */
const fontsSort = () => {
  return src(`./${source}/fonts/_renamed/**/*.ttf`)

    .pipe(rename(path => {
      path.dirname = path.basename;
    }))
    .pipe(dest(`${source}/fonts/_sorted/`))
};

/**
 * Fonts: Convert to web formats
 */
const fontsConvert = () => {
    const from = `${source}/fonts/_sorted/**/*.ttf`;
    const to = `${source}/fonts/_ready/`;

    return merge(
      src(from)
        .pipe(dest(to)),

      src(from)
        .pipe(ttf2woff2())
        .pipe(dest(to)),
      
      src(from)
        .pipe(ttf2woff())
        .pipe(dest(to)),

      // src(from)
      //   .pipe(ttf2eot())
      //   .pipe(dest(to)),
      
      // src(from)
      //   .pipe(ttf2svg())
      //   .pipe(dest(to)),
    );
};

module.exports = {
  copyFonts,
  fontsClear,
  fontsCollect,
  fontsRename,
  fontsSort,
  fontsConvert
};