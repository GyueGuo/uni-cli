const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const { current } = require('./fitlerProject');
const CONFIG = require('./config');
const selfPagesChange = require('./selfPagesChange');
const logger = require('./logger');

module.exports = function() {
  const source = path.resolve(current);
  logger('编译完毕！！')
  chokidar
    .watch(source, {
      ignored: /^\./,
      ignoreInitial: true,
      interval: 1000,
    })
    .on('all', function(event, file) {
      const targetPath = path.resolve(path.join(CONFIG.distDir, 'src', file.replace(path.resolve(), '')));
      switch (event) {
        case 'add':
          fs.copyFile(file, targetPath, function () {});
          break;
        case 'addDir':
          fs.mkdir(targetPath);
          break;
        case 'unlink':
          fs.unlink(targetPath, function () {});
          break;
        case 'unlinkDir':
          removeDir(targetPath);
          break;
        case 'change':
          fs.readFile(file, {
            options: 'string',
          }, function(err, data) {
            if (!err) {
              fs.writeFile(targetPath, data, function () {});
            }
          })
          break;
      }
    });
    chokidar
      .watch(CONFIG.pagesFile, {
        cwd: path.resolve(),
        ignoreInitial: true,
        interval: 1000,
      })
      .on('change', function() {
        selfPagesChange()
      });
}