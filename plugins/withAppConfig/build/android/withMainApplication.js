"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMainApplication = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withMainApplication = (config) => {
    return (0, config_plugins_1.withMainApplication)(config, (cfg) => {
        let contents = cfg.modResults.contents;
        const packageName = cfg.android?.package || 'com.pears.pass';
        // Add import for CustomSplashScreenPackage if not present
        if (!contents.includes('import ' + packageName + '.CustomSplashScreenPackage')) {
            contents = contents.replace(/package .+\n/, (match) => `${match}import ${packageName}.CustomSplashScreenPackage\n`);
        }
        // Add package registration if not present
        if (!contents.includes('packages.add(CustomSplashScreenPackage())')) {
            // Find the getPackages function and add our packages after PackageList
            contents = contents.replace(/(val packages = PackageList\(this\)\.packages)/, `$1
            // Added by withAppConfig plugin
            packages.add(CustomSplashScreenPackage())
            packages.add(AutofillPackage())
            packages.add(NativeClipboardPackage())`);
        }
        cfg.modResults.contents = contents;
        return cfg;
    });
};
exports.withMainApplication = withMainApplication;
