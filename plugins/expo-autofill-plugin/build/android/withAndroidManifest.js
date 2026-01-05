"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidManifest = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withAndroidManifest = (config, _options) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (cfg) => {
        const mainApplication = cfg.modResults.manifest.application?.[0];
        if (!mainApplication)
            return cfg;
        // Add Autofill Service
        mainApplication.service = mainApplication.service || [];
        // Check if service already exists
        const serviceExists = mainApplication.service.some((s) => s.$?.['android:name'] === '.autofill.service.PearPassAutofillService');
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
            });
        }
        // Add Authentication Activity
        mainApplication.activity = mainApplication.activity || [];
        // Check if activity already exists
        const activityExists = mainApplication.activity.some((a) => a.$?.['android:name'] === '.autofill.ui.AuthenticationActivity');
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
            });
        }
        return cfg;
    });
};
exports.withAndroidManifest = withAndroidManifest;
