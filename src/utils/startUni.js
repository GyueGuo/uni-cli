const { spawn, execSync } = require('child_process');
const path = require('path');

const CONFIG = require('./config');
const logger = require('./logger');
const logErr = require('./logErr');

let openFlag = false;
function openDevTool ({ cwd, dev, edge }) {
  if (openFlag) {
    return false;
  }
  openFlag = true;
  const location = `${cwd}/dist/${dev ? 'dev' : 'build'}/mp-${edge}`;
  logger('正在打开开发工具, 目录：' + location);
  switch(edge) {
    case 'weixin':
        execSync('/Applications/wechatwebdevtools.app/Contents/MacOS/cli -o ' + location);
      break;
    case 'baidu':
        execSync('open /Applications/百度开发者工具.app');
      break;
    case 'alipay':
        execSync('open /Applications/小程序开发者工具.app');
      break;
    default:
      break;
  }
}
module.exports =  function () {
  return new Promise(function (resolve) {
    const { lie_argv: { mode, edge } } = global;
    const dev = mode === 'dev';
    const script = `node_modules/.bin/cross-env NODE_ENV=${dev ? 'development' : 'production'} UNI_PLATFORM=mp-${edge} node_modules/.bin/vue-cli-service uni-build ${dev ? '' : '--minimize'}`;
    function kill() {
      cp.kill('Kill_UNI');
    }
    const cwd = path.resolve(CONFIG.distDir);
    logger('开始编译...');
    const cp = spawn(script, dev ? ['--watch'] : [], {
      cwd,
      shell: true,
      killSignal: 'Kill_UNI',
    })
    cp.stdout.on('data', function (data) {
      const result = data.toString();
      if (result.indexOf('Build complete') >= 0) {
        openDevTool({ cwd, dev, edge });
        resolve();
      }
    });
    cp.stderr.on('data', function(data) {
      logErr(data.toString());
    });
    cp.on('close', function(err) {
      process.removeListener('exit', kill);
    });
    cp.on('err', function(err) {
      throw err;
    });
    process.on('exit', kill);
  });
} 