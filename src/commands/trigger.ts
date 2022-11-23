import { Command } from "../commandHandler.js";

export default new Command({
  name: 'trigger',
  description: 'trigger',
  isSlash: true,
  async handler(interaction, bot) {
    await bot.modalHandler.cache.get('modal1')!.trigger(interaction)
  }
})
