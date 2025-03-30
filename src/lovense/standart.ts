import axios from 'axios'
import { genSaltSync, hashSync } from 'bcrypt'
import { LovResponse } from '.'

export const ToyCommandType = {
  VIBRATE: 'Vibrate',
  ROTATE: 'Rotate',
  PUMP: 'Pump',
  THRUSTING: 'Thrusting',
  FINGERING: 'Fingering',
  SUCTION: 'Suction',
  ALL: 'All'
} as const

export const ToyPreset = {
  PULSE: 'pulse',
  FIREWORKS: 'fireworks',
  EARTHQUAKE: 'earthquake',
  WAVE: 'wave'
} as const

export type IToyPreset = typeof ToyPreset

export type IToyPresetValue = IToyPreset[keyof IToyPreset]

export type IToyCommandType = typeof ToyCommandType

export interface ToyFunctionOptions {
  instructions: [IToyCommandType[keyof IToyCommandType], number][]
  duration: number,
  loopDuration?: number
  pauseDuration?: number
  intensity: number
  toyId: string
}

export interface ToyPatternOptions {
  rule: string
  pattern: string
  strength: string
  duration: string
  toyId: string
}

export interface ToyPresetOptions {
  name: string
  duration: string
  toyId: string
}

const BASE_URL = 'https://api.lovense-api.com/api/lan'
const V2_URL = 'https://api.lovense-api.com/api/lan/v2'
const salt = genSaltSync()

export async function getQRCodeUrl(discordId: string) {
  const id = process.env.LOV_IV
  const body = {
    token: process.env.LOV_TOKEN,  // Lovense developer token
    uid: id,  // user id on your website
    uname: 'ihavent', // user nickname on your website
    utoken: hashSync(discordId, salt),  // This is for your own verification purposes. We suggest you to generate a unique token/secret for each user. This allows you to verify the user and avoid others faking the calls
    v: 2
  }

  const { data } = await axios.post<LovResponse>(BASE_URL + '/getQrCode', body)
  if (!data.result) {
    throw new Error(data.message)
  }


  return data.data
}

export async function getToys () {
  return (await axios.post<LovResponse>(V2_URL + '/getToys', {
    token: process.env.LOV_TOKEN,
    uid: process.env.LOV_IV,
    apiVer: 1
  })).data
}

export async function stopToy (toyId: string) {
  return (await axios.post<LovResponse>(V2_URL + '/command', {
    token: process.env.LOV_TOKEN,
    uid: process.env.LOV_IV,
    toy: toyId,
    command: 'Function',
    action: 'Stop',
    apiVer: 1
  })).data
}

export async function sendFunction (options: ToyFunctionOptions) {
  const result = await axios.post<LovResponse>(V2_URL + '/command', {
    token: process.env.LOV_TOKEN,
    uid: process.env.LOV_IV,
    toy: options.toyId,   
    command: "Function",
    action: options.instructions.reduce((acc, tab) => `${acc}${tab[0]}:${tab[1]},`, ''),  
    timeSec: options.duration,
    loopRunningSec: options.loopDuration,
    loopPauseSec: options.pauseDuration,            
    apiVer: 1
  })

  return result.data
}

export async function sendPattern (options: ToyPatternOptions) {
  const result = await axios.post<LovResponse>(V2_URL + '/command', {
    token: process.env.LOV_TOKEN,
    uid: process.env.LOV_IV,
    toy: options.toyId,
    strength: options.strength,
    command: "Pattern",
    timeSec: options.duration,
    apiVer: 2
  })

  return result.data
}

export async function sendPreset (options: ToyPresetOptions) {
  const result = await axios.post<LovResponse>(V2_URL + '/command', {
    token: process.env.LOV_TOKEN,
    uid: process.env.LOV_IV,
    toy: options.toyId,   
    command: "Preset",
    name: options.name,
    timeSec: options.duration,
    apiVer: 1
  })

  return result.data
}
