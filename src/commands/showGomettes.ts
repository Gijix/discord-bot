import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import path from "path";
import { Command } from "../commandHandler.js";
import { ensureUser } from "../database.js";

export default new Command({
  name: 'showgomettes',
  description: 'show member gomette',
  builder: new SlashCommandBuilder().addUserOption((builder) => {
    builder.setName('member')
    builder.setDescription("the gommettes's member that you want to see")
    builder.setRequired(true)

    return builder
  }),
  isSlash: true,
  async handler (interaction) {
    const member = interaction.options.getUser('member', true)
    const user = await ensureUser(member.id)
    const userGomettes = await this.db.user.findUnique({
      where: {
        id: user.id
      }
    }).gomettes()

    if (!userGomettes || !userGomettes.length) {
      await interaction.reply('user has no go')
      return
    }

    const embedList: EmbedBuilder[] = []
    const fileList: AttachmentBuilder[] = []

    await Promise.all(userGomettes.map(async (userGomette) => {
      const gomette = (await this.db.gomette.findFirst({
        where: {
          id: userGomette.gometteId
        }
      }))!

      const file = new AttachmentBuilder(path.join(process.cwd(), 'images', gomette.imageUrl));
      fileList.push(file)
      embedList.push(new EmbedBuilder({
        title: gomette.name,
        image: {
          url: 'attachment://' + gomette.imageUrl,
          width: 300,
          height: 300
        },
        fields: [{
          name: 'nombre',
          value: userGomette.count.toString()
        }]
      }))

    }))

    await interaction.reply({
      embeds: embedList,
      files: fileList
    })
  }
})