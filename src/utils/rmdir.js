const fs = require('fs');
const path = require('path');
// 移除目录
function rmdir(dirname) {
  if (fs.existsSync(dirname)) {
    fs.readdirSync(dirname).forEach(function(file) {
      const curPath = path.join(dirname, file);
      if (fs.statSync(curPath).isDirectory()) {
        rmdir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirname);
  }
}

module.exports = rmdir;