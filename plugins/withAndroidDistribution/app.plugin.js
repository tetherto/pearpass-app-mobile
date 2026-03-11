const { withAppBuildGradle } = require('@expo/config-plugins')

const ensureAndroidBlock = (contents) => {
  const match = contents.match(/\bandroid\s*\{/m)
  if (!match) return null
  const start = match.index + match[0].length
  return { start }
}

const insertIfMissing = (contents, needle, insertAt, insertText) => {
  if (contents.includes(needle)) return contents
  return contents.slice(0, insertAt) + insertText + contents.slice(insertAt)
}

const withAndroidDistribution = (config, options = {}) => {
  const distribution =
    options.distribution || process.env.PEARPASS_DISTRIBUTION || 'standard'

  if (distribution !== 'fdroid') {
    return config
  }

  return withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents

    if (contents.includes('productFlavors') && contents.includes('fdroid')) {
      cfg.modResults.contents = contents
      return cfg
    }

    const androidBlock = ensureAndroidBlock(contents)
    if (!androidBlock) {
      cfg.modResults.contents = contents
      return cfg
    }

    const flavorsBlock = `
    flavorDimensions "distribution"
    productFlavors {
        standard {
            dimension "distribution"
            buildConfigField "String", "DISTRIBUTION_CHANNEL", "\\\"standard\\\""
        }
        fdroid {
            dimension "distribution"
            buildConfigField "String", "DISTRIBUTION_CHANNEL", "\\\"fdroid\\\""
        }
    }
`

    contents = insertIfMissing(
      contents,
      'flavorDimensions "distribution"',
      androidBlock.start,
      flavorsBlock
    )

    cfg.modResults.contents = contents
    return cfg
  })
}

module.exports = withAndroidDistribution
