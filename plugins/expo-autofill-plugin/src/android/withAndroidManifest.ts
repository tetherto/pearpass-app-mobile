import { ConfigPlugin, withAndroidManifest as withAndroidManifestMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { AutofillPluginOptions } from '../index';

function readDesignVersion(projectRoot: string): number {
  const flagsPath = path.join(
    projectRoot,
    'node_modules/@tetherto/pearpass-lib-constants/src/constants/flags.js'
  );
  if (!fs.existsSync(flagsPath)) return 1;
  const source = fs.readFileSync(flagsPath, 'utf-8');
  const match = source.match(/export\s+const\s+DESIGN_VERSION\s*=\s*(\d+)/);
  if (!match) return 1;
  const parsed = parseInt(match[1], 10);
  return Number.isNaN(parsed) ? 1 : parsed;
}

export const withAndroidManifest: ConfigPlugin<AutofillPluginOptions> = (config, _options) => {
  return withAndroidManifestMod(config, (cfg) => {
    const mainApplication = cfg.modResults.manifest.application?.[0];
    if (!mainApplication) return cfg;

    const designVersion = readDesignVersion((cfg as any).modRequest?.projectRoot ?? process.cwd());
    const autofillTheme =
      designVersion === 2
        ? '@style/Theme.PearPass.Autofill.Fullscreen.V2'
        : '@style/Theme.PearPass.Autofill.Fullscreen';

    // Add Autofill Service
    mainApplication.service = mainApplication.service || [];

    // Check if service already exists
    const serviceExists = mainApplication.service.some(
      (s: any) => s.$?.['android:name'] === '.autofill.service.PearPassAutofillService'
    );

    if (!serviceExists) {
      mainApplication.service.push({
        $: {
          'android:name': '.autofill.service.PearPassAutofillService',
          'android:permission': 'android.permission.BIND_AUTOFILL_SERVICE',
          'android:exported': 'true',
        },
        'intent-filter': [{
          action: [{ $: { 'android:name': 'android.service.autofill.AutofillService' } }],
        }],
        'meta-data': [{
          $: {
            'android:name': 'android.autofill',
            'android:resource': '@xml/autofill_service_config',
          },
        }],
      } as any);
    }

    // Add (or update) Authentication Activity
    mainApplication.activity = mainApplication.activity || [];

    const authActivity = mainApplication.activity.find(
      (a: any) => a.$?.['android:name'] === '.autofill.ui.AuthenticationActivity'
    );

    if (authActivity) {
      authActivity.$['android:theme'] = autofillTheme;
    } else {
      mainApplication.activity.push({
        $: {
          'android:name': '.autofill.ui.AuthenticationActivity',
          'android:theme': autofillTheme,
          'android:taskAffinity': '',
          'android:excludeFromRecents': 'true',
          'android:exported': 'false',
          'android:windowSoftInputMode': 'adjustResize',
          'android:launchMode': 'singleTop',
        },
      } as any);
    }

    // Add (or update) Passkey Registration Activity
    const passkeyActivity = mainApplication.activity.find(
      (a: any) => a.$?.['android:name'] === '.autofill.ui.PasskeyRegistrationActivity'
    );

    if (passkeyActivity) {
      passkeyActivity.$['android:theme'] = autofillTheme;
    } else {
      mainApplication.activity.push({
        $: {
          'android:name': '.autofill.ui.PasskeyRegistrationActivity',
          'android:theme': autofillTheme,
          'android:taskAffinity': '',
          'android:excludeFromRecents': 'true',
          'android:exported': 'false',
          'android:windowSoftInputMode': 'adjustResize',
          'android:launchMode': 'singleTop',
        },
      } as any);
    }

    // Add Credential Provider Service (Android 14+ passkey support)
    const credProviderExists = mainApplication.service.some(
      (s: any) => s.$?.['android:name'] === '.autofill.service.PearPassCredentialProviderService'
    );

    if (!credProviderExists) {
      mainApplication.service.push({
        $: {
          'android:name': '.autofill.service.PearPassCredentialProviderService',
          'android:enabled': 'true',
          'android:exported': 'true',
          'android:label': '@string/app_name',
          'android:permission': 'android.permission.BIND_CREDENTIAL_PROVIDER_SERVICE',
        },
        'intent-filter': [{
          action: [{ $: { 'android:name': 'android.service.credentials.CredentialProviderService' } }],
        }],
        'meta-data': [{
          $: {
            'android:name': 'android.credentials.provider',
            'android:resource': '@xml/credential_provider_config',
          },
        }],
      } as any);
    }

    return cfg;
  });
};
