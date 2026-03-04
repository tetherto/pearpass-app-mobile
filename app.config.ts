import fs from 'fs'
import path from 'path'

const appJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'app.json'), 'utf-8')
)

export default () => {
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

