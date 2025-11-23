import { Command } from "../../handlers/commandHandler.js";
let test = 0
let test1 = 0
export default new Command({
  name: 'play',
  description: 'add a song to the server queue and init the queue',
  guildOnly: true,
  async handler (message) {
    console.log('trigger play')
    const player = this.playerManager.ensure(message.guildId)
    await player.play(message.content.split(' ')[1], message.member)

    if (player.LastPushedInQueue) {
      console.log(test++)
      await message.send('adding in queue: ' + player.queue[0].name)
    } else {
      console.log(test1++)
      await message.send('playing ' + player.currentAudio?.streamInfo.name)
    }
  }
})
