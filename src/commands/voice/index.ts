import { VoiceState } from 'discord.js'
import mapFolder from 'map-folder'
import { dirname } from '../../utils.js'

const path = mapFolder(dirname(import.meta), {
  exclude: ["index.js"],
})

interface commandCallback {
  (oldstate: VoiceState, newState: VoiceState): void
}

interface command {
  fn: commandCallback
  name: string
}

const result: command[] = []

Object.entries<{ path: string }>(path.entries).forEach(async(obj) => {
    result.push(await import(obj[1].path))
})

export default result
