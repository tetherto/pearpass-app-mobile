import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => {
  const distribution = process.env.PEARPASS_DISTRIBUTION || 'standard'
  const isNightly = distribution === 'nightly'

  const plugins = config.plugins ? [...config.plugins] : []
  plugins.push(['./plugins/withAndroidDistribution', { distribution }])
  plugins.push([
    './plugins/expo-autofill-plugin',
    {
      ios: {
        appGroupIdentifier: 'group.com.pears.pass',
      },
      extensionBundlePath: 'bundles/autofill.bundle',
    },
  ])
  if (isNightly) {
    plugins.push('@sentry/react-native/expo')
  }

  return {
    ...config,
    name: config.name || 'PearPass',
    slug: config.slug || 'pearpass-app-mobile',
    plugins,
    extra: {
      ...(config.extra || {}),
      distribution
    }
  }
}
