import { ConfigPlugin, withDangerousMod, withMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

// Intercept Expo's splash storyboard mod - set skipWriting flag and copy our file instead
const withCustomSplashStoryboard: ConfigPlugin = (config) => {
  return withMod(config, {
    platform: 'ios',
    mod: 'splashScreenStoryboard',
    action: async (cfg) => {
      const templateDir = path.join(__dirname, '../../templates/ios');
      const storyboardSrc = path.join(templateDir, 'SplashScreen.storyboard');
      const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
      const storyboardDest = path.join(cfg.modRequest.platformProjectRoot, projectName, 'SplashScreen.storyboard');

      // Copy our storyboard directly
      if (fs.existsSync(storyboardSrc)) {
        await fs.promises.copyFile(storyboardSrc, storyboardDest);
      }

      // Tell Expo's base mod to skip writing by marking it handled
      cfg.modResults = null as any;
      (cfg.modRequest as any).introspect = true;

      return cfg;
    },
  });
};

// Copy splash screen assets (images, colorsets)
const withSplashScreenAssets: ConfigPlugin = (config) => {
  return withDangerousMod(config, ['ios', async (cfg) => {
    const templateDir = path.join(__dirname, '../../templates/ios');
    const iosDir = cfg.modRequest.platformProjectRoot;
    const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
    const projectDir = path.join(iosDir, projectName);
    const imagesDir = path.join(projectDir, 'Images.xcassets');

    // Copy SplashImage.imageset (full-screen splash image)
    const splashImageSrc = path.join(templateDir, 'SplashImage.imageset');
    const splashImageDest = path.join(imagesDir, 'SplashImage.imageset');
    if (fs.existsSync(splashImageSrc)) {
      await copyDirectory(splashImageSrc, splashImageDest);
    }

    // Copy SplashScreenBackground.colorset
    const splashBgSrc = path.join(templateDir, 'SplashScreenBackground.colorset');
    const splashBgDest = path.join(imagesDir, 'SplashScreenBackground.colorset');
    if (fs.existsSync(splashBgSrc)) {
      await copyDirectory(splashBgSrc, splashBgDest);
    }

    return cfg;
  }]);
};

export const withSplashScreenIOS: ConfigPlugin = (config) => {
  // Intercept and handle storyboard ourselves
  config = withCustomSplashStoryboard(config);
  // Copy the image assets
  config = withSplashScreenAssets(config);
  return config;
};
