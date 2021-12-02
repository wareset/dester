import { green, red } from 'kleur'

import {
  // statSync as fsStatSync,
  readdirSync as fsReaddirSync
  // rmdirSync as fsRmdirSync,
  // unlinkSync as fsUnlinkSync
} from 'fs'
import { resolve as pathResolve, parse as pathParse } from 'path'

import startsWith from '@wareset-utilites/string/startsWith'
import isString from '@wareset-utilites/is/isString'
import { log, messageWarn } from './messages'
import { removeSync, isAllowedFile, isJTSX } from './utils'

const __removeAndMessage__ = (
  removeDir: string,
  silent: boolean,
  prefix = 'auto',
  warn = false
): void => {
  if (removeSync(removeDir)) {
    silent || log(green(prefix + 'remove: ') + removeDir)
  } else if (warn) {
    silent || log(red(prefix + 'remove: file not found ') + removeDir)
  }
}

const autoremove = (
  remove: boolean | string,
  input: string,
  output: string,
  types: string,
  silent: boolean
): void => {
  if (remove) {
    if (isString(remove)) {
      const removeDir = remove.split(',').map((v) => pathResolve(v))
      removeDir.forEach((removeDir) => {
        if (startsWith(input, removeDir)) {
          silent ||
            messageWarn(
              '"Input" and "RemoveDir" should be different and separate:',
              { input, removeDir }
            )
        } else __removeAndMessage__(removeDir, silent, '', true)
      })
    } else if (output) {
      fsReaddirSync(input, { withFileTypes: true }).forEach((Dirent) => {
        let name = Dirent.name
        if (isAllowedFile(name)) {
          let isDir: boolean
          if (!Dirent.isDirectory()) isDir = true, name = isJTSX(name) ? pathParse(name).name : ''
          if (!isDir! && name === 'index') {
            // __removeAndMessage__(pathResolve(output, name + '.js'), silent)
            // __removeAndMessage__(pathResolve(output, name + '.mjs'), silent)
            types ||
              __removeAndMessage__(pathResolve(output, name + '.d.ts'), silent)
          } else if (name) {
            __removeAndMessage__(pathResolve(output, name), silent)
          }
        }
      })
    }
  }
}

export default autoremove
