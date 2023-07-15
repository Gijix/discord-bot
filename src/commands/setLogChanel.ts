import { Command } from "../handlers/commandHandler.js";

export default new Command({
  name: 'setlogchanel',
  description: 'choose the channel where the log will be send',
  isSlash: true,
  permissions: ['Administrator'],
  async handler (interaction) {
    const channel = interaction.channel
    if (channel) {
      const guild = await this.GuildManager.ensure(interaction.guildId)
      await guild.setLogChannel(channel.id)
      await interaction.reply({
        ephemeral: true,
        content: `succesfuly set logChannel in ${channel.name} with id ${channel.id}`
      })
    } else {
      await interaction.reply({
        ephemeral: true,
        content: 'you are not in GuildBasedTextChannel !'
      })
    }
  }
})