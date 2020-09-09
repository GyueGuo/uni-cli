const mergeOthers = require('../utils/mergeOthers');
const mergeSelf = require('../utils/mergeSelf');
const handleNpm = require('../utils/handleNpm');
const cleanLiepiin = require('../utils/cleanLiepiin');
const startUni = require('../utils/startUni');
const mkPages4route = require('../utils/mkPages4route');

module.exports = async function () {
  await mergeOthers();
  await mergeSelf();
  await mkPages4route();
  await cleanLiepiin();
  await handleNpm();
  await startUni();
}