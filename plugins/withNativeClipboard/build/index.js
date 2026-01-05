"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withNativeClipboardIOS_1 = require("./ios/withNativeClipboardIOS");
const withNativeClipboardAndroid_1 = require("./android/withNativeClipboardAndroid");
const withNativeClipboard = (config) => {
    return (0, config_plugins_1.withPlugins)(config, [
        withNativeClipboardIOS_1.withNativeClipboardIOS,
        withNativeClipboardAndroid_1.withNativeClipboardAndroid,
    ]);
};
exports.default = withNativeClipboard;
