const path = require('path');
const fs = require('fs');

const CONFIG = require('./config');
const rmdir = require('./rmdir');

module.exports = function () {
  return new Promise(function (resolve) {
    rmdir(path.resolve(CONFIG.distDir));
    setTimeout(resolve, 500);
  });
}