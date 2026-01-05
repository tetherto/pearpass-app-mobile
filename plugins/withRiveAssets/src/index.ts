import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const withRiveAssets: ConfigPlugin = (config) => {
  // iOS: Copy .riv files to ios/Assets/
  config = withDangerousMod(config, ['ios', async (cfg) => {
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
