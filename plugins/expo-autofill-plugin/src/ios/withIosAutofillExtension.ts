import { ConfigPlugin, withDangerousMod, withXcodeProject } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { copyDirectory } from '../utils';
import { AutofillPluginOptions } from '../index';

export const withIosAutofillExtension: ConfigPlugin<AutofillPluginOptions> = (config, options) => {
  // 1. Copy extension template files
  config = withDangerousMod(config, ['ios', async (cfg) => {
    const templateDir = path.join(__dirname, '../../ios-template/PearPassAutofillExtension');
    const iosDir = cfg.modRequest.platformProjectRoot;
    const extensionDir = path.join(iosDir, 'PearPassAutofillExtension');

    // Copy all extension files
    await copyDirectory(templateDir, extensionDir);

    // Replace app group placeholder in all files that need it
    const filesToProcess = [
      'PearPassAutoFillExtension.entitlements',
      'Utils.swift',
      'KeychainHelper.swift',
    ];

    for (const fileName of filesToProcess) {
      const filePath = path.join(extensionDir, fileName);
      if (fs.existsSync(filePath)) {
        let content = await fs.promises.readFile(filePath, 'utf-8');
        content = content.replace(
          /\$\(APP_GROUP_IDENTIFIER\)/g,
          options.ios.appGroupIdentifier
        );
        await fs.promises.writeFile(filePath, content);
      }
    }

    // Copy extension.bundle if path is provided
    if (options.extensionBundlePath) {
      const bundleSrc = path.resolve(cfg.modRequest.projectRoot, options.extensionBundlePath);
      const bundleDest = path.join(extensionDir, 'extension.bundle');
      if (fs.existsSync(bundleSrc)) {
        await fs.promises.copyFile(bundleSrc, bundleDest);
      }
    }

    return cfg;
  }]);

  // 2. Add extension target to Xcode project
  config = withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const bundleId = `${cfg.ios?.bundleIdentifier}.PearPassAutoFillExtension`;
    const teamId = cfg.ios?.appleTeamId || '';
    const extensionName = 'PearPassAutoFillExtension';
    const extensionFolder = 'PearPassAutofillExtension';

    // Get main app target's deployment target
    const mainTarget = project.getFirstTarget();
    let deploymentTarget = '15.1';
    try {
      const buildSettings = project.getBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', 'Release');
      if (buildSettings) {
        deploymentTarget = buildSettings;
      }
    } catch (e) {
      // Use default
    }

    // IMPORTANT: Create required sections BEFORE addTarget
    const hash = project.hash.project.objects;
    if (!hash['PBXTargetDependency']) {
      hash['PBXTargetDependency'] = {};
    }
    if (!hash['PBXContainerItemProxy']) {
      hash['PBXContainerItemProxy'] = {};
    }

    // Add the extension target
    const target = project.addTarget(
      extensionName,
      'app_extension',
      extensionName,
      bundleId
    );

    // Create PBXFileSystemSynchronizedRootGroup section if it doesn't exist
    if (!hash['PBXFileSystemSynchronizedRootGroup']) {
      hash['PBXFileSystemSynchronizedRootGroup'] = {};
    }
    if (!hash['PBXFileSystemSynchronizedBuildFileExceptionSet']) {
      hash['PBXFileSystemSynchronizedBuildFileExceptionSet'] = {};
    }

    // Generate UUIDs for folder reference
    const folderRefUuid = project.generateUuid();
    const exceptionSetUuid = project.generateUuid();

    // Create exception set for files that shouldn't be auto-processed
    // - Info.plist: config file, not a resource
    // - extension.bundle: copied by our shell script to ensure it's always fresh
    hash['PBXFileSystemSynchronizedBuildFileExceptionSet'][exceptionSetUuid] = {
      isa: 'PBXFileSystemSynchronizedBuildFileExceptionSet',
      membershipExceptions: ['Info.plist', 'extension.bundle'],
      target: target.uuid,
      target_comment: extensionName,
    };
    hash['PBXFileSystemSynchronizedBuildFileExceptionSet'][`${exceptionSetUuid}_comment`] =
      `Exceptions for "${extensionFolder}" folder in "${extensionName}" target`;

    // Create PBXFileSystemSynchronizedRootGroup - this syncs with filesystem automatically
    hash['PBXFileSystemSynchronizedRootGroup'][folderRefUuid] = {
      isa: 'PBXFileSystemSynchronizedRootGroup',
      exceptions: [
        { value: exceptionSetUuid, comment: `Exceptions for "${extensionFolder}" folder in "${extensionName}" target` }
      ],
      explicitFileTypes: {},
      explicitFolders: [],
      path: extensionFolder,
      sourceTree: '"<group>"',
    };
    hash['PBXFileSystemSynchronizedRootGroup'][`${folderRefUuid}_comment`] = extensionFolder;

    // Add folder reference to main group
    const mainGroupUuid = project.getFirstProject().firstProject.mainGroup;
    const mainGroup = hash['PBXGroup'][mainGroupUuid];
    if (mainGroup && mainGroup.children) {
      mainGroup.children.push({
        value: folderRefUuid,
        comment: extensionFolder,
      });
    }

    // Link the folder to the extension target's fileSystemSynchronizedGroups
    if (!target.pbxNativeTarget.fileSystemSynchronizedGroups) {
      target.pbxNativeTarget.fileSystemSynchronizedGroups = [];
    }
    target.pbxNativeTarget.fileSystemSynchronizedGroups.push({
      value: folderRefUuid,
      comment: extensionFolder,
    });

    // Add Sources build phase (for compiling Swift/ObjC files)
    if (!hash['PBXSourcesBuildPhase']) {
      hash['PBXSourcesBuildPhase'] = {};
    }
    const sourcesBuildPhaseUuid = project.generateUuid();
    hash['PBXSourcesBuildPhase'][sourcesBuildPhaseUuid] = {
      isa: 'PBXSourcesBuildPhase',
      buildActionMask: 2147483647,
      files: [],
      runOnlyForDeploymentPostprocessing: 0,
    };
    hash['PBXSourcesBuildPhase'][`${sourcesBuildPhaseUuid}_comment`] = 'Sources';

    // Add Resources build phase (for assets, bundles, etc.)
    if (!hash['PBXResourcesBuildPhase']) {
      hash['PBXResourcesBuildPhase'] = {};
    }
    const resourcesBuildPhaseUuid = project.generateUuid();
    hash['PBXResourcesBuildPhase'][resourcesBuildPhaseUuid] = {
      isa: 'PBXResourcesBuildPhase',
      buildActionMask: 2147483647,
      files: [],
      runOnlyForDeploymentPostprocessing: 0,
    };
    hash['PBXResourcesBuildPhase'][`${resourcesBuildPhaseUuid}_comment`] = 'Resources';

    // Add build phases to extension target in correct order
    if (!target.pbxNativeTarget.buildPhases) {
      target.pbxNativeTarget.buildPhases = [];
    }
    target.pbxNativeTarget.buildPhases.push(
      { value: sourcesBuildPhaseUuid, comment: 'Sources' },
      { value: resourcesBuildPhaseUuid, comment: 'Resources' }
    );

    // Add frameworks
    const frameworks = [
      'AuthenticationServices.framework',
      'Security.framework',
      'LocalAuthentication.framework',
    ];

    frameworks.forEach(fw => {
      project.addFramework(fw, { target: target.uuid });
    });

    // Weak link CryptoKit
    project.addFramework('CryptoKit.framework', {
      target: target.uuid,
      weak: true
    });

    // Get version info from config to match main app
    const marketingVersion = cfg.version || '1.0';
    const buildNumber = cfg.ios?.buildNumber || '1';

    // Set build settings for extension target
    const buildSettings: Record<string, string> = {
      INFOPLIST_FILE: `${extensionFolder}/Info.plist`,
      CODE_SIGN_ENTITLEMENTS: `${extensionFolder}/PearPassAutoFillExtension.entitlements`,
      CODE_SIGN_STYLE: 'Automatic',
      DEVELOPMENT_TEAM: teamId,
      GENERATE_INFOPLIST_FILE: 'YES',
      IPHONEOS_DEPLOYMENT_TARGET: deploymentTarget,
      SWIFT_OBJC_BRIDGING_HEADER: `${extensionFolder}/PearPassAutoFillExtension-Bridging-Header.h`,
      SWIFT_VERSION: '5.0',
      TARGETED_DEVICE_FAMILY: '"1"',
      SKIP_INSTALL: 'YES',
      PRODUCT_BUNDLE_IDENTIFIER: bundleId,
      PRODUCT_NAME: '"$(TARGET_NAME)"',
      CURRENT_PROJECT_VERSION: buildNumber,
      MARKETING_VERSION: marketingVersion,
    };

    // Apply build settings
    const configListUuid = target.pbxNativeTarget.buildConfigurationList;
    const configLists = project.pbxXCConfigurationList();
    const configList = configLists[configListUuid];

    if (configList && configList.buildConfigurations) {
      const xcBuildConfigs = project.pbxXCBuildConfigurationSection();
      configList.buildConfigurations.forEach((configRef: { value: string }) => {
        const configUuid = configRef.value;
        if (xcBuildConfigs[configUuid] && xcBuildConfigs[configUuid].buildSettings) {
          Object.entries(buildSettings).forEach(([key, value]) => {
            xcBuildConfigs[configUuid].buildSettings[key] = value;
          });
        }
      });
    }

    // Add "Copy Extension Bundle" run script phase to copy bundle into built product
    // PBXFileSystemSynchronizedRootGroup syncs at project open time, so we need to
    // explicitly copy the bundle into the final .appex at build time
    if (options.extensionBundlePath) {
      // Ensure PBXShellScriptBuildPhase section exists
      if (!hash['PBXShellScriptBuildPhase']) {
        hash['PBXShellScriptBuildPhase'] = {};
      }

      const scriptBuildPhaseUuid = project.generateUuid();

      // Create the shell script that copies the bundle directly into the built product
      const shellScript = `# Copy autofill extension bundle into built product
BUNDLE_SRC="$PROJECT_DIR/../${options.extensionBundlePath}"

if [ -f "$BUNDLE_SRC" ]; then
  cp "$BUNDLE_SRC" "$BUILT_PRODUCTS_DIR/$WRAPPER_NAME/extension.bundle"
  echo "Copied extension bundle to $BUILT_PRODUCTS_DIR/$WRAPPER_NAME/extension.bundle"
else
  echo "warning: Extension bundle not found at $BUNDLE_SRC"
  echo "Run 'npm run bundle:autofill' to generate it"
fi
`;

      hash['PBXShellScriptBuildPhase'][scriptBuildPhaseUuid] = {
        isa: 'PBXShellScriptBuildPhase',
        buildActionMask: 2147483647,
        files: [],
        inputPaths: [`"$(PROJECT_DIR)/../${options.extensionBundlePath}"`],
        outputPaths: ['"$(BUILT_PRODUCTS_DIR)/$(WRAPPER_NAME)/extension.bundle"'],
        runOnlyForDeploymentPostprocessing: 0,
        shellPath: '/bin/sh',
        shellScript: JSON.stringify(shellScript),
        name: '"Copy Extension Bundle"',
      };
      hash['PBXShellScriptBuildPhase'][`${scriptBuildPhaseUuid}_comment`] = 'Copy Extension Bundle';

      // Add to extension target's buildPhases at the END (after linking/resources)
      target.pbxNativeTarget.buildPhases.push({
        value: scriptBuildPhaseUuid,
        comment: 'Copy Extension Bundle',
      });
    }

    // Add target dependency - main app depends on extension
    const nativeTargets = project.pbxNativeTargetSection();

    // Ensure PBXTargetDependency section exists
    if (!hash['PBXTargetDependency']) {
      hash['PBXTargetDependency'] = {};
    }

    // Ensure PBXContainerItemProxy section exists
    if (!hash['PBXContainerItemProxy']) {
      hash['PBXContainerItemProxy'] = {};
    }

    // Generate UUIDs for dependency objects
    const proxyUuid = project.generateUuid();
    const dependencyUuid = project.generateUuid();
    const rootObject = project.hash.project['rootObject'];

    // Add container item proxy
    hash['PBXContainerItemProxy'][proxyUuid] = {
      isa: 'PBXContainerItemProxy',
      containerPortal: rootObject,
      containerPortal_comment: 'Project object',
      proxyType: 1,
      remoteGlobalIDString: target.uuid,
      remoteInfo: extensionName
    };
    hash['PBXContainerItemProxy'][`${proxyUuid}_comment`] = 'PBXContainerItemProxy';

    // Add target dependency
    hash['PBXTargetDependency'][dependencyUuid] = {
      isa: 'PBXTargetDependency',
      target: target.uuid,
      target_comment: extensionName,
      targetProxy: proxyUuid,
      targetProxy_comment: 'PBXContainerItemProxy'
    };
    hash['PBXTargetDependency'][`${dependencyUuid}_comment`] = 'PBXTargetDependency';

    // Add dependency to main target's dependencies array
    if (nativeTargets[mainTarget.uuid]) {
      if (!nativeTargets[mainTarget.uuid].dependencies) {
        nativeTargets[mainTarget.uuid].dependencies = [];
      }
      nativeTargets[mainTarget.uuid].dependencies.push({
        value: dependencyUuid,
        comment: 'PBXTargetDependency'
      });
    }

    return cfg;
  });

  return config;
};
