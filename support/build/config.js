
var packagedesc = { dst: './build/jsoop/package.json',
    src: '{\n' +
  '  "name": "jsoop",\n' +
  '  "description": "Javascript Object Oriented Programming(OOP) class library. Support node and browser",\n' +
  '  "version": "%s",\n' +
  '  "author": "Yin Mingjun <yinmingjuncn@gmail.com>",\n' +
  '  "keywords": ["javascript", "OOP", "jsoop"],\n' +
  '  "main": "./lib/jsoop.js",\n' +
  '  "repository": "git://github.com/yinmingjun/jsoop.git"\n' +
'}'
}

var indexdesc = { dst: './build/jsoop/index.js',
    src: "module.exports = require('./lib/jsoop');" };

var dirs = ['./build', './build/jsoop', './build/jsoop/lib'];

var copyFiles = [{ 
    src: './README.md',
    dst: './build/jsoop/./README.md'
}, {
    src: './prebuild/node/jsoop.js',
    dst: './build/jsoop/lib/jsoop.js'
}, {
    src: './prebuild/node/jsoop-debug.js',
    dst: './build/jsoop/lib/jsoop-debug.js'
}, {
    src: './prebuild/browser/jsoop_browser.js',
    dst: './build/jsoop/jsoop_browser.js'
}];

var versionFile = './version.txt';
exports.packagedesc = packagedesc;
exports.indexdesc = indexdesc;
exports.dirs = dirs;
exports.copyFiles = copyFiles;
exports.versionFile = versionFile;
