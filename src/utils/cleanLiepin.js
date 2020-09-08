const path = require('path');
const fs = require('fs');

const CONFIG = require('./config');
const rmdir = require('./rmdir');
const logWarn = require('./logWarn');

function clean() {
  return new Promise(function (resolve) {
    const p =  path.join(CONFIG.distDir, 'node_modules', '@liepin');
    if (fs.existsSync(p)) {
      rmdir(p);
      setTimeout(resolve, 500);
    } else {
      resolve();
    }
  });
}
module.exports = function () {
  return new Promise(function (resolve) {
    const p =  path.join(CONFIG.distDir, 'node_modules', '@liepin');
    if (fs.existsSync(p)) {
      logWarn('是否删除已安装@liepin包？(y/n)\n');
      async function handleInput(data) {
        const input = data.toLowerCase();
        if (input.indexOf('y') > -1) {
          rmdir(p);
          process.stdin.off('data', handleInput);
          setTimeout(resolve, 500);
        } else if (input.indexOf('n') > -1) {
          process.stdin.off('data', handleInput);
          resolve()
        }
      }
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', handleInput);
    } else {
      resolve();
    }
  });
}