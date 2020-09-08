const path = require('path');
const fs = require('fs');

const CONFIG = require('./config');

module.exports = function () {
  return new Promise(function (resolve) {
    const distSrcPath = path.resolve(path.join(CONFIG.distDir, 'src'));
    const mainPagesPath = path.join(distSrcPath, CONFIG.pagesFile);
    const mainPagesContent = JSON.parse(fs.readFileSync(mainPagesPath));
    const pages = {
      main: mainPagesContent.pages.map((page) => ({
        pid: page.pid,
        path: page.path,
      })),
    };
    mainPagesContent.subPackages.forEach(function (item) {
      pages[item.root] = item.pages.map((page) => ({
        pid: page.pid,
        path: `${item.root}/${page.path}`,
      }));
    });
    fs.writeFileSync(path.join(distSrcPath, CONFIG.pages4route), `export default ${JSON.stringify(pages, null, 2)}`)
    resolve();
  });
}