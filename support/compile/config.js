
var config = {
    destFile: './prebuild/browser/jsoop_browser.js',
    destModule: 'jsoop',
    requireFiles: [{
        file: './prebuild/node/jsoop-debug.js',
        mod: 'jsoop'
    }]

};

exports.config = config;
