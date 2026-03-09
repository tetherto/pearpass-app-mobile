import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => {
  const distribution = process.env.PEARPASS_DISTRIBUTION || 'standard'

  const plugins = config.plugins ? [...config.plugins] : []
  plugins.push(['./plugins/withAndroidDistribution', { distribution }])

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

