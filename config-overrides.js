module.exports = function override(config, env) {
    config.output.filename = 'js/main.js';
    config.output.assetModuleFilename = 'assets/[name].[ext]';
    config.resolve.extensions.push(".json");
    return config;
}