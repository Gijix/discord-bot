import 'dotenv/config'
import { log } from './logger.js'

export const envKeys = ['BOT_TOKEN', 'PREFIX'] as const

export const envCheck = () => {
  envKeys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`missing env variable ${key}`)
    }
  })

  log(`find all env variables (${envKeys.length})`)
}
