import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from '@expo/config-plugins';

// Flags MainActivity must declare it handles, so Android does NOT recreate
// the Activity (and reset the JS context) when these change.
const REQUIRED_CONFIG_CHANGES = ['fontScale', 'density', 'fontWeightAdjustment'];

export const withMainActivityConfigChanges: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (cfg) => {
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(
      cfg.modResults
    );

    const existing = mainActivity.$['android:configChanges'] ?? '';
    const merged = Array.from(
      new Set([...existing.split('|').filter(Boolean), ...REQUIRED_CONFIG_CHANGES])
    );
    mainActivity.$['android:configChanges'] = merged.join('|');

    return cfg;
  });
};
