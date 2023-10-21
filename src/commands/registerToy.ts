import { Command } from "../handlers/commandHandler.js";
import { getQRCodeUrl } from '../lovense.js'

export default new Command({
  name: 'registertoy',
  description: 'get a qrcode url to register your toy in the bot',
  isSlash: true,
  async handler (interaction) {
    const user = await this.UserManager.ensure(interaction.user.id)

    if (user.hasToy()) {
      await interaction.reply({ ephemeral: true, content: 'Toy already register'})
      return
    }

    await interaction.reply({ ephemeral: true, content: await getQRCodeUrl(interaction.user.id)})
  }
})