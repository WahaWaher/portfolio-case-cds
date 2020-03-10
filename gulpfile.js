const { series, parallel } = require('gulp');
// Tasks
const { cleanBuild, cleanCSS, cleanJS } = require('./tasks/clean');
const { stylesApp, stylesVendors } = require('./tasks/styles');
const {
  scriptsApp,
  scriptsVendors,
  scriptsVendorsSep,
} = require('./tasks/scripts');
const { rootPagesHTML, rootPagesPHP } = require('./tasks/pages');
const { copyIMG, genFavicons, genSprite, copySVG } = require('./tasks/images');
const {
  copyFonts,
  fontsClear,
  fontsCollect,
  fontsRename,
  fontsSort,
  fontsConvert,
} = require('./tasks/fonts');
const { copyRootOther, copyCustom } = require('./tasks/other');
const { watcher } = require('./tasks/watch');
// Configs
const { mode, config } = require('./project.config');
const { source, build } = config;

/**
 * Development Live Server
 * @cli npm run dev
 */
exports['dev'] = series(
  parallel(cleanCSS, cleanJS),
  parallel(
    [
      stylesApp,
      stylesVendors,
      scriptsApp,
      scriptsVendors,
      config[mode()].js.vendors.separate ? scriptsVendorsSep : false,
      genSprite
    ].filter(Boolean)
  ),
  watcher
);

/**
 * Production build
 * @cli npm run prod
 */
exports['build'] = series(
  cleanBuild,
  parallel(
    parallel(scriptsApp, scriptsVendors, scriptsVendorsSep),
    parallel(stylesApp, stylesVendors),
    copyFonts,
    copyIMG,
    copySVG,
    genSprite,
    rootPagesHTML,
    rootPagesPHP,
    copyRootOther,
    copyCustom([`${source}/layout/**/*`], [`${build}/layout`]),
    copyCustom([`${source}/pages/**/*`], [`${build}/pages`])
  ),
  watcher,
);

/**
 * Task: Generate favicons (png, ico)
 * from original "${src}/img/favicon/original.png"
 *
 * @cli npm run gulp fav
 */
exports['fav'] = series(genFavicons);

/**
 * Task: Generate web fonts from .ttf
 * from: "${src}/fonts"
 * temp directories: "_collected", "_renamed", "_sorted", "_ready"
 *
 * @cli npm run gulp fonts
 */
exports['fonts'] = series(
  fontsClear,
  fontsCollect,
  fontsRename,
  fontsSort,
  fontsConvert
);

/**
 * Task: Collects .ttf
 * from "${src}/fonts" to "${src}/fonts/_collected"
 *
 * @cli npm run gulp fonts:collect
 */
exports['fonts:collect'] = series(fontsClear, fontsCollect);

/**
 * Task: Rename collected fonts
 * from "${src}/fonts/_collected" to "${src}/fonts/_renamed"
 *
 * @cli npm run gulp fonts:collect
 */
exports['fonts:rename'] = series(fontsRename);

/**
 * Task: Sort collected and renamed fonts
 * from "${src}/fonts/_renamed" to "${src}/fonts/_sorted"
 *
 * @cli npm run gulp fonts:rename
 */
exports['fonts:sort'] = series(fontsSort);

/**
 * Task: Convert collected, renamed and sorted fonts
 * from "${src}/fonts/_sorted" to "${src}/fonts/_ready"
 *
 * @cli npm run gulp fonts:convert
 */
exports['fonts:convert'] = series(fontsConvert);
