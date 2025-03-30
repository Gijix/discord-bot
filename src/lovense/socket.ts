import axios from "axios"
import { genSaltSync, hashSync } from "bcrypt"
import { LovenseIO, LovResponse } from "."
import io from 'socket.io-client'
import { Collection } from "discord.js"

const BASE_URL = 'https://api.lovense-api.com/api/basicApi'
// const V2_URL = 'https://api.lovense-api.com/api/lan/v2'
const salt = genSaltSync()

export class SocketManager {
  private async getSocketUrl (token: string) {
    const { data } = await axios.post<LovResponse>(BASE_URL + '/getSocketUrl', {
      platform: 'ihavent',
      authToken: token
    })
  
    if (!(data.message === 'Success')) {
      throw  new Error(data.message)
    }

    return data.data as { socketIoPath: string , socketIoUrl: string}
  }

  private async getAuthToken (token: string) {
    const { data } = await axios.post<LovResponse>(BASE_URL + '/getToken', {
      token: process.env.LOV_TOKEN,
      uid: process.env.LOV_IV,
      unam: 'ihavent',
      utoken: token
    })
  
    if (!(data.message === 'Success')) {
      throw  new Error(data.message)
    }
    
    return data.data.authToken as string
  }
  private async authorize (token: string) {
    const authToken = await this.getAuthToken(token)
    const { socketIoPath, socketIoUrl } = await this.getSocketUrl(authToken)

    return this.initiliazeSocket(socketIoUrl, socketIoPath)
  }

  private cache = new Collection<string, LovenseIO>()

  private initiliazeSocket (url: string, path: string) {
    return io(url ,{
      path,
      transports: ['websocket']
    })
  }

  async getInstance (id: string) {
    const token = hashSync(id, salt)
    let lovInstance = this.cache.get(token)

    if (lovInstance) return lovInstance

    const newToken = hashSync(id, salt)

    const io = await this.authorize(newToken)

    lovInstance = new LovenseIO(io, id, newToken)

    this.cache.set(token, lovInstance)

    return lovInstance
  }

  delete (id: string) {
    return this.cache.delete(hashSync(id, salt))
  }
}
