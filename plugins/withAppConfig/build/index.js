"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAppGroupHelper_1 = require("./ios/withAppGroupHelper");
const withAppBuildGradle_1 = require("./android/withAppBuildGradle");
const withMainActivity_1 = require("./android/withMainActivity");
const withMainApplication_1 = require("./android/withMainApplication");
const withAppConfig = (config) => {
    return (0, config_plugins_1.withPlugins)(config, [
        // iOS
        withAppGroupHelper_1.withAppGroupHelper,
        // Android
        withAppBuildGradle_1.withAppBuildGradle,
        withMainActivity_1.withMainActivity,
        withMainApplication_1.withMainApplication,
    ]);
};
exports.default = withAppConfig;
