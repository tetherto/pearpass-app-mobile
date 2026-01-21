import { ConfigPlugin, withDangerousMod, withXcodeProject } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

export const withNativeClipboardIOS: ConfigPlugin = (config) => {
  // Copy NativeClipboard.swift and NativeClipboard.m to project
  config = withDangerousMod(config, ['ios', async (cfg) => {
    const templateDir = path.join(__dirname, '../../templates/ios');
    const iosDir = cfg.modRequest.platformProjectRoot;
    const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
    const projectDir = path.join(iosDir, projectName);

    // Copy NativeClipboard.swift
    const swiftSrc = path.join(templateDir, 'NativeClipboard.swift');
    const swiftDest = path.join(projectDir, 'NativeClipboard.swift');
    await fs.promises.copyFile(swiftSrc, swiftDest);

    // Copy NativeClipboard.m
    const mSrc = path.join(templateDir, 'NativeClipboard.m');
    const mDest = path.join(projectDir, 'NativeClipboard.m');
    await fs.promises.copyFile(mSrc, mDest);

    return cfg;
  }]);

  // Add files to Xcode project
  config = withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
    const projectGroup = project.findPBXGroupKey({ name: projectName });

    if (projectGroup) {
      // Add Swift file - use full path since the project group has no path attribute
      project.addSourceFile(
        `${projectName}/NativeClipboard.swift`,
        { target: project.getFirstTarget().uuid },
        projectGroup
      );

      // Add Objective-C file
      project.addSourceFile(
        `${projectName}/NativeClipboard.m`,
        { target: project.getFirstTarget().uuid },
        projectGroup
      );
    }

    return cfg;
  });

  return config;
};
