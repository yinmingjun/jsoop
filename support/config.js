
var config = {
    destFile: './build/browser/jsoop_browser.js',
    destModule: 'jsoop',
    requireFiles: [{
        file: './build/node/jsoop-debug.js',
        mod: 'jsoop'
    }]

};

exports.config = config;
