const path = require('path');
const fs = require('fs');
const CONFIG = require('./config.js');
const result = (function () {
  let current = '';
  const dirs = fs.readdirSync(path.resolve());
  const { length } = dirs;
  const others = CONFIG.packages.filter(function(pro) {
    for (let i = 0; i < length; i++) {
      if (pro.root === dirs[i]) {
        current = pro.root;
        return false;
      }
    }
    return true;
  });
  return {
    others,
    current,
  }
})();
module.exports  = result;