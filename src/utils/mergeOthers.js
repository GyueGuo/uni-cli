const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

const CONFIG = require('./config');
const { others } = require('./fitlerProject');
const filterPages = require('./filterPages');
const validNpm = require('./validNpm');
const removeDir = require('./rmdir');

//todo
module.exports = function () {
  return new Promise(function (resolve) {
    const { lie_argv } = global;
    const distPath = path.resolve(CONFIG.distDir);
    const tempPath = fs.mkdtempSync(path.join(os.tmpdir(), CONFIG.tempDir));
    // 下载主包
    const MainGit = CONFIG.main;
    const mainTempPath2Save = path.join(tempPath, path.basename(MainGit, '.git'));

    const distSrcPath = path.join(distPath, 'src');
    execSync(`git clone ${lie_argv.main ? `-b ${lie_argv.main} ` : ''}${MainGit} ${mainTempPath2Save}`);
    if (!fs.existsSync(distPath)) {
      // 创建打包目录
      fs.mkdirSync(distPath);
    }
    fs.readdirSync(mainTempPath2Save).forEach(function (name) {
      if (name.indexOf('.') !== 0 && path.extname(name) !== '.md') {
        // 移动主包的 src 和 package.json到打包目录
        const targetPath = path.join(distPath, name);
        if (fs.existsSync(targetPath)) {
          if (fs.statSync(targetPath).isDirectory()) {
            removeDir(targetPath)
          } else {
            fs.unlinkSync(targetPath)
          }
        }
        fs.renameSync(path.join(mainTempPath2Save, name), targetPath);
      }
    });
    const lockPath = path.join(distPath, 'package-lock.json');
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
    }
    // 解析主包的package.json 和 pages.json
    const mainPagesPath = path.join(distSrcPath, CONFIG.pagesFile);
    const mainPagesContent = JSON.parse(fs.readFileSync(mainPagesPath));
    const mainPackagePath = path.join(distPath, CONFIG.packageFile);

    validNpm.add('main',  JSON.parse(fs.readFileSync(mainPackagePath)).dependencies);

    mainPagesContent.pages = filterPages(mainPagesContent.pages);
    if(!mainPagesContent.subPackages) {
      mainPagesContent.subPackages = [];
    }
  
    const mergeOtherResult = others.map(function ({ git, root }) {
      const subName = path.basename(git, '.git');
      const path2save = path.join(tempPath, subName);

      removeDir(path2save);
      execSync(`git clone ${lie_argv[root] ? `-b ${lie_argv[root]} ` : ''}${git} ${path2save}`);
      const pageContent = JSON.parse(fs.readFileSync(path.join(path2save, CONFIG.pagesFile)));
      const filtered = filterPages(pageContent.pages);
      // 如果没有页面需要打包到当前端，则忽略
      if (filtered.length) {
        mainPagesContent.subPackages.push({
          root,
          pages: filtered,
        });
        fs.renameSync(path.join(path2save, root), path.join(distSrcPath, root));
        if (pageContent.permission) {
          mainPagesContent.permission = Object.assign(pageContent.permission, mainPagesContent.permission)
        }
        validNpm.add(root, JSON.parse(fs.readFileSync(path.join(path2save, CONFIG.packageFile))).dependencies);
      }
      return true;
    });
    // 如果没有其他分包合并，则无需覆盖主包配置
    if (mergeOtherResult.filter((item) => item).length) {
      // 重写主包内的page.json
      fs.writeFileSync(mainPagesPath, JSON.stringify(mainPagesContent, null, 2));
    }
    removeDir(tempPath);
    resolve();
  });
}