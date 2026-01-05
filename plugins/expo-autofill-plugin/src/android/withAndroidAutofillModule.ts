import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { AutofillPluginOptions } from '../index';

export const withAndroidAutofillModule: ConfigPlugin<AutofillPluginOptions> = (config, _options) => {
  return withDangerousMod(config, ['android', async (cfg) => {
    const packageName = cfg.android?.package || 'com.pears.pass';
    const packagePath = packageName.replace(/\./g, '/');
    const templateDir = path.join(__dirname, '../../android-template/java');
    const destDir = path.join(
      cfg.modRequest.platformProjectRoot,
      'app/src/main/java',
      packagePath
    );

    // Copy AutofillModule.kt and AutofillPackage.kt
    const files = ['AutofillModule.kt', 'AutofillPackage.kt'];

    for (const file of files) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(destDir, file);

      if (fs.existsSync(srcPath)) {
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
    }

    return cfg;
  }]);
};
