const mergeOthers = require('../utils/mergeOthers');
const mergeSelf = require('../utils/mergeSelf');
const handleNpm = require('../utils/handleNpm');
const startUni = require('../utils/startUni');
const cleanDist = require('../utils/cleanDist');
const mkPages4route = require('../utils/mkPages4route');
const updateMainVersion = require('../utils/updateMainVersion');
const cleanLiepiin = require('../utils/cleanLiepiin');
const logErr = require('../utils/logErr');


module.exports = async function() {
  const { lie_argv: { update } } = global;
  if (!update) {
    logErr('缺少升级版本参数！');
    process.exit(0);
  }
  await cleanDist();
  await mergeOthers();
  await mergeSelf();
  await mkPages4route();
  await cleanLiepiin();
  await handleNpm();
  await updateMainVersion();
  await startUni();
}