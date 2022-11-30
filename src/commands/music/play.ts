import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'play',
  description: 'add a song to the server queue and init the queue',
  async handler (message, bot) {
    const handler = bot.checkPlayerCondition(message)

    if (!handler) return

    const playerQueue = handler.player.createQueue(message.guildId)

    await handler.queue?.join(message.channelId)
    await playerQueue.play(message.arguments[0]).catch((_) => {
      if (!handler.queue) playerQueue.stop();
    });
  }
})