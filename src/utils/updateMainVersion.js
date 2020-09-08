const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

const CONFIG = require('./config');
const { current } = require('./fitlerProject');
const logger = require('./logger');
const rmdir = require('./rmdir');

const Reg = /(['"])([0-9.]+)\1/;

module.exports = function() {
  const { liepin_argv: { update, main } } = global;
  const distPath = path.resolve(CONFIG.distDir);
  const tempPath = fs.mkdtempSync(path.join(os.tmpdir(), CONFIG.tempDir));
  // 下载主包
  const MainGit = CONFIG.main;
  const mainTempPath2Save = path.join(tempPath, path.basename(MainGit, '.git'));

  execSync(`git clone ${main ? `-b ${main} ` : ''}${MainGit} ${mainTempPath2Save}`);

  const filePath = path.join(mainTempPath2Save, 'src', CONFIG.versionFile);
  let content = fs.readFileSync(filePath, { encoding: 'utf8' });
  let newVersion = '';
  let oldVersion = ''
  content = content.replace(Reg, function(all, symbol, code) {
    oldVersion = code;
    const codes = code.split('.');
    switch (update) {
      case 'l':
        codes[0] = codes[0] - 0 + 1;
        break;
      case 'm':
        codes[1] = codes[1] - 0 + 1;
        break;
      case 's':
        codes[2] = codes[2] - 0 + 1;
        break;
      default:
        break;
    }
    newVersion = codes.join('.');
    return `${symbol}${newVersion}${symbol}`;
  });
  fs.writeFileSync(filePath, content);
  execSync(`cd ${mainTempPath2Save} && git add ${filePath}`);
  execSync(`cd ${mainTempPath2Save} && git commit -m '${current}上线升级版本 --rb'`);
  execSync(`cd ${mainTempPath2Save} && git push`);
  fs.copyFileSync(filePath, path.join(distPath, 'src', CONFIG.versionFile));
  rmdir(mainTempPath2Save);
  logger(`版本升级完成，${oldVersion} -> ${newVersion}`);
}