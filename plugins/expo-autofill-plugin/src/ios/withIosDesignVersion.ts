import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { AutofillPluginOptions } from '../index';

const FLAGS_MODULE = '@tetherto/pearpass-lib-constants/src/constants/flags.js';
const FLAG_NAME = 'DESIGN_VERSION';
const DEFAULT_DESIGN_VERSION = 1;
const PLIST_KEY = 'PEARPASS_DESIGN_VERSION';

// Reads DESIGN_VERSION from the shared flags module so the autofill extension
// can read it at runtime via Bundle.main.object(forInfoDictionaryKey:).
function readDesignVersion(projectRoot: string): number {
  const flagsPath = path.join(projectRoot, 'node_modules', FLAGS_MODULE);
  if (!fs.existsSync(flagsPath)) {
    console.warn(`[withIosDesignVersion] flags.js not found, using ${DEFAULT_DESIGN_VERSION}`);
    return DEFAULT_DESIGN_VERSION;
  }

  const pattern = new RegExp(`export\\s+const\\s+${FLAG_NAME}\\s*=\\s*(\\d+)`);
  const match = fs.readFileSync(flagsPath, 'utf-8').match(pattern);
  if (!match) {
    console.warn(`[withIosDesignVersion] ${FLAG_NAME} not found, using ${DEFAULT_DESIGN_VERSION}`);
    return DEFAULT_DESIGN_VERSION;
  }

  const parsed = parseInt(match[1], 10);
  if (Number.isNaN(parsed)) {
    console.warn(`[withIosDesignVersion] ${FLAG_NAME}="${match[1]}" not an integer, using ${DEFAULT_DESIGN_VERSION}`);
    return DEFAULT_DESIGN_VERSION;
  }

  console.log(`[withIosDesignVersion] Resolved ${FLAG_NAME}=${parsed}`);
  return parsed;
}

async function applyDesignVersionToPlist(plistPath: string, version: number): Promise<void> {
  let content = await fs.promises.readFile(plistPath, 'utf-8');

  // Idempotent: strip any existing entry first
  const existingPattern = new RegExp(
    `\\s*<key>${PLIST_KEY}</key>\\s*<integer>\\d+</integer>`,
    'g'
  );
  content = content.replace(existingPattern, '');

  // Insert before closing </dict>
  const insertion = `\t<key>${PLIST_KEY}</key>\n\t<integer>${version}</integer>\n`;
  content = content.replace(
    /(\n)?<\/dict>\s*<\/plist>\s*$/,
    `\n${insertion}</dict>\n</plist>\n`
  );

  await fs.promises.writeFile(plistPath, content, 'utf-8');
}

export const withIosDesignVersion: ConfigPlugin<AutofillPluginOptions> = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const version = readDesignVersion(cfg.modRequest.projectRoot);

      // Write only into the generated extension Info.plist under the prebuild
      // output. The template under ios-template/ is checked in and must not be
      // mutated. Expo dangerous mods compose such that the LAST-registered
      // plugin runs FIRST, so withIosAutofillExtension is registered last in
      // src/index.ts and its template-copy mod runs before this plugin — by
      // the time we get here the generated extension Info.plist already exists.
      const generatedPlistPath = path.join(
        cfg.modRequest.platformProjectRoot,
        'PearPassAutofillExtension',
        'Info.plist'
      );
      if (!fs.existsSync(generatedPlistPath)) {
        console.warn(
          `[withIosDesignVersion] generated Info.plist not found at ${generatedPlistPath}`
        );
        return cfg;
      }
      try {
        await applyDesignVersionToPlist(generatedPlistPath, version);
      } catch (err) {
        console.warn(`[withIosDesignVersion] failed to update generated Info.plist: ${err}`);
      }

      return cfg;
    },
  ]);
};
