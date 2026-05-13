#!/usr/bin/env node
// Creates stub npm packages for dependencies unavailable in the F-Droid build.

import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const root = join(import.meta.dirname, '..', '..')

// @tetherto/swarmconf — proprietary swarm config, not needed for F-Droid
const swarmDir = join(root, 'node_modules', '@tetherto', 'swarmconf')
mkdirSync(swarmDir, { recursive: true })
writeFileSync(join(swarmDir, 'package.json'), JSON.stringify({
  name: '@tetherto/swarmconf',
  version: '1.0.0-fdroid',
  main: 'index.js'
}, null, 2))
writeFileSync(join(swarmDir, 'index.js'), `module.exports = class SwarmConfig {
  constructor() {
    this.current = { version: 0, blindRelays: [], blindPeers: [] }
  }
  async ready() {
    return this
  }
}
`)

console.log('Created F-Droid stub: @tetherto/swarmconf')
