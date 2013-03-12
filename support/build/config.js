
var packagedesc = { dst: './build/jsoop/package.json',
    src: '{\n' +
  '  "name": "jsoop",\n' +
  '  "description": "Javascript Object Oriented Programming(OOP) class library. Support node and browser",\n' +
  '  "version": "%s",\n' +
  '  "author": "Yin Mingjun <yinmingjuncn@gmail.com>",\n' +
  '  "keywords": ["javascript", "OOP", "jsoop"],\n' +
  '  "main": "./jsoop.js",\n' +
  '  "repository":  {"type": "git", "url": "git://github.com/yinmingjun/jsoop.git"}' +
'}'
}

var indexdesc = { dst: './build/jsoop/index.js',
    src: "module.exports = require('./jsoop');" };

var dirs = ['./build', './build/jsoop'];

var copyFiles = [{ 
    src: './README.md',
    dst: './build/jsoop/./README.md'
}, {
    src: './prebuild/node/jsoop.js',
    dst: './build/jsoop/jsoop.js'
}, {
    src: './prebuild/node/jsoop-debug.js',
    dst: './build/jsoop/jsoop-debug.js'
}];

var versionFile = './version.txt';
exports.packagedesc = packagedesc;
exports.indexdesc = indexdesc;
exports.dirs = dirs;
exports.copyFiles = copyFiles;
exports.versionFile = versionFile;
