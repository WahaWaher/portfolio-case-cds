const { src, dest } = require('gulp');
// Configs
const { mode, config } = require('../project.config');
const { source, build } = config;

/**
 * Copy rest from "src/" to "build/"
 */
const copyRootOther = () => {
  return src([
    `${source}/*.*`,
    `${source}/.*`,
    `!${source}/index.html`,
    `!${source}/404.html`,
    `!${source}/index.php`,
    `!${source}/404.php`,
  ]).pipe(dest(`${build}`));
};

/**
 * Copy Custom
 */
const copyCustom = (sources = [], dests = `${build}`) => () => {
  return src(sources).pipe(dest(dests));
};

module.exports = {
  copyRootOther,
  copyCustom,
};
