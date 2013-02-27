

var configuration = require('./config');
var compile = require('./compile');


function main() {
    var config = configuration.config;
    compile.compile(config.destFile, config.destModule, config.requireFiles);
}

main();

