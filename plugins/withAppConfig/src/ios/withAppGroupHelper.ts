import { ConfigPlugin, withDangerousMod, withXcodeProject } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

export const withAppGroupHelper: ConfigPlugin = (config) => {
  // Copy AppGroupHelper.h and AppGroupHelper.m to ios/ root
  config = withDangerousMod(config, ['ios', async (cfg) => {
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
  config = withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';

    // Find the main group
    const mainGroup = project.getFirstProject().firstProject.mainGroup;
    const projectGroup = project.findPBXGroupKey({ name: projectName });

    if (projectGroup) {
      // Add header file - use full path since the project group has no path attribute
      project.addHeaderFile(
        `${projectName}/AppGroupHelper.h`,
        { target: project.getFirstTarget().uuid },
        projectGroup
      );

      // Add implementation file
      project.addSourceFile(
        `${projectName}/AppGroupHelper.m`,
        { target: project.getFirstTarget().uuid },
        projectGroup
      );
    }

    return cfg;
  });

  return config;
};
