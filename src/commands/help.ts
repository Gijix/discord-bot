import { Command } from "../commandHandler.js";

export default new Command({
  name: "help",
  description: "display information for command name",
  permissions: ["SendMessages"],
  isSlash: true,
  async handler (interaction) {
    const SlashList = this.commandHandler.slashs.filter((command) => command.isActivated).reduce((acc, com) => acc.concat("``"+com.name+"`` "+com.description+"\n" ) , '')
    const MessageList = this.commandHandler.messages.filter((command) => command.isActivated).reduce((acc, com) => acc.concat("``"+this.prefix+com.name+"`` "+com.description+"\n" ) , '')
    const embed = this.createEmbed(
      "Purple",
      "Command List",
      this.user.username,
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
