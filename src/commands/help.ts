import { Command } from "../commandHandler.js";

export default new Command({
  name: "help",
  description: "display information for command name",
  permissions: ["SendMessages"],
  isSlash: true,
  async handler (interaction, bot) {
    const SlashList = bot.commandHandler.slashs.reduce((acc, com) => acc.concat("``"+com.name+"`` "+com.description+"\n" ) , '')
    const MessageList = bot.commandHandler.messages.reduce((acc, com) => acc.concat("``"+bot.prefix+com.name+"`` "+com.description+"\n" ) , '')
    const embed = bot.createEmbed(
      "Purple",
      "Command List",
      bot.user!.username,
      {
        name: "Messages",
        value: MessageList,
        inline: false
      },
      {
        name: "Slash",
        value: SlashList,
        inline: false
      }
    )

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    })
  }
})
