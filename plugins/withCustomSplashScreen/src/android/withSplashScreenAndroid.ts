import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

export const withSplashScreenAndroid: ConfigPlugin = (config) => {
  return withDangerousMod(config, ['android', async (cfg) => {
    const packageName = cfg.android?.package || 'com.pears.pass';
    const packagePath = packageName.replace(/\./g, '/');
    const templateDir = path.join(__dirname, '../../templates/android');
    const androidDir = cfg.modRequest.platformProjectRoot;

    // Copy Kotlin files
    const javaDir = path.join(androidDir, 'app/src/main/java', packagePath);
    await fs.promises.mkdir(javaDir, { recursive: true });

    const kotlinFiles = ['CustomSplashScreenModule.kt', 'CustomSplashScreenPackage.kt'];
    for (const file of kotlinFiles) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(javaDir, file);

      let content = await fs.promises.readFile(srcPath, 'utf-8');

      // Replace package declarations
      content = content.replace(
        /^package com\.noxtton\.pearpass$/gm,
        `package ${packageName}`
      );
      content = content.replace(
        /^package com\.pears\.pass$/gm,
        `package ${packageName}`
      );

      // Replace imports
      content = content.replace(
        /import com\.noxtton\.pearpass\./g,
        `import ${packageName}.`
      );
      content = content.replace(
        /import com\.pears\.pass\./g,
        `import ${packageName}.`
      );

      await fs.promises.writeFile(destPath, content);
    }

    // Copy layout file
    const layoutDir = path.join(androidDir, 'app/src/main/res/layout');
    await fs.promises.mkdir(layoutDir, { recursive: true });

    const layoutSrc = path.join(templateDir, 'layout', 'custom_splash_screen_layout.xml');
    const layoutDest = path.join(layoutDir, 'custom_splash_screen_layout.xml');
    if (fs.existsSync(layoutSrc)) {
      await fs.promises.copyFile(layoutSrc, layoutDest);
    }

    return cfg;
  }]);
};
