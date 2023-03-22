import { SlashCommandBuilder } from "discord.js";
import { Command } from "../commandHandler.js";
import { ensureUser, getGomette } from "../database.js";

const gomette = await getGomette()

export default new Command({
  name: 'addgommette',
  description: 'add gomettte to user',
  builder: new SlashCommandBuilder().addUserOption((builder) => {
    builder.setDescription('the member who you want to add gomette')
    builder.setName('member')
    builder.setRequired(true)

    return builder
  }).addStringOption(builder => {
    builder.setName('gomette')
    builder.setDescription('the gomette you want to add')
    builder.addChoices(...gomette.map((gomette) => ({ name: gomette.name, value: gomette.name})))
    builder.setRequired(true)

    return builder
  }),
  isSlash: true,
  async handler (interaction) {
    const member = interaction.options.getUser('member', true)
    const gomette = interaction.options.getString('gomette', true)
    const user = await ensureUser(member.id)

    const userGomette = await this.db.userGomettes.findFirst({
      where: {
        userId: user.id,
        gomette: {
          name: gomette
        }
      }
    })

    if (userGomette) {
      await this.db.userGomettes.update({
        where: {
          id: userGomette.id
        },
        data: {
          count: userGomette.count + 1
        }
      })
    } else {
      await this.db.userGomettes.create({
        data: {
          gomette: {
            connect: {
              name: gomette
            }
          },
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })
    }

    await interaction.reply('succesfuly add gomette to user')
  }
})