import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')

const phaseArg = process.argv[2] || 'all'
const phases = phaseArg === 'all' ? ['prebuild', 'build'] : [phaseArg]

const run = (cmd, args, { stdio = 'inherit' } = {}) => {
  const result = spawnSync(cmd, args, { stdio })
  if (result.error) throw result.error
  if (result.status !== 0) {
    const err = new Error(`${cmd} ${args.join(' ')} failed with exit code ${result.status}`)
    err.exitCode = result.status
    throw err
  }
}

const canRun = (cmd) => {
  const result = spawnSync(cmd, ['--version'], { stdio: 'ignore' })
  return result.status === 0
}

const applyPatchWithGit = (patchFile) => {
  const check = spawnSync('git', ['apply', '--check', '--whitespace=nowarn', patchFile], {
    stdio: 'ignore'
  })

  if (check.status === 0) {
    run('git', ['apply', '--whitespace=nowarn', patchFile])
    return
  }

  const reverseCheck = spawnSync(
    'git',
    ['apply', '-R', '--check', '--whitespace=nowarn', patchFile],
    { stdio: 'ignore' }
  )

  if (reverseCheck.status === 0) return

  run('git', ['apply', '--whitespace=nowarn', patchFile])
}

if (!canRun('git')) {
  throw new Error('git is required to apply F-Droid patches')
}

for (const phase of phases) {
  const patchesDir = path.join(repoRoot, 'fdroid', 'patches', phase)
  if (!existsSync(patchesDir)) continue

  const patchFiles = readdirSync(patchesDir)
    .filter((f) => f.endsWith('.patch'))
    .sort()
    .map((f) => path.join(patchesDir, f))

  for (const patchFile of patchFiles) {
    applyPatchWithGit(patchFile)
  }
}
