import { ConfigPlugin, withAndroidManifest as withAndroidManifestMod } from '@expo/config-plugins';
import { AutofillPluginOptions } from '../index';

export const withAndroidManifest: ConfigPlugin<AutofillPluginOptions> = (config, _options) => {
  return withAndroidManifestMod(config, (cfg) => {
    const mainApplication = cfg.modResults.manifest.application?.[0];
    if (!mainApplication) return cfg;

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

    // Add Authentication Activity
    mainApplication.activity = mainApplication.activity || [];

    // Check if activity already exists
    const activityExists = mainApplication.activity.some(
      (a: any) => a.$?.['android:name'] === '.autofill.ui.AuthenticationActivity'
    );

    if (!activityExists) {
      mainApplication.activity.push({
        $: {
          'android:name': '.autofill.ui.AuthenticationActivity',
          'android:theme': '@style/Theme.PearPass.Autofill.Fullscreen',
          'android:taskAffinity': '',
          'android:excludeFromRecents': 'true',
          'android:exported': 'false',
          'android:windowSoftInputMode': 'adjustResize',
          'android:launchMode': 'singleTop',
        },
      } as any);
    }

    // Add Passkey Registration Activity
    const passkeyActivityExists = mainApplication.activity.some(
      (a: any) => a.$?.['android:name'] === '.autofill.ui.PasskeyRegistrationActivity'
    );

    if (!passkeyActivityExists) {
      mainApplication.activity.push({
        $: {
          'android:name': '.autofill.ui.PasskeyRegistrationActivity',
          'android:theme': '@style/Theme.PearPass.Autofill.Fullscreen',
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
