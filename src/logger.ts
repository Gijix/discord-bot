import chalk from 'chalk'
import dayjs from "dayjs"
import logSymbols from 'log-symbols';
import c from 'ansi-colors'

export const logLevelColors = {
  warn: "#ffa600",
  error: "#ff0000",
  info: "#00ffff",
  success: "#00ff00",
}

function hexToAinsi(color: string) {
  color = color.toString();
  var r = parseInt(color.substring(1, 3), 16);
  var g = parseInt(color.substring(3, 5), 16);
  var b = parseInt(color.substring(5, 7), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
}

function hex (hex: string) {
  return (string: string) => hexToAinsi(hex) + string
}

export type LogLevel = keyof typeof logLevelColors

export const loggerPattern = (
  text: string,
  level: LogLevel,
  secondaryText?: string
) => {
  return `${c.grey(dayjs().format("DD/MM/YY HH:mm"))} ${hex(
    logLevelColors[level]
  )(level.toUpperCase())}${
    secondaryText ? " " + c.magentaBright(`${secondaryText}`) : ""
  } ${text}`
}

export function log(text: string, section?: string) {
  console.log(loggerPattern(text, "info", section))
}

export function error(text: string | Error, _path: string, full?: boolean) {
  console.error(
    logSymbols.error,
    loggerPattern(
      text instanceof Error ? text.message.split("\n")[0] : text,
      "error",
      _path
    )
  )
  if (full && text instanceof Error) console.error(text)
}

export function warn(text: string, section?: string) {
  console.warn(logSymbols.warning, loggerPattern(text, "warn", section))
}

export function success(text: string, section?: string) {
  console.log(logSymbols.success, loggerPattern(text, "success", section))
}

export function createLogger(section: string) {
  return {
    log: (text: string) => log(text, section),
    error: (text: string | Error, full?: boolean) => error(text, section, full),
    warn: (text: string) => warn(text, section),
    success: (text: string) => success(text, section),
  }
}
