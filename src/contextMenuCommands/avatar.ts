import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { ContextMenuCommand } from "../contextMenuHandler.js";

export default new ContextMenuCommand({
  type: ApplicationCommandType.User,
  name: 'avatar',
  async handler (interaction) {
    const embed = new EmbedBuilder({
      image: {
        url: interaction.targetUser.displayAvatarURL({ size: 4096 }),
        width: 4096,
        height: 4096,
      }
    })

    await interaction.reply({ embeds: [embed], ephemeral: true })
  }
})
