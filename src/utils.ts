import {
  statSync as fsStatSync,
  readdirSync as fsReaddirSync,
  rmdirSync as fsRmdirSync,
  unlinkSync as fsUnlinkSync,
  mkdirSync as fsMkdirSync
} from 'fs'
import path from 'path'
import {
  resolve as pathResolve,
  relative as pathRelative,
  parse as pathParse,
  join as pathJoin,
  dirname as pathDirname
} from 'path'

import isString from '@wareset-utilites/is/isString'
import trycatch from '@wareset-utilites/trycatch'

import { messageError, messageSuccess, messageWarn } from './messages'

export const toPosix = (str: string): string =>
  str.split(path.sep).join(path.posix.sep)

export const isAllowedFile = (file: string, input?: string): boolean =>
  !/\btests?\b|(^|\/|\\)_/.test(input ? pathRelative(input, file) : file)

export const existsStatSync = (
  directory: string
): false | ReturnType<typeof fsStatSync> => {
  return trycatch(() => fsStatSync(directory), false as any)
}

export const isDirectory = (directory: string): boolean => {
  return trycatch(() => fsStatSync(directory).isDirectory(), false)
}

// export const isFile = (directory: string): boolean => {
//   return trycatch(() => !fsStatSync(directory).isDirectory(), false)
// }

export const removeSync = (filepath: string): boolean => {
  const stat = existsStatSync(filepath)
  if (stat) {
    if (stat.isDirectory()) {
      fsReaddirSync(filepath).forEach((name) => {
        removeSync(pathResolve(filepath, name))
      })
      fsRmdirSync(filepath)
    } else fsUnlinkSync(filepath)
  }

  return !!stat
}

export const createDirSync = (
  filepath: string,
  throwler: any | ((...a: any) => any) = (): never =>
    messageError('Unable to create a folder:', filepath)
): boolean | never =>
  trycatch(() => (fsMkdirSync(filepath, { recursive: true }), true), throwler)

export const getConfigDir = (
  config: string | boolean,
  defs: string[],
  silent?: boolean
): string => {
  let res = ''

  if (config) {
    let Dirent: ReturnType<typeof existsStatSync>
    let root = pathResolve()
    const rootOrigin = root

    // prettier-ignore
    const getRes = (): string =>
      (res = (defs.map((v) => pathResolve(root, v))
        .filter((v) => (Dirent = existsStatSync(v)) && !Dirent.isDirectory())[0] || ''))

    if (isString(config)) {
      root = pathResolve(root, config)
      if ((Dirent = existsStatSync(root)) && !Dirent.isDirectory()) res = root
      else getRes()

      if (res)
        silent || messageSuccess(defs[0] + ' - was selected manually:', res)
      else messageError(defs[0] + ' - not found in "' + config + '":', root)
    } else {
      while (!getRes() && root !== (root = pathDirname(root)));
      if (!silent) {
        if (res) messageSuccess(defs[0] + ' - was selected automatically:', res)
        else messageWarn(defs[0] + ' - not found in:', rootOrigin)
      }
    }
  }

  return res
}

export const processExit = (cb: (...a: any[]) => void): void => {
  let isRun: boolean
  process.on('SIGBREAK', (...a) => {
    if (!isRun) cb(...a), (isRun = true)
    process.exit()
  })
  process.on('SIGINT', (...a) => {
    if (!isRun) cb(...a), (isRun = true)
    process.exit()
  })
  process.on('exit', (...a) => {
    if (!isRun) cb(...a), (isRun = true)
  })
}

export const isJTSX = (fileOrExt: string): boolean =>
  /\.[jt]sx?$/.test(fileOrExt)

export type TypeInputFile = {
  dir: string
  name: string
  ext: string
  final: string
  origin: string
}
export type TypeInputFiles = {
  include: TypeInputFile[]
  exclude: TypeInputFile[]
}
export const getInputFiles = (input: string): TypeInputFiles => {
  const include: TypeInputFile[] = []
  const exclude: TypeInputFile[] = []
  const cache: any = {}

  const each = (filepath: string): void => {
    const stat = existsStatSync(filepath)
    if (stat) {
      if (stat.isDirectory()) {
        fsReaddirSync(filepath).forEach((name) => {
          each(pathResolve(filepath, name))
        })
      } else {
        const origin = pathRelative(input, filepath)
        const { dir, name, ext } = pathParse(origin)
        if (isJTSX(ext)) {
          let final = 'index'
          if (name !== 'index') final = pathJoin(dir, name, final)
          else if (dir) final = pathJoin(dir, name)

          // prettier-ignore
          if (final in cache) {
            messageError('Duplicate paths for compiling files in "Input":',
              { File1: cache[final], File2: origin },
              'The final path for "' + final + '"'
            )}

          ;(isAllowedFile(origin) && (cache[final] = origin)
            ? include
            : exclude
          ).push(
            // prettier-ignore
            { dir, name, ext, final, origin }
          )
        }
      }
    }
  }

  each(input)
  return { include, exclude }
}
