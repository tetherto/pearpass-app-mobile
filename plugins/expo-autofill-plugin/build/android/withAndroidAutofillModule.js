"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidAutofillModule = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withAndroidAutofillModule = (config, _options) => {
    return (0, config_plugins_1.withDangerousMod)(config, ['android', async (cfg) => {
            const packageName = cfg.android?.package || 'com.pears.pass';
            const packagePath = packageName.replace(/\./g, '/');
            const templateDir = path.join(__dirname, '../../android-template/java');
            const destDir = path.join(cfg.modRequest.platformProjectRoot, 'app/src/main/java', packagePath);
            // Copy AutofillModule.kt and AutofillPackage.kt
            const files = ['AutofillModule.kt', 'AutofillPackage.kt'];
            for (const file of files) {
                const srcPath = path.join(templateDir, file);
                const destPath = path.join(destDir, file);
                if (fs.existsSync(srcPath)) {
                    let content = await fs.promises.readFile(srcPath, 'utf-8');
                    // Replace package declarations
                    content = content.replace(/^package com\.noxtton\.pearpass$/gm, `package ${packageName}`);
                    content = content.replace(/^package com\.pears\.pass$/gm, `package ${packageName}`);
                    // Replace imports
                    content = content.replace(/import com\.noxtton\.pearpass\./g, `import ${packageName}.`);
                    content = content.replace(/import com\.pears\.pass\./g, `import ${packageName}.`);
                    await fs.promises.writeFile(destPath, content);
                }
            }
            return cfg;
        }]);
};
exports.withAndroidAutofillModule = withAndroidAutofillModule;
