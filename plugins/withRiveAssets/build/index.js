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
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withRiveAssets = (config) => {
    // iOS: Copy .riv files to ios/Assets/
    config = (0, config_plugins_1.withDangerousMod)(config, ['ios', async (cfg) => {
            const templateDir = path.join(__dirname, '../templates/ios');
            const iosDir = cfg.modRequest.platformProjectRoot;
            const assetsDir = path.join(iosDir, 'Assets');
            // Ensure Assets directory exists
            await fs.promises.mkdir(assetsDir, { recursive: true });
            // Copy all .riv files
            const files = await fs.promises.readdir(templateDir);
            for (const file of files) {
                if (file.endsWith('.riv')) {
                    const srcPath = path.join(templateDir, file);
                    const destPath = path.join(assetsDir, file);
                    await fs.promises.copyFile(srcPath, destPath);
                }
            }
            return cfg;
        }]);
    // Android: Copy .riv files to res/raw/
    config = (0, config_plugins_1.withDangerousMod)(config, ['android', async (cfg) => {
            const templateDir = path.join(__dirname, '../templates/android');
            const androidDir = cfg.modRequest.platformProjectRoot;
            const rawDir = path.join(androidDir, 'app/src/main/res/raw');
            // Ensure raw directory exists
            await fs.promises.mkdir(rawDir, { recursive: true });
            // Copy all .riv files
            const files = await fs.promises.readdir(templateDir);
            for (const file of files) {
                if (file.endsWith('.riv')) {
                    const srcPath = path.join(templateDir, file);
                    const destPath = path.join(rawDir, file);
                    await fs.promises.copyFile(srcPath, destPath);
                }
            }
            return cfg;
        }]);
    return config;
};
exports.default = withRiveAssets;
