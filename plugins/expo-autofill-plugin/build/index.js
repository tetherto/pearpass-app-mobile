"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withIosAutofillExtension_1 = require("./ios/withIosAutofillExtension");
const withIosPodfile_1 = require("./ios/withIosPodfile");
const withIosAutofillModule_1 = require("./ios/withIosAutofillModule");
const withAndroidAutofillService_1 = require("./android/withAndroidAutofillService");
const withAndroidManifest_1 = require("./android/withAndroidManifest");
const withAndroidAutofillModule_1 = require("./android/withAndroidAutofillModule");
const withAutofillPlugin = (config, options) => {
    return (0, config_plugins_1.withPlugins)(config, [
        // iOS
        [withIosAutofillExtension_1.withIosAutofillExtension, options],
        [withIosPodfile_1.withIosPodfile, options],
        [withIosAutofillModule_1.withIosAutofillModule, options],
        // Android
        [withAndroidAutofillService_1.withAndroidAutofillService, options],
        [withAndroidManifest_1.withAndroidManifest, options],
        [withAndroidAutofillModule_1.withAndroidAutofillModule, options],
    ]);
};
exports.default = withAutofillPlugin;
