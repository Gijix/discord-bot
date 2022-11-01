import { VoiceState } from 'discord.js'
import mapFolder from 'map-folder'

const path = mapFolder(__dirname, {
  exclude: ["index.js"],
})

interface commandCallback {
  (oldstate: VoiceState, newState: VoiceState): void
}

interface command {
  fn: commandCallback
  name: string
}

/**
 * @type {command[]}
 */
const result: command[] = []

Object.entries<{ path: string }>(path.entries).forEach(async(obj) => {
    result.push(await import(obj[1].path))
})

export default result
