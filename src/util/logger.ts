import dayjs from "dayjs"
import logSymbols from 'log-symbols';
import c from 'ansi-colors'

export const logLevelColors = {
  warn: "#ffa600",
  error: "#ff0000",
  info: "#00ffff",
  success: "#00ff00",
  debug: "#f4dc04"
} satisfies Record<string,HexString>

type HexString = `#${string}`

function hexToAinsi(color: HexString) {
  const str = color.toString();
  const r = parseInt(str.substring(1, 3), 16);
  const g = parseInt(str.substring(3, 5), 16);
  const b = parseInt(str.substring(5, 7), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
}

function hex (hex: HexString) {
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
  console.log(logSymbols.info, loggerPattern(text, "info", section))
}

export function error(value: any, _path: string, full?: boolean) {
  if (!(typeof value === 'string' || value instanceof Error)) {
    console.error(logSymbols.error, value)
    return
  }

  console.error(
    logSymbols.error,
    loggerPattern(
      value instanceof Error ? value.message.split("\n")[0] : value,
      "error",
      _path
    )
  )
  if (full && value instanceof Error) console.error(value)
}

export function warn(text: string, section?: string) {
  console.warn(logSymbols.warning, loggerPattern(text, "warn", section))
}

export function success(text: string, section?: string) {
  console.log(logSymbols.success, loggerPattern(text, "success", section))
}

export function debug (text: string, section?: string) {
  console.debug(logSymbols.info, loggerPattern(text, "debug", section))
}

export function createLogger(section: string) {
  return {
    log: (text: string) => log(text, section),
    error: (text: string | Error, full?: boolean) => error(text, section, full),
    warn: (text: string) => warn(text, section),
    success: (text: string) => success(text, section),
    debug: (text: string) => debug(text, section)
  }
}

