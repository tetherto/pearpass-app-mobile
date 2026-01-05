"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withSplashScreenIOS_1 = require("./ios/withSplashScreenIOS");
const withSplashScreenAndroid_1 = require("./android/withSplashScreenAndroid");
const withCustomSplashScreen = (config) => {
    return (0, config_plugins_1.withPlugins)(config, [
        withSplashScreenIOS_1.withSplashScreenIOS,
        withSplashScreenAndroid_1.withSplashScreenAndroid,
    ]);
};
exports.default = withCustomSplashScreen;
