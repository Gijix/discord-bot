import { MusicPlayer } from "../musicPlayer.js"

export const checkPresence = (_target: MusicPlayer, _key: string, descriptor: TypedPropertyDescriptor<Function>) => {
  const baseFn = descriptor.value!
  descriptor.value =  function (...arg: any[]) {
    console.log(this)
    return baseFn(...arg)
  }
}
