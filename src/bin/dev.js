const mergeOthers = require('../utils/mergeOthers');
const mergeSelf = require('../utils/mergeSelf');
const watchFiles = require('../utils/watchFiles');
const handleNpm = require('../utils/handleNpm');
const startUni = require('../utils/startUni');
const mkPages4route = require('../utils/mkPages4route');
const cleanLiepin = require('../utils/cleanLiepin');

module.exports = async function () {
  await mergeOthers();
  await mergeSelf();
  await mkPages4route();
  await cleanLiepin();
  await handleNpm();
  await startUni();
  await watchFiles();
}