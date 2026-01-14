import { ConfigPlugin, withDangerousMod, withAndroidStyles } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const DARK_BACKGROUND_COLOR = '#232323';

// Use withAndroidStyles to properly modify styles.xml through Expo's pipeline
const withSplashStyles: ConfigPlugin = (config) => {
  return withAndroidStyles(config, (cfg) => {
    const styles = cfg.modResults;

    // Ensure styles.resources.style exists
    if (!styles.resources.style) {
      styles.resources.style = [];
    }

    // Find Theme.App.SplashScreen style
    const splashThemeIndex = styles.resources.style.findIndex(
      (s: any) => s.$.name === 'Theme.App.SplashScreen'
    );

    if (splashThemeIndex !== -1) {
      // Modify existing Theme.App.SplashScreen
      // Change parent from Theme.SplashScreen to AppTheme
      styles.resources.style[splashThemeIndex].$.parent = 'AppTheme';

      // Replace all items with our splash config
      styles.resources.style[splashThemeIndex].item = [
        { $: { name: 'android:windowBackground' }, _: '@drawable/splash_fullscreen' },
        { $: { name: 'android:statusBarColor' }, _: DARK_BACKGROUND_COLOR },
        { $: { name: 'android:navigationBarColor' }, _: DARK_BACKGROUND_COLOR }
      ];
    } else {
      // Create new Theme.App.SplashScreen
      styles.resources.style.push({
        $: { name: 'Theme.App.SplashScreen', parent: 'AppTheme' },
        item: [
          { $: { name: 'android:windowBackground' }, _: '@drawable/splash_fullscreen' },
          { $: { name: 'android:statusBarColor' }, _: DARK_BACKGROUND_COLOR },
          { $: { name: 'android:navigationBarColor' }, _: DARK_BACKGROUND_COLOR }
        ]
      });
    }

    // Find AppTheme style and update status bar color
    const appThemeIndex = styles.resources.style.findIndex(
      (s: any) => s.$.name === 'AppTheme'
    );

    if (appThemeIndex !== -1) {
      const appTheme = styles.resources.style[appThemeIndex];
      if (!appTheme.item) {
        appTheme.item = [];
      }

      // Find or update android:statusBarColor
      const statusBarIndex = appTheme.item.findIndex(
        (i: any) => i.$.name === 'android:statusBarColor'
      );

      if (statusBarIndex !== -1) {
        appTheme.item[statusBarIndex]._ = DARK_BACKGROUND_COLOR;
      } else {
        appTheme.item.push({ $: { name: 'android:statusBarColor' }, _: DARK_BACKGROUND_COLOR });
      }
    }

    return cfg;
  });
};

// Use withDangerousMod for copying files
const withSplashFiles: ConfigPlugin = (config) => {
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

    // Copy layout file
    const layoutDir = path.join(androidDir, 'app/src/main/res/layout');
    await fs.promises.mkdir(layoutDir, { recursive: true });

    const layoutSrc = path.join(templateDir, 'layout', 'custom_splash_screen_layout.xml');
    const layoutDest = path.join(layoutDir, 'custom_splash_screen_layout.xml');
    if (fs.existsSync(layoutSrc)) {
      await fs.promises.copyFile(layoutSrc, layoutDest);
    }

    // Copy custom_splash_screen.png drawable
    const drawableDir = path.join(androidDir, 'app/src/main/res/drawable');
    await fs.promises.mkdir(drawableDir, { recursive: true });

    const drawableSrc = path.join(templateDir, 'drawable', 'custom_splash_screen.png');
    const drawableDest = path.join(drawableDir, 'custom_splash_screen.png');
    if (fs.existsSync(drawableSrc)) {
      await fs.promises.copyFile(drawableSrc, drawableDest);
    }

    // Create splash_fullscreen.xml drawable for native splash screen
    const splashFullscreenXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="fill"
            android:src="@drawable/custom_splash_screen"/>
    </item>
</layer-list>`;
    await fs.promises.writeFile(
      path.join(drawableDir, 'splash_fullscreen.xml'),
      splashFullscreenXml
    );

    // Fix colors.xml to use dark background colors
    const colorsPath = path.join(androidDir, 'app/src/main/res/values/colors.xml');
    if (fs.existsSync(colorsPath)) {
      let colorsContent = await fs.promises.readFile(colorsPath, 'utf-8');

      // Fix splashscreen_background color
      colorsContent = colorsContent.replace(
        /<color name="splashscreen_background">#[0-9A-Fa-f]+<\/color>/,
        `<color name="splashscreen_background">${DARK_BACKGROUND_COLOR}</color>`
      );

      // Fix colorPrimaryDark color
      colorsContent = colorsContent.replace(
        /<color name="colorPrimaryDark">#[0-9A-Fa-f]+<\/color>/,
        `<color name="colorPrimaryDark">${DARK_BACKGROUND_COLOR}</color>`
      );

      // Add splash_background color if it doesn't exist
      if (!colorsContent.includes('name="splash_background"')) {
        colorsContent = colorsContent.replace(
          '</resources>',
          `  <color name="splash_background">${DARK_BACKGROUND_COLOR}</color>\n</resources>`
        );
      } else {
        colorsContent = colorsContent.replace(
          /<color name="splash_background">#[0-9A-Fa-f]+<\/color>/,
          `<color name="splash_background">${DARK_BACKGROUND_COLOR}</color>`
        );
      }

      await fs.promises.writeFile(colorsPath, colorsContent);
    }

    // Override ic_launcher_background.xml to use custom_splash_screen
    const launcherBgPath = path.join(drawableDir, 'ic_launcher_background.xml');
    const launcherBgContent = `<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/splashscreen_background"/>
  <item>
    <bitmap android:gravity="fill" android:src="@drawable/custom_splash_screen"/>
  </item>
</layer-list>`;
    await fs.promises.writeFile(launcherBgPath, launcherBgContent);

    // Delete all splashscreen_logo.png files
    const densities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
    for (const density of densities) {
      const logoPath = path.join(androidDir, `app/src/main/res/drawable-${density}/splashscreen_logo.png`);
      if (fs.existsSync(logoPath)) {
        await fs.promises.unlink(logoPath);
      }
    }

    return cfg;
  }]);
};

export const withSplashScreenAndroid: ConfigPlugin = (config) => {
  // First apply file operations
  config = withSplashFiles(config);
  // Then apply styles modifications through proper Expo pipeline
  config = withSplashStyles(config);
  return config;
};
