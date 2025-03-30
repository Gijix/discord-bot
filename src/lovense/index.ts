export const ToyCommandType = {
  VIBRATE: 'Vibrate',
  ROTATE: 'Rotate',
  PUMP: 'Pump',
  THRUSTING: 'Thrusting',
  FINGERING: 'Fingering',
  SUCTION: 'Suction',
  ALL: 'All',
  STOP: 'STOP'
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
export type IToyCommandValue = IToyCommandType[keyof IToyCommandType]

export interface ToyFunctionOptions {
  instructions: [IToyCommandValue, number][]
  duration: number,
  loopDuration?: number
  pauseDuration?: number
  toy: string
}

export interface ToyPatternOptions {
  rule: string
  pattern: string
  strength: string
  duration: number
  toy: string
}

export interface ToyPresetOptions {
  name: IToyPresetValue
  duration: number
}

interface PresetArg {
  id: string
  type: 'preset',
  options: ToyPresetOptions
}

interface PatternArg {
  id: string
  type: 'pattern',
  options: ToyPatternOptions
}

interface FunctionArg {
  id: string
  type: 'function',
  options: ToyFunctionOptions
}

export interface LovResponse {
  code: number
  message: string
  result?: boolean
  data?: any
}

export interface DeviceInfo {
  deviceCode: string
  online: boolean
  domain: string
  httpsPort: number
  wssPort: number
  platform: string
  appVersion: string
  appType: string
  toyList: ToyInfo[]
}

export interface ToyInfo {
  id: string
  name: string
  toyType: string
  nickname: any
  fVersion: number
  hVersion: string
  battery: number
  connected: boolean
}

const ListenEventDict = {
  'qrCodeSend': 'basicapi_get_qrcode_tc',
  'deviceUpdate': 'basicapi_update_device_info_tc',
  'qrCodeScanned' : 'basicapi_update_app_status_tc',
  'networkStatus' : 'basicapi_update_app_online_tc'
}

const EmitEventDict = {
  'requestQrcode': 'basicapi_get_qrcode_ts',
  'toyAction' : 'basicapi_send_toy_command_ts'
}

interface ListenEventArg {
  qrCodeSend: { code: number, message: string, data: { qrcodeUrl: string, qrcode: string, ackId: string}}
  deviceUpdate: DeviceInfo
  qrCodeScanned: any
  networkStatus: any
}

type ToyAction = PresetArg | FunctionArg | PatternArg

interface EmitEventArg {
  'requestQrcode': { ackId: string }
  'toyAction': ToyAction
}

export class LovenseIO {
  listeners: { event: keyof typeof ListenEventDict, cb: (arg: ListenEventArg[keyof typeof ListenEventDict]) => void | Promise<void>, once?: boolean}[] = []
  constructor (private socket: any, public userId: string, public token: string) {
    Object.keys(ListenEventDict).forEach(event => {
      socket.on(ListenEventDict[event], (res: any) => {
        this.listeners.forEach(listener => {
          if (listener.event === event) {
            listener.cb(JSON.parse(res))
            if (listener.once) {
              const index = this.listeners.indexOf(listener)
              this.listeners.splice(index, 1)
            }
          }
        })
      })
    })
  }

  static getToys () {
    
  }

  on <K extends keyof typeof ListenEventDict>(event: K, cb: (arg: ListenEventArg[K]) => Promise<void> | void) {
    this.listeners.push({ event, cb })
  }

  once <K extends keyof typeof ListenEventDict>(event: K, cb: (arg: ListenEventArg[K]) => Promise<void> | void) {
    this.listeners.push({ event, cb, once: true })
  }

  emit <K extends keyof typeof EmitEventDict>(event: K, arg: EmitEventArg[K] ) {
    if (event === 'requestQrcode') {
      this.socket.emit(EmitEventDict[event], arg)
    } else if (event === 'toyAction' && 'type' in arg) {
      let options = this.handleToyAction(arg)
      this.socket.emit(EmitEventDict[event], options)
    }
  }

  private function (id: string, type: IToyCommandValue) {
    this.emit('toyAction', {
      type: 'function',
      id,
      options: {
        instructions: [[type, 14]],
        duration: 5,
        toy: id
      }
    })
  }

  vibrate (id: string) {
    this.function(id, 'Vibrate')
  }

  thrust (id: string) {
    this.function(id, 'Thrusting')
  }

  finger (id: string) {
    this.function(id, 'Fingering')
  }

  pump (id: string) {
    this.function(id, 'Pump')
  }

  firework (id: string) {
    this.sendSimplePreset(id, 'fireworks')
  }

  pulse (id: string) {
    this.sendSimplePreset(id, 'pulse')
  }

  earthquake (id: string) {
    this.sendSimplePreset(id, 'earthquake')
  }

  wave (id: string) {
    this.sendSimplePreset(id, 'wave')
  }


  private sendSimplePreset (id: string, type: IToyPresetValue) {
    this.emit('toyAction', {
      type: 'preset',
      id,
      options: {
        duration: 15,
        name: type,
      }
    })
  }

  stop (id: string) {
    this.function(id, 'STOP')
  }

  private handleToyAction (arg: ToyAction) {
    let finalOptions
      switch (arg.type) {
        case 'function':
          let options1 = arg.options as ToyFunctionOptions
          finalOptions = {
            toy: arg.id,   
            command: "Function",
            action: options1.instructions.reduce((acc, tab) => `${acc}${tab[0]}:${tab[1]},`, ''),  
            timeSec: options1.duration,
            loopRunningSec: options1.loopDuration,
            loopPauseSec: options1.pauseDuration,            
            apiVer: 1
          }
          break
        case 'pattern':
          let options2 = arg.options as ToyPatternOptions
          finalOptions = {
            token: process.env.LOV_TOKEN,
            uid: process.env.LOV_IV,
            toy: arg.id,
            strength: options2.strength,
            command: "Pattern",
            timeSec: options2.duration,
            apiVer: 2
          }
          break
        case 'preset':
          let options3 = arg.options as ToyPresetOptions
          finalOptions = {
            token: process.env.LOV_TOKEN,
            uid: process.env.LOV_IV,
            toy: arg.id,   
            command: "Preset",
            name: options3.name,
            timeSec: options3.duration,
            apiVer: 1
          }
          break
      }

      return finalOptions
  }
}
