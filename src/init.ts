import { green } from 'kleur'
import autoRemove from './autoRemove'
import createTypes from './createTypes'
import createRollup from './createRollup'

import chokidar from 'chokidar'
import { log, messageInfo, logWarn } from './messages'

import viewLogo from './logo'

import {
  isAllowedFile,
  isDirectory,
  createDirSync,
  removeSync,
  getConfigDir,
  isJTSX
} from './utils'

export type TypeAgruments = {
  help: boolean
  input: string
  output: string

  remove: boolean | string
  types: string
  watch: boolean
  silent: boolean

  pkg: boolean | string
  tsc: boolean | string
  babel: boolean | string

  force: boolean
  minify: boolean
  pkgbeauty: boolean
}

const init = ({
  input,
  output,
  remove,
  types,
  watch,
  silent,
  pkg: _pkg,
  tsc: _tsc,
  babel: _babel,
  force,
  minify,
  pkgbeauty
}: TypeAgruments): void => {
  if (force = !!force) {
    logWarn('Force mode is enabled')
  }

  if (types && remove && isDirectory(types)) removeSync(types)
  autoRemove(remove, input, output, types, silent)
  if (types) createDirSync(types)

  let isFirstStart = true
  const compile = (): void => {
    const pkg = getConfigDir(_pkg, ['package.json'], silent)
    const tsc = getConfigDir(_tsc, ['tsconfig.json'], silent)
    const babel = getConfigDir(_babel,
      ['babel.config.json', 'babel.config.js', '.babelrc.json', '.babelrc.js'],
      silent)

    let rollupWatcher =
      createRollup(input, output, pkg, tsc, babel, types, force, minify, pkgbeauty, watch, silent)
    if (isFirstStart) {
      createTypes(types, input, output, pkgbeauty, watch, silent)
    }

    if (watch) {
      silent || messageInfo('Start of watchers')

      let isReady!: boolean
      const watchfiles = [input, /* pkg, */ tsc, babel].filter((v) => v)
      const watcher = chokidar.watch(watchfiles, { persistent: true })

      const resetWatchers = (): void => {
        isReady = false
        if (rollupWatcher) rollupWatcher.close(), rollupWatcher = null
        watcher.close().then(() => {
          console.log('\x1bc')
          silent || viewLogo()
          silent || messageInfo('Restarting watchers')
          compile()
        })
      }

      const watchFn = (_type: string, _file: string): void => {
        if (isReady && _file !== watchfiles[0]) {
          silent || log(green('WATCH: ') + _type + ': ' + _file)
          if (watchfiles.includes(_file) || (_type === 'add' || _type === 'unlink') &&
            isAllowedFile(_file, input) && isJTSX(_file)) resetWatchers()
        }
      }

      watcher.on('all', watchFn).on('ready', () => {
        isReady = true
      })
    }

    isFirstStart = false
  }

  compile()
  // await timeout(30000)
}

export default init
