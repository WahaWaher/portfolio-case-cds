const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const fs = require('fs');
const importFresh = require('import-fresh');
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;

const getVendors = () => {
  let vendors;
  try {
    vendors = importFresh('../vendors.list.js');
    if (vendors.length <= 0) vendors = false;
  } catch (err) {
    vendors = false;
  }
  return vendors;
};

const getVendorsArray = () => {
  let vendors = importFresh('../vendors.list.js');
  let array = [];

  for (name in vendors) {
    if (Array.isArray(vendors[name])) {
      vendors[name].forEach(path => array.push(path));
    } else {
      array.push(vendors[name]);
    }
  }

  return array;
};

/**
 * JS App scripts
 */
const scriptsApp = () => {
  return src(mode.is('prod') ? `${source}/js/app.js` : ['./*', '!./*'], {
    allowEmpty: true,
  })
    .pipe(gulpif(config[mode()].js.app.min, uglify()))
    .pipe(gulpif(config[mode()].js.app.min, rename({ suffix: '.min' })))
    .pipe(dest(mode.is('dev') ? `${source}/js` : `${build}/js`));
};

/**
 * JS Libs
 */
const scriptsVendors = () => {
  let vendors = getVendorsArray();

  if (!vendors.length) {
    fs.writeFileSync(`${source}/js/vendors~app.js`, '');

    return src(['./*', '!./*'], { allowEmpty: true });
  }

  return src(vendors)
    .pipe(concat('vendors~app.js'))
    .pipe(gulpif(config[mode()].js.vendors.min, uglify()))
    .pipe(gulpif(config[mode()].js.vendors.min, rename({ suffix: '.min' })))
    .pipe(dest(mode.is('dev') ? `${source}/js` : `${build}/js`))
    .on('end', () => {
      if (!vendors && mode.is('prod')) {
        fs.access(`${build}/js`, err => {
          if (err)
            fs.mkdir(`${build}/js`, () => {
              fs.writeFile(`${build}/js/vendors~app.js`, '', err => {});
            });
        });
      }
    });
};

/**
 * JS Separated Libs
 */
const scriptsVendorsSep = () => {
  const vendors = importFresh('../vendors.list.js');
  const names = Object.keys(vendors);
  const streams = [];

  if (!names.length) return src(['./*', '!./*'], { allowEmpty: true });

  names.forEach(function(name) {
    const stream = src(vendors[name])
      .pipe(concat(`${name}${config[mode()].js.vendors.min ? '.min' : ''}.js`))
      .pipe(gulpif(config[mode()].js.vendors.min, uglify()))
      .pipe(dest(mode.is('dev') ? `${source}/js/vendors` : `${build}/js/vendors`));
    
      streams.push(stream);
  });

  return merge(streams);
};

module.exports = {
  scriptsApp,
  scriptsVendors,
  scriptsVendorsSep,
};
