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
exports.withAppGroupHelper = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withAppGroupHelper = (config) => {
    // Copy AppGroupHelper.h and AppGroupHelper.m to ios/ root
    config = (0, config_plugins_1.withDangerousMod)(config, ['ios', async (cfg) => {
            const templateDir = path.join(__dirname, '../../templates/ios');
            const iosDir = cfg.modRequest.platformProjectRoot;
            const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
            const projectDir = path.join(iosDir, projectName);
            // Get app group identifier from config
            const appGroups = cfg.ios?.entitlements?.['com.apple.security.application-groups'];
            const appGroupIdentifier = Array.isArray(appGroups) && appGroups.length > 0
                ? appGroups[0]
                : 'group.com.noxtton.pearpass';
            // Copy AppGroupHelper.h to project directory
            const headerSrc = path.join(templateDir, 'AppGroupHelper.h');
            const headerDest = path.join(projectDir, 'AppGroupHelper.h');
            await fs.promises.copyFile(headerSrc, headerDest);
            // Copy AppGroupHelper.m to project directory and replace placeholder
            const implSrc = path.join(templateDir, 'AppGroupHelper.m');
            const implDest = path.join(projectDir, 'AppGroupHelper.m');
            let implContent = await fs.promises.readFile(implSrc, 'utf-8');
            implContent = implContent.replace(/\$\(APP_GROUP_IDENTIFIER\)/g, appGroupIdentifier);
            await fs.promises.writeFile(implDest, implContent);
            return cfg;
        }]);
    // Add files to Xcode project
    config = (0, config_plugins_1.withXcodeProject)(config, (cfg) => {
        const project = cfg.modResults;
        const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
        // Find the main group
        const mainGroup = project.getFirstProject().firstProject.mainGroup;
        const projectGroup = project.findPBXGroupKey({ name: projectName });
        if (projectGroup) {
            // Add header file - use full path since the project group has no path attribute
            project.addHeaderFile(`${projectName}/AppGroupHelper.h`, { target: project.getFirstTarget().uuid }, projectGroup);
            // Add implementation file
            project.addSourceFile(`${projectName}/AppGroupHelper.m`, { target: project.getFirstTarget().uuid }, projectGroup);
        }
        return cfg;
    });
    return config;
};
exports.withAppGroupHelper = withAppGroupHelper;
