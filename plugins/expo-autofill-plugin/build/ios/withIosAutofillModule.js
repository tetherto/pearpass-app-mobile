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
exports.withIosAutofillModule = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withIosAutofillModule = (config, _options) => {
    // Copy AutofillModule.swift and AutofillModule.m to main app target
    config = (0, config_plugins_1.withDangerousMod)(config, ['ios', async (cfg) => {
            const templateDir = path.join(__dirname, '../../ios-template/MainApp');
            const iosDir = cfg.modRequest.platformProjectRoot;
            const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
            const projectDir = path.join(iosDir, projectName);
            // Copy AutofillModule.swift
            const swiftSrc = path.join(templateDir, 'AutofillModule.swift');
            const swiftDest = path.join(projectDir, 'AutofillModule.swift');
            if (fs.existsSync(swiftSrc)) {
                await fs.promises.copyFile(swiftSrc, swiftDest);
            }
            // Copy AutofillModule.m
            const mSrc = path.join(templateDir, 'AutofillModule.m');
            const mDest = path.join(projectDir, 'AutofillModule.m');
            if (fs.existsSync(mSrc)) {
                await fs.promises.copyFile(mSrc, mDest);
            }
            return cfg;
        }]);
    // Add files to Xcode project
    config = (0, config_plugins_1.withXcodeProject)(config, (cfg) => {
        const project = cfg.modResults;
        const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
        const projectGroup = project.findPBXGroupKey({ name: projectName });
        if (projectGroup) {
            // Add Swift file - use full path since the PearPass group has no path attribute
            project.addSourceFile(`${projectName}/AutofillModule.swift`, { target: project.getFirstTarget().uuid }, projectGroup);
            // Add Objective-C file
            project.addSourceFile(`${projectName}/AutofillModule.m`, { target: project.getFirstTarget().uuid }, projectGroup);
        }
        return cfg;
    });
    return config;
};
exports.withIosAutofillModule = withIosAutofillModule;
