const path = require('path');
const fs = require('fs');

const CONFIG = require('./config');
const { current } = require('./fitlerProject');
const filterPages = require('./filterPages');
const copyDir = require('./copyDir');
const validNpm = require('./validNpm');

module.exports = function () {
  return new Promise(function (resolve) {
    // 解析当前项目page.json
    let currentPages = JSON.parse(fs.readFileSync(path.resolve(CONFIG.pagesFile)));
    let filtered = filterPages(currentPages.pages);
    if (filtered.length) {
      const distSrcPath = path.resolve(path.join(CONFIG.distDir, 'src'));
      const distPagePath = path.join(distSrcPath, CONFIG.pagesFile);

      validNpm.add(current,  JSON.parse(fs.readFileSync(path.resolve(CONFIG.packageFile))).dependencies);

      // 解析主包的package.json 和 pages.json
      const mainPagesContent = JSON.parse(fs.readFileSync(distPagePath));
      mainPagesContent.subPackages.push({
        root: current,
        pages: filtered,
      });
      if (currentPages.permission) {
        mainPagesContent.permission = Object.assign(currentPages.permission, mainPagesContent.permission)
      }
      copyDir(path.resolve(current), path.join(distSrcPath, current));
      fs.writeFileSync(distPagePath, JSON.stringify(mainPagesContent, null, 2));
    }
    resolve();
  });
}