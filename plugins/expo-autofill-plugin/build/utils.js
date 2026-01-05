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
exports.copyDirectory = copyDirectory;
exports.copyAndProcessSourceFiles = copyAndProcessSourceFiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Recursively copy a directory
 */
async function copyDirectory(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        }
        else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}
/**
 * Copy and process source files, replacing package names
 */
async function copyAndProcessSourceFiles(srcDir, destDir, packageName, templatePackages = ['com.noxtton.pearpass', 'com.pears.pass']) {
    await fs.promises.mkdir(destDir, { recursive: true });
    const files = await fs.promises.readdir(srcDir, { withFileTypes: true });
    for (const file of files) {
        const srcPath = path.join(srcDir, file.name);
        const destPath = path.join(destDir, file.name);
        if (file.isDirectory()) {
            await copyAndProcessSourceFiles(srcPath, destPath, packageName, templatePackages);
        }
        else if (file.name.endsWith('.java') || file.name.endsWith('.kt')) {
            let content = await fs.promises.readFile(srcPath, 'utf-8');
            for (const templatePackage of templatePackages) {
                const escapeRegex = (s) => s.replace(/\./g, '\\.');
                const templateEscaped = escapeRegex(templatePackage);
                // Replace package declarations
                content = content.replace(new RegExp(`^package ${templateEscaped}`, 'gm'), `package ${packageName}`);
                // Replace imports
                content = content.replace(new RegExp(`import ${templateEscaped}`, 'g'), `import ${packageName}`);
            }
            await fs.promises.writeFile(destPath, content);
        }
        else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}
