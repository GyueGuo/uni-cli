const path = require('path');
const fs = require('fs');

const CONFIG = require('./config');
const { current } = require('./fitlerProject');
const filterPages = require('./filterPages');

module.exports = function () {
  // 解析主包的package.json 和 pages.json
  let currentPages = JSON.parse(fs.readFileSync(path.resolve(CONFIG.pagesFile)));
  let filtered = filterPages(currentPages.pages);
  const distSrcPath = path.resolve(path.join(CONFIG.distDir, 'src'));
  const distPagePath = path.join(distSrcPath, CONFIG.pagesFile);
  const mainPagesContent = JSON.parse(fs.readFileSync(distPagePath));

  const preload = mainPagesContent.preloadRule[CONFIG.indexPage].packages;
  const { subPackages } = mainPagesContent;

  preload.splice(preload.indexOf(current), 1);
  subPackages.splice(subPackages.findIndex((item) => item.root === current), 1);

  if (filtered.length) {
    preload.push(current);
    subPackages.push({
      root: current,
      pages: filtered,
    });
    if (currentPages.permission) {
      mainPagesContent.permission = Object.assign(currentPages, mainPagesContent.permission)
    }
    fs.writeFileSync(distPagePath, JSON.stringify(mainPagesContent, null, 2));
  }
};