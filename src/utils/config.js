module.exports = {
  packages: [
    {
      "root": 'gcdc',
      "git": "http://gitcode.lietou.com/dev38/fe-mp/fe-gcdc-wx.git",
    },
    {
      "root": 'c',
      "git": "http://gitcode.lietou.com/dev38/fe-mp/fe-c-wx.git",
    },
    {
      "root": 'crecruit',
      "git": "http://gitcode.lietou.com/dev38/fe-mp/fe-crecruit-wx.git",
    },
    {
      "root": 'crm',
      "git": "http://gitcode.lietou.com/dev38/fe-mp/fe-crm-wx.git",
    },
    {
      "root": 'qywechat',
      "git": "http://gitcode.lietou.com/dev38/fe-mp/fe-qywechat-wx.git",
    },
  ],
  main: "http://gitcode.lietou.com/dev38/fe-mp/fe-main-wx.git",
  distDir: '.dist',
  tempDir: 'mp-temp',
  pagesFile: 'pages.json',
  versionFile: 'mp-version.js',
  packageFile: 'package.json',
  indexPage: 'pages/index/welcome',
  envPrefix: 'npm_config_',
  pages4route: 'pages4route.js'
};