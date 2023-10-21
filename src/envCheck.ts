import 'dotenv/config'
import { log } from './util/logger.js'

export const envKeys = ['BOT_TOKEN', 'PREFIX', 'ADMIN_ID', 'CLIENT_ID', 'DATABASE_URL', 'OUTDIR', 'JWT_TOKEN', 'LOV_IV'] as const

export const envCheck = () => {
  envKeys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`missing env variable ${key}`)
    }
  })

  log(`find all env variables (${envKeys.length})`)
}
