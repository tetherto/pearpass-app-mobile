import { ConfigPlugin, withPlugins } from '@expo/config-plugins';
import { withAppGroupHelper } from './ios/withAppGroupHelper';
import { withAppBuildGradle } from './android/withAppBuildGradle';
import { withMainActivity } from './android/withMainActivity';
import { withMainActivityConfigChanges } from './android/withMainActivityConfigChanges';
import { withMainApplication } from './android/withMainApplication';

const withAppConfig: ConfigPlugin = (config) => {
  return withPlugins(config, [
    // iOS
    withAppGroupHelper,
    // Android
    withAppBuildGradle,
    withMainActivity,
    withMainActivityConfigChanges,
    withMainApplication,
  ]);
};

export default withAppConfig;
