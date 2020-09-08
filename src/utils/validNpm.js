const logWarn = require('./logWarn');
const logErr = require('./logErr');

const [ mode ] = process.argv.slice(3);
function convertVersion2Number(version) {
  return version.split('.').map(function(n) {
    if (n.length === 3) {
      return n;
    }
    if (n.length === 2) {
      return `0${n}`;
    }
    if (n.length === 1) {
      return `00${n}`;
    }
    return '000';
  }).join('') - 0;
}

class Check {
  constructor() {
    this.deps = {};
  }
  reset() {
    this.deps = {};
  }
  add(name, dep) {
    this.deps[name] = dep;
  }
  valid() {
    const { deps } = this;
    const ve = {};
    const versions = [];
    Object.keys(deps).forEach(function (edge) {
      const depOfEdge = deps[edge];
      Object.keys(depOfEdge).forEach(function (name) {
        if (!(name in ve)) {
          ve[name] = {};
          versions[name] = [];
        }
        const version = depOfEdge[name];
        ve[name][edge] = version;
        versions[name].push(version);
      });
    });
    const result = {};
    const conflicted = [];
    const multiple = [];
    Object.keys(versions).forEach(function (name) {
      const record = versions[name];
      let unique = new Set(record);
      let betaSkip = false;
      // 如果存在1个以上不重复的版本则继续判断
      if (unique.size > 1) {
        multiple.push(name);
        unique = Array.from(unique);
        let fixed = []; // 指定版本
        const tempLarge = [];
        const bound = []; // 以^开头的
        unique.forEach(function (item) {
          if (betaSkip) {
            return false;
          }
          if (item.indexOf('beta') > -1) {
            fixed = [item];
            betaSkip = true;
          } else if (item.startsWith('^')) {
            const verCode = item.slice(1);
            const large = verCode.split('.')[0];
            // 保留大版本不重复的版本号，相同大版本号取最新版本
            if (tempLarge.includes(large)) {
              const index = bound.findIndex((item) => item.split('.')[0] === large);
              const saved = bound[index];
              if (convertVersion2Number(saved) < convertVersion2Number(verCode)) {
                bound[index] = verCode;
              }
            } else {
              tempLarge.push(large);
              bound.push(verCode);
            }
          } else if (item !== 'latest') {
            fixed.push(item);
          }
        });
        if (betaSkip) {
          result[name] = fixed[0];
          return false;
        }
        const fLength = fixed.length;
        const bLength = bound.length;
        // 如存在不同的指定大版本，或者不同的指定版本，报冲突
        if (fLength > 1 ||  bLength> 1) {
          conflicted.push(name);
          return false;
        }
        if (bLength) {
          if (fLength) {
            const [b] = bound;
            const [f] = fixed;
            if (
              b.split('.')[0] === f.split('.')[0] &&
              convertVersion2Number(b) <= convertVersion2Number(f)
            ) {
              result[name] = f;
              return false;
            } else {
              conflicted.push(name);
              return false;
            }
          } else {
            result[name] = '^' + bound[0];
            return false;
          }
        } else if (fLength) {
          result[name] = fixed[0];
          return false;
        }
      }
      result[name] = record[0];
    });

    return new Promise((resolve, reject) => {
      if (conflicted.length) {
        logErr('以下包存在版本冲突：\r\n');
        logErr(conflicted.map(function (name) {
          const dep = ve[name];
          return [name, ...Object.keys(dep).map((name) => (`${name}@${dep[name]}`))].join('\r\n\t');
        }).join('\r\n\r\n'));
        process.exit(0);
      } else if (multiple.length) {
        logWarn(['以下包存在多个指定版本：'].concat(multiple.map(function (name) {
          const dep = ve[name];
          return [name, ...Object.keys(dep).map((name) => (`${name}@${dep[name]}`)), `\r\n即将安装${result[name]}版本`].join('\r\n\t');
        })).join('\r\n\r\n'));
        logWarn('\r\n是否继续？（y/n）');
        async function handleInput (data) {
          const input = data.toLowerCase();
          if (input.indexOf('y') > -1) {
            process.stdin.off('data', handleInput);
            resolve(result);
          } else if (input.indexOf('n') > -1) {
            logErr('打包已停止');
            process.stdin.off('data', handleInput);
            process.exit(0);
          }
        }
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', handleInput);
      } else {
        resolve(result);
      }
    });
  }
}

module.exports = new Check();