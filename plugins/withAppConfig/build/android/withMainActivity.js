"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMainActivity = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withMainActivity = (config) => {
    return (0, config_plugins_1.withMainActivity)(config, (cfg) => {
        let contents = cfg.modResults.contents;
        // Add CustomSplashScreenView.show(this) after super.onCreate(null) if not present
        if (!contents.includes('CustomSplashScreenView.show(this)')) {
            contents = contents.replace(/super\.onCreate\(null\)/, `super.onCreate(null)
    CustomSplashScreenView.show(this)`);
        }
        cfg.modResults.contents = contents;
        return cfg;
    });
};
exports.withMainActivity = withMainActivity;
