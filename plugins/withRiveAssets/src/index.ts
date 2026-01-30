import { ConfigPlugin, withDangerousMod, withXcodeProject, IOSConfig } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const withRiveAssets: ConfigPlugin = (config) => {
  // iOS: Copy .riv files to project directory and add to Xcode project
  config = withXcodeProject(config, async (cfg) => {
    const project = cfg.modResults;
    const projectName = cfg.modRequest.projectName || 'PearPass';
    const iosDir = cfg.modRequest.platformProjectRoot;
    const templateDir = path.join(__dirname, '../templates/ios');
    const projectDir = path.join(iosDir, projectName);

    // Copy .riv files to the project directory
    const files = await fs.promises.readdir(templateDir);
    const rivFiles = files.filter(f => f.endsWith('.riv'));

    for (const file of rivFiles) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(projectDir, file);
      await fs.promises.copyFile(srcPath, destPath);

      // Add file to Xcode project using IOSConfig.XcodeUtils.addResourceFileToGroup
      IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: destPath,
        groupName: projectName,
        isBuildFile: true,
        project,
        verbose: false,
      });
    }

    return cfg;
  });

  // Android: Copy .riv files to res/raw/
  config = withDangerousMod(config, ['android', async (cfg) => {
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

export default withRiveAssets;
