const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const pluginsDir = path.resolve(__dirname, '..', 'plugins')

const buildPlugin = (pluginPath) => {
  const pluginName = path.basename(pluginPath)
  const packageJsonPath = path.join(pluginPath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  if (!packageJson.scripts?.build) {
    return
  }

  console.log(`Building plugin: ${pluginName}`)

  const nodeModulesPath = path.join(pluginPath, 'node_modules')
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`  Installing dependencies...`)
    execSync('npm install', { cwd: pluginPath, stdio: 'inherit' })
  }

  execSync('npm run build', { cwd: pluginPath, stdio: 'inherit' })
  console.log(`  Done`)
}

const main = () => {
  if (!fs.existsSync(pluginsDir)) {
    console.log('No plugins directory found')
    return
  }

  const plugins = fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(pluginsDir, d.name))

  console.log(`Found ${plugins.length} plugins`)

  for (const pluginPath of plugins) {
    buildPlugin(pluginPath)
  }

  console.log('All plugins built successfully')
}

main()
