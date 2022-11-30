import 'dotenv/config'

export const envKeys = ['BOT_TOKEN', 'PREFIX'] as const

envKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`missing en variable ${key}`)
  }
})
