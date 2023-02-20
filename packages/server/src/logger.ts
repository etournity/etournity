/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk'
import dayjs from 'dayjs'
import tinycolor from 'tinycolor2'

enum Level {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  VERBOSE = 'verbose',
}

export class Logger {
  basePath?: string[] | string

  constructor(basePath?: string[] | string) {
    this.basePath = basePath
  }

  // The same as debug, but only for very log cluttering information, can be hidden with a log level
  verbose = (message: any, path?: string[] | string) =>
    doLog(Level.VERBOSE) &&
    console.debug(this.baseLogger(message, Level.DEBUG, path))

  debug = (message: any, path?: string[] | string) =>
    doLog(Level.DEBUG) &&
    console.debug(this.baseLogger(message, Level.DEBUG, path))

  info = (message: any, path?: string[] | string) =>
    doLog(Level.INFO) &&
    console.info(this.baseLogger(message, Level.INFO, path))

  warn = (message: any, path?: string[] | string) =>
    doLog(Level.WARN) &&
    console.warn(this.baseLogger(message, Level.WARN, path))

  error = (message: any, path?: string[] | string) =>
    doLog(Level.ERROR) &&
    console.error(this.baseLogger(message, Level.ERROR, path))

  baseLogger = (message: string[], level: Level, path?: string[] | string) => {
    const pathArray = Array.isArray(path) ? path : [path]
    const basePathArray = Array.isArray(this.basePath)
      ? this.basePath
      : [this.basePath]

    const finalPath =
      path && this.basePath
        ? `${basePathArray.join('/')}/${pathArray.join('/')}: `
        : this.basePath
        ? `${basePathArray.join('/')}: `
        : path
        ? `${pathArray.join('/')}: `
        : ''

    const levelColor =
      level === Level.DEBUG || level === Level.VERBOSE
        ? chalk.blue
        : level === Level.INFO
        ? chalk.green
        : level === Level.WARN
        ? chalk.yellow
        : chalk.red

    const styledDateTime = chalk.gray(
      dayjs().format(
        `${process.env.ETY_ENV === 'local' ? '' : 'YYYY-MM-DD '}HH:mm:ss`
      )
    )
    const styledLevel = levelColor.bold(
      `[${level.toUpperCase().padEnd(5, ' ')}]`
    )
    const pathColor = tinycolor(stringToColor(finalPath.split('/')[0]))
      .brighten(10)
      .lighten(5)
      .toHex()
    const styledPath = chalk.hex(pathColor).bold(finalPath)
    const styledPackage = chalk.gray('[S]')

    return `${styledDateTime} ${styledPackage} ${styledLevel} ${styledPath}${message}`
  }
}

const stringToColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }

  return color
}

const doLog = (level: Level) => {
  const logLevel = process.env.ETY_LOG_LEVEL?.toLowerCase()
  switch (level) {
    case Level.VERBOSE:
      return logLevel === Level.VERBOSE
    case Level.DEBUG:
      return logLevel === Level.DEBUG || logLevel === Level.VERBOSE
    case Level.INFO:
      return (
        logLevel === Level.DEBUG ||
        logLevel === Level.INFO ||
        logLevel === Level.VERBOSE
      )
    case Level.WARN:
      return (
        logLevel === Level.DEBUG ||
        logLevel === Level.INFO ||
        logLevel === Level.WARN ||
        logLevel === Level.VERBOSE
      )
    case Level.ERROR:
      return (
        logLevel === Level.DEBUG ||
        logLevel === Level.INFO ||
        logLevel === Level.WARN ||
        logLevel === Level.ERROR ||
        logLevel === Level.VERBOSE
      )
    default:
      return logLevel === Level.DEBUG
  }
}
