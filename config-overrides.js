module.exports = function override(config, env) {
    config.output.filename = 'js/main.js';
    config.output.assetModuleFilename = 'assets/[name].[ext]';
    return config;
}