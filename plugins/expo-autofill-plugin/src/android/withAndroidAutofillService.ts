import { ConfigPlugin, withDangerousMod, withAppBuildGradle } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { copyAndProcessSourceFiles, copyDirectory } from '../utils';
import { AutofillPluginOptions } from '../index';

export const withAndroidAutofillService: ConfigPlugin<AutofillPluginOptions> = (config, options) => {
  // Add Gradle task to copy extension bundle at every build
  if (options.extensionBundlePath) {
    config = withAppBuildGradle(config, (cfg) => {
      const copyTaskCode = `
// Copy autofill extension bundle before build
// Path is relative to android/app/, so ../../ goes to project root
tasks.register("copyAutofillBundle", Copy) {
    from "../../${options.extensionBundlePath}"
    into "src/main/assets"
    rename { "extension.bundle" }
    doFirst {
        if (!file("../../${options.extensionBundlePath}").exists()) {
            logger.warn("Extension bundle not found at ${options.extensionBundlePath}")
            logger.warn("Run 'npm run bundle:autofill' to generate it")
        }
    }
}

preBuild.dependsOn copyAutofillBundle
`;

      // Add the task before dependencies block
      if (!cfg.modResults.contents.includes('copyAutofillBundle')) {
        const dependenciesIndex = cfg.modResults.contents.indexOf('dependencies {');
        if (dependenciesIndex !== -1) {
          cfg.modResults.contents =
            cfg.modResults.contents.slice(0, dependenciesIndex) +
            copyTaskCode + '\n' +
            cfg.modResults.contents.slice(dependenciesIndex);
        }
      }

      return cfg;
    });
  }

  // Add androidx.credentials dependencies for passkey support
  config = withAppBuildGradle(config, (cfg) => {
    const credentialsDep = 'implementation "androidx.credentials:credentials:1.6.0-beta03"';
    if (!cfg.modResults.contents.includes('androidx.credentials:credentials')) {
      const dependenciesIndex = cfg.modResults.contents.indexOf('dependencies {');
      if (dependenciesIndex !== -1) {
        const insertIndex = cfg.modResults.contents.indexOf('{', dependenciesIndex) + 1;
        const credentialsDeps = `
    // Passkey / Credential Provider support
    ${credentialsDep}
    implementation "androidx.credentials:credentials-play-services-auth:1.6.0-beta03"`;
        cfg.modResults.contents =
          cfg.modResults.contents.slice(0, insertIndex) +
          credentialsDeps +
          cfg.modResults.contents.slice(insertIndex);
      }
    }
    return cfg;
  });

  // Add lazysodium-android + JNA dependencies for job queue encryption (crypto_secretbox)
  // NOTE: We use lazysodium-android:5.1.0 for Java API (Java 17 compatible) but exclude its
  // bundled libsodium.so (4KB page-aligned) and instead ship 16KB-aligned .so files from 5.2.0
  // in android-template/jniLibs/ to comply with Google Play's 16KB page size requirement.
  config = withAppBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes('lazysodium-android')) {
      const dependenciesIndex = cfg.modResults.contents.indexOf('dependencies {');
      if (dependenciesIndex !== -1) {
        const insertIndex = cfg.modResults.contents.indexOf('{', dependenciesIndex) + 1;
        const sodiumDeps = `
    // Lazysodium for job queue encryption (crypto_secretbox / XSalsa20-Poly1305)
    implementation "com.goterl:lazysodium-android:5.1.0@aar"
    implementation "net.java.dev.jna:jna:5.14.0@aar"`;
        cfg.modResults.contents =
          cfg.modResults.contents.slice(0, insertIndex) +
          sodiumDeps +
          cfg.modResults.contents.slice(insertIndex);
      }
    }

    // Exclude 4KB-aligned libsodium.so from the AAR; our 16KB-aligned copies take precedence
    if (!cfg.modResults.contents.includes("pickFirsts += ['**/libsodium.so']")) {
      const packagingBlock = `
android {
    packagingOptions {
        jniLibs.pickFirsts += ['**/libsodium.so']
    }
}
`;
      cfg.modResults.contents += packagingBlock;
    }

    return cfg;
  });

  return withDangerousMod(config, ['android', async (cfg) => {
    const packageName = cfg.android?.package || 'com.pears.pass';
    const packagePath = packageName.replace(/\./g, '/');
    const templateDir = path.join(__dirname, '../../android-template');
    const androidDir = cfg.modRequest.platformProjectRoot;

    // Copy autofill Java files to package/autofill/
    const autofillSrcDir = path.join(templateDir, 'java/autofill');
    const autofillDestDir = path.join(androidDir, 'app/src/main/java', packagePath, 'autofill');
    await copyAndProcessSourceFiles(autofillSrcDir, autofillDestDir, packageName);

    // Copy XML resources
    const resDir = path.join(androidDir, 'app/src/main/res');

    // Copy xml config
    const xmlSrcDir = path.join(templateDir, 'res/xml');
    const xmlDestDir = path.join(resDir, 'xml');
    if (fs.existsSync(xmlSrcDir)) {
      await copyDirectory(xmlSrcDir, xmlDestDir);
    }

    // Copy animations
    const animSrcDir = path.join(templateDir, 'res/anim');
    const animDestDir = path.join(resDir, 'anim');
    if (fs.existsSync(animSrcDir)) {
      await copyDirectory(animSrcDir, animDestDir);
    }

    // Copy layouts (only autofill-related ones)
    const layoutSrcDir = path.join(templateDir, 'res/layout');
    const layoutDestDir = path.join(resDir, 'layout');
    if (fs.existsSync(layoutSrcDir)) {
      await fs.promises.mkdir(layoutDestDir, { recursive: true });
      const layoutFiles = await fs.promises.readdir(layoutSrcDir);
      for (const file of layoutFiles) {
        const srcPath = path.join(layoutSrcDir, file);
        const destPath = path.join(layoutDestDir, file);
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    // Copy drawables
    const drawableSrcDir = path.join(templateDir, 'res/drawable');
    const drawableDestDir = path.join(resDir, 'drawable');
    if (fs.existsSync(drawableSrcDir)) {
      await fs.promises.mkdir(drawableDestDir, { recursive: true });
      const drawableFiles = await fs.promises.readdir(drawableSrcDir);
      for (const file of drawableFiles) {
        const srcPath = path.join(drawableSrcDir, file);
        const destPath = path.join(drawableDestDir, file);
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    // Copy values (autofill_styles.xml)
    const valuesSrcDir = path.join(templateDir, 'res/values');
    const valuesDestDir = path.join(resDir, 'values');
    if (fs.existsSync(valuesSrcDir)) {
      await fs.promises.mkdir(valuesDestDir, { recursive: true });
      const valuesFiles = await fs.promises.readdir(valuesSrcDir);
      for (const file of valuesFiles) {
        const srcPath = path.join(valuesSrcDir, file);
        const destPath = path.join(valuesDestDir, file);
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    // Copy 16KB-aligned libsodium.so native libs to jniLibs
    const jniLibsSrcDir = path.join(templateDir, 'jniLibs');
    if (fs.existsSync(jniLibsSrcDir)) {
      const jniLibsDestDir = path.join(androidDir, 'app/src/main/jniLibs');
      const arches = await fs.promises.readdir(jniLibsSrcDir);
      for (const arch of arches) {
        const archSrc = path.join(jniLibsSrcDir, arch);
        const archDest = path.join(jniLibsDestDir, arch);
        const stat = await fs.promises.stat(archSrc);
        if (stat.isDirectory()) {
          await fs.promises.mkdir(archDest, { recursive: true });
          const files = await fs.promises.readdir(archSrc);
          for (const file of files) {
            await fs.promises.copyFile(path.join(archSrc, file), path.join(archDest, file));
          }
        }
      }
    }

    // Copy extension.bundle to assets if path is provided
    if (options.extensionBundlePath) {
      const assetsDir = path.join(androidDir, 'app/src/main/assets');
      await fs.promises.mkdir(assetsDir, { recursive: true });

      const bundleSrc = path.resolve(cfg.modRequest.projectRoot, options.extensionBundlePath);
      const bundleDest = path.join(assetsDir, 'extension.bundle');
      if (fs.existsSync(bundleSrc)) {
        await fs.promises.copyFile(bundleSrc, bundleDest);
      }
    }

    return cfg;
  }]);
};
