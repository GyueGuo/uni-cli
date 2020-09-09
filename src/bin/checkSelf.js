const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const logErr = require('../utils/logErr');
const name = 'uni-cli-wx';

module.exports = function () {
  const v = execSync(`npm view ${name} version`).toString().trim();
  if (v.match(/\d+\.\d+\.\d+/)) {
    let cnt = fs.readFileSync(path.resolve(path.join(__dirname, '..', 'package.json')));
    if (cnt) {
      const curV = JSON.parse(cnt).version;
      if (v !== curV) {
        logErr(`当前${name}版本与最新版本不一致，请重新安装！`);
        process.exit(0);
      }
    }
  } else {
    logErr(`无法检测自身版本，请重新安装 ${name}`);
    process.exit(0);
  }

}