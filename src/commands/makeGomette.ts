import { SlashCommandBuilder } from "discord.js";
import { Command } from "../commandHandler.js";

export default new Command({
  name: 'makegomette',
  description: 'add new gomette in db',
  isSlash: true,
  builder: new SlashCommandBuilder().addStringOption((builder) => {
    builder.setDescription('the gomette name')
    builder.setName('gomette')
    builder.setRequired(true)

    return builder
  }).addStringOption((builder) => {
    builder.setDescription('the image url of the gomette')
    builder.setName('image-url')
    builder.setRequired(true)

    return builder
  }),
  async handler (interaction) {
    const name = interaction.options.getString('gomette', true)
    const imgUrl = interaction.options.getString('image-url', true)
    await this.db.gomette.create({
      data: {
        name,
        imageUrl: imgUrl
      }
    })

    await interaction.reply('succcessfuly created gomette')
  }
})
