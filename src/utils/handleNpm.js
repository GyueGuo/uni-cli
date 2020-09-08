const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const CONFIG = require('./config');
const validNpm = require('./validNpm');
const logger = require('./logger');

module.exports = function () {
  return new Promise(async function (resolve) {
    const distPath = path.resolve(CONFIG.distDir);
    // 使用ide打包 所以添加src
    const distPackagePath = path.join(distPath, CONFIG.packageFile);
    const distPackageContent = JSON.parse(fs.readFileSync(distPackagePath));
    const result = await validNpm.valid();
    distPackageContent.dependencies = result;
    fs.writeFileSync(distPackagePath, JSON.stringify(distPackageContent, null, 2));
    logger('正在安装npm...');
    const cp = spawn(`npm i`, [], {
      cwd: distPath,
      shell: true,
      killSignal: 'Kill_Npm'
    });
    cp.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    cp.stderr.on('data', function(data) {
      console.log(data.toString());
    });
    cp.on('close', function(code) {
      process.removeListener('exit', killChild);
      resolve(code);
    });
    cp.on('error', (err) => {
      throw err;
    });
    function killChild() {
      cp.kill('Kill_Npm');
    }
    process.on('exit', killChild);
  });
}