import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { AutofillPluginOptions } from '../index';

export const withIosPodfile: ConfigPlugin<AutofillPluginOptions> = (config, _options) => {
  return withDangerousMod(config, ['ios', async (cfg) => {
    const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
    const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
    let podfile = await fs.promises.readFile(podfilePath, 'utf-8');

    // Check if extension target already exists
    const extensionTargetExists = podfile.includes("target 'PearPassAutoFillExtension'");

    // Extension target must be NESTED inside the main PearPass target
    const extensionTarget = `
  target 'PearPassAutoFillExtension' do
    inherit! :search_paths
    pod 'BareKit', :path => '../node_modules/react-native-bare-kit/ios'
  end
`;

    // post_integrate hook - runs AFTER CocoaPods finishes integrating AND after Expo prebuild completes
    // This is the ONLY reliable place to modify files that Expo's base mods corrupt
    const postIntegrateHook = `
  require 'fileutils'

  # Post-integration fixes for AutoFill extension and custom splash screen
  post_integrate do |installer|
    # Fix 1: Replace Expo autolinking files for the extension target
    extension_dir = File.join(__dir__, 'Pods/Target Support Files/Pods-PearPassAutoFillExtension')
    if File.directory?(extension_dir)
      # Replace expo-configure-project.sh with no-op
      script_path = File.join(extension_dir, 'expo-configure-project.sh')
      if File.exist?(script_path)
        File.write(script_path, "#!/usr/bin/env bash\\n# No-op for AutoFill extension\\nexit 0\\n")
        File.chmod(0755, script_path)
      end

      # Replace ExpoModulesProvider.swift with empty implementation
      provider_path = File.join(extension_dir, 'ExpoModulesProvider.swift')
      if File.exist?(provider_path)
        File.write(provider_path, "import Foundation\\n\\n@objc(ExpoModulesProvider)\\npublic class ExpoModulesProvider: NSObject {\\n}\\n")
      end
    end

    # Fix 2: Copy custom splash screen storyboard (Expo's base mod corrupts XML)
    template_path = File.join(__dir__, '.splash-storyboard-template.xml')
    storyboard_path = File.join(__dir__, '${projectName}/SplashScreen.storyboard')
    if File.exist?(template_path) && File.exist?(storyboard_path)
      FileUtils.cp(template_path, storyboard_path)
      File.delete(template_path) # Clean up temp file
    end

    # Note: Extension source files are now handled automatically via PBXFileSystemSynchronizedRootGroup
    # Xcode automatically syncs and compiles all files in the extension folder
  end
`;

    // Add extension target if it doesn't exist
    if (!extensionTargetExists) {
      // Find the main target's post_install end and insert extension target before final 'end'
      const postInstallEndPattern = /(\s+end\s*\n)(end\s*\n*$)/;

      if (postInstallEndPattern.test(podfile)) {
        podfile = podfile.replace(postInstallEndPattern, `$1\n${extensionTarget}$2`);
      } else {
        // Fallback: find the last 'end' and insert before it
        const lines = podfile.split('\n');
        let lastEndIndex = -1;

        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].trim() === 'end') {
            lastEndIndex = i;
            break;
          }
        }

        if (lastEndIndex > 0) {
          lines.splice(lastEndIndex, 0, extensionTarget);
          podfile = lines.join('\n');
        }
      }
    }

    // Add post_integrate hook if not already present
    if (!podfile.includes('post_integrate do')) {
      // Insert before the extension target or before final 'end'
      if (podfile.includes("target 'PearPassAutoFillExtension'")) {
        podfile = podfile.replace(
          /(\n\s*target 'PearPassAutoFillExtension')/,
          `${postIntegrateHook}$1`
        );
      } else {
        // Fallback
        const lines = podfile.split('\n');
        let lastEndIndex = -1;

        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].trim() === 'end') {
            lastEndIndex = i;
            break;
          }
        }

        if (lastEndIndex > 0) {
          lines.splice(lastEndIndex, 0, postIntegrateHook);
          podfile = lines.join('\n');
        }
      }
    }

    await fs.promises.writeFile(podfilePath, podfile);
    return cfg;
  }]);
};
