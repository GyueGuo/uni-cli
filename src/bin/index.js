#!/usr/bin/env node
const dev = require('./dev');
const build = require('./build');
const prod = require('./prod');
const checkSelf = require('./checkSelf');
const { argv, env } = process;
const [ mode, edge ] = argv.slice(3);
const extra = {
  mode,
  edge,
};
const { remain } = JSON.parse(env.npm_config_argv);
remain.forEach(function (item) {
  const [key, value] = item.split('=');
  extra[key] = value;
});
global.liepin_argv = extra;

switch (mode) {
  case 'dev':
    dev();
    break;
  case 'prod':
    checkSelf();
    prod();
    break;
  case 'build':
    // checkSelf();
    build();
    break;
}