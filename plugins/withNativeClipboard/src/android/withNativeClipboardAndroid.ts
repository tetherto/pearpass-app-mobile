import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

export const withNativeClipboardAndroid: ConfigPlugin = (config) => {
  return withDangerousMod(config, ['android', async (cfg) => {
    const packageName = cfg.android?.package || 'com.pears.pass';
    const packagePath = packageName.replace(/\./g, '/');
    const templateDir = path.join(__dirname, '../../templates/android');
    const destDir = path.join(
      cfg.modRequest.platformProjectRoot,
      'app/src/main/java',
      packagePath
    );

    // Ensure destination directory exists
    await fs.promises.mkdir(destDir, { recursive: true });

    // Copy and process each Kotlin file
    const files = ['NativeClipboardModule.kt', 'NativeClipboardPackage.kt', 'ClearClipboardWorker.kt'];

    for (const file of files) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(destDir, file);

      let content = await fs.promises.readFile(srcPath, 'utf-8');

      // Replace package declarations
      content = content.replace(
        /^package com\.pears\.pass$/gm,
        `package ${packageName}`
      );

      // Replace imports
      content = content.replace(
        /import com\.pears\.pass\./g,
        `import ${packageName}.`
      );

      await fs.promises.writeFile(destPath, content);
    }

    return cfg;
  }]);
};
