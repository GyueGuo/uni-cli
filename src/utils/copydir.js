const path = require('path');
const fs = require('fs');

function copy (src, dist) {
  if (!fs.existsSync(src)) {
    throw Error('目标不存在');
  }
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dist);
    fs.readdirSync(src).forEach(function(filename) {
      copy(path.join(src, filename), path.join(dist, filename))
    });
  } else {
    fs.copyFileSync(src, dist);
  }
};
module.exports = copy;