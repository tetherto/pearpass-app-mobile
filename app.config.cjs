const appJson = require('./app.json')

module.exports = () => {
  const distribution = process.env.PEARPASS_DISTRIBUTION || 'standard'
  const base = appJson.expo

  const plugins = Array.isArray(base.plugins) ? [...base.plugins] : []
  plugins.push(['./plugins/withAndroidDistribution', { distribution }])

  return {
    ...base,
    plugins,
    extra: {
      ...(base.extra || {}),
      distribution
    }
  }
}

