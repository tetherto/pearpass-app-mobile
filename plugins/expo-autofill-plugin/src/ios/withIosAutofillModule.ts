import { ConfigPlugin, withDangerousMod, withXcodeProject } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { AutofillPluginOptions } from '../index';

export const withIosAutofillModule: ConfigPlugin<AutofillPluginOptions> = (config, _options) => {
  // Copy AutofillModule.swift and AutofillModule.m to main app target
  config = withDangerousMod(config, ['ios', async (cfg) => {
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
  config = withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
    const projectGroup = project.findPBXGroupKey({ name: projectName });

    if (projectGroup) {
      // Add Swift file - use full path since the PearPass group has no path attribute
      project.addSourceFile(
        `${projectName}/AutofillModule.swift`,
        { target: project.getFirstTarget().uuid },
        projectGroup
      );

      // Add Objective-C file
      project.addSourceFile(
        `${projectName}/AutofillModule.m`,
        { target: project.getFirstTarget().uuid },
        projectGroup
      );
    }

    return cfg;
  });

  return config;
};
