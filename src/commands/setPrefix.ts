import { Command } from "../handlers/commandHandler.js";
import { ApplicationCommandOptionType } from 'discord.js'

export default new Command({
  name: 'setprefix',
  description: 'set the prefix for message command for this guild',
  isSlash: true,
  guildOnly: true,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'prefix',
      description: 'the prefix you want for you guild',
      required: true
    }
  ],
  async handler (interaction) {
    const guild = await this.GuildManager.ensure(interaction.guildId)
    const prefix = interaction.options.getString('prefix', true)
    await guild.setPrefix(prefix)

    await interaction.reply(`successfuly set ${prefix} for guild ${interaction.guild?.name}`)
  }
})
