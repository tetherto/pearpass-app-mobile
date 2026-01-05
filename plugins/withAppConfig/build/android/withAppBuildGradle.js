"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAppBuildGradle = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withAppBuildGradle = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (cfg) => {
        const dependencies = `
    // Added by withAppConfig plugin
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    implementation("androidx.autofill:autofill:1.3.0")
    implementation("androidx.biometric:biometric:1.1.0")
    implementation("androidx.work:work-runtime-ktx:2.9.0")`;
        // Check if dependencies already exist
        if (!cfg.modResults.contents.includes('androidx.recyclerview:recyclerview')) {
            cfg.modResults.contents = cfg.modResults.contents.replace(/dependencies\s*\{/, `dependencies {${dependencies}`);
        }
        return cfg;
    });
};
exports.withAppBuildGradle = withAppBuildGradle;
