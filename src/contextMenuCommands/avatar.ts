import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { ContextMenuCommand } from "../contextMenuHandler.js";

export default new ContextMenuCommand({
  type: ApplicationCommandType.User,
  name: 'avatar',
  async handler (interaction) {
    const embed = new EmbedBuilder({
      image: {
        url: interaction.targetUser.displayAvatarURL({ size: 2048 }),
        width: 2048,
        height: 2048,
      }
    })

    await interaction.reply({ embeds: [embed], ephemeral: true })
  }
})