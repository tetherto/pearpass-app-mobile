import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { AutofillPluginOptions } from '../index';

// Patches project.pbxproj to add membershipExceptions to the
// PBXFileSystemSynchronizedRootGroup so that Info.plist and extension.bundle
// are not double-produced (they're handled by INFOPLIST_FILE setting and the
// Copy Extension Bundle script phase respectively). The xcode npm library
// used by Expo prebuild doesn't serialize these newer Xcode sections so we
// inject them via text patching here.

const EXTENSION_NAME = 'PearPassAutoFillExtension';
const EXTENSION_FOLDER = 'PearPassAutofillExtension';
const EXCEPTION_SET_UUID = 'EE10000000000000000EXC01';

export const withIosExtensionExceptions: ConfigPlugin<AutofillPluginOptions> = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const pbxprojPath = path.join(
        cfg.modRequest.platformProjectRoot,
        'PearPass.xcodeproj',
        'project.pbxproj'
      );

      if (!fs.existsSync(pbxprojPath)) {
        console.warn(`[withIosExtensionExceptions] pbxproj not found at ${pbxprojPath}`);
        return cfg;
      }

      let content = await fs.promises.readFile(pbxprojPath, 'utf-8');

      // Idempotent: skip if already patched.
      if (content.includes('PBXFileSystemSynchronizedBuildFileExceptionSet')) {
        return cfg;
      }

      // Find the extension's target UUID (the wrapper that references the .appex).
      const targetMatch = content.match(
        /([A-F0-9]{24})\s*\/\*\s*PearPassAutoFillExtension\s*\*\/\s*=\s*\{\s*isa\s*=\s*PBXNativeTarget;/
      );
      if (!targetMatch) {
        console.warn(`[withIosExtensionExceptions] PearPassAutoFillExtension target not found`);
        return cfg;
      }
      const targetUuid = targetMatch[1];

      // Match the synchronized root group line so we can add `exceptions = (...)` to it.
      const groupRegex = /([A-F0-9]{24})\s*\/\*\s*PearPassAutofillExtension\s*\*\/\s*=\s*\{\s*isa\s*=\s*PBXFileSystemSynchronizedRootGroup;\s*explicitFileTypes\s*=\s*\{\};\s*explicitFolders\s*=\s*\(\);\s*path\s*=\s*PearPassAutofillExtension;\s*sourceTree\s*=\s*"<group>";\s*\};/;
      const groupMatch = content.match(groupRegex);
      if (!groupMatch) {
        console.warn(`[withIosExtensionExceptions] synchronized root group not matched`);
        return cfg;
      }
      const groupUuid = groupMatch[1];

      const exceptionsRef = `${EXCEPTION_SET_UUID} /* Exceptions for "${EXTENSION_FOLDER}" folder in "${EXTENSION_NAME}" target */`;
      const newGroupLine = `${groupUuid} /* ${EXTENSION_FOLDER} */ = {isa = PBXFileSystemSynchronizedRootGroup; exceptions = (\n\t\t\t\t${exceptionsRef},\n\t\t\t); explicitFileTypes = {}; explicitFolders = (); path = ${EXTENSION_FOLDER}; sourceTree = "<group>"; };`;
      content = content.replace(groupRegex, newGroupLine);

      // Inject a brand-new PBXFileSystemSynchronizedBuildFileExceptionSet section
      // right before the synchronized root group section.
      const exceptionSetSection =
        `/* Begin PBXFileSystemSynchronizedBuildFileExceptionSet section */\n` +
        `\t\t${EXCEPTION_SET_UUID} /* Exceptions for "${EXTENSION_FOLDER}" folder in "${EXTENSION_NAME}" target */ = {\n` +
        `\t\t\tisa = PBXFileSystemSynchronizedBuildFileExceptionSet;\n` +
        `\t\t\tmembershipExceptions = (\n` +
        `\t\t\t\tInfo.plist,\n` +
        `\t\t\t\textension.bundle,\n` +
        `\t\t\t);\n` +
        `\t\t\ttarget = ${targetUuid} /* ${EXTENSION_NAME} */;\n` +
        `\t\t};\n` +
        `/* End PBXFileSystemSynchronizedBuildFileExceptionSet section */\n\n`;

      content = content.replace(
        /\/\* Begin PBXFileSystemSynchronizedRootGroup section \*\//,
        `${exceptionSetSection}/* Begin PBXFileSystemSynchronizedRootGroup section */`
      );

      await fs.promises.writeFile(pbxprojPath, content, 'utf-8');
      console.log(`[withIosExtensionExceptions] patched pbxproj — Info.plist + extension.bundle excluded from sync group`);

      return cfg;
    },
  ]);
};
