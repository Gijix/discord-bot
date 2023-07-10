import { ButtonBuilder, ButtonStyle, ActionRowBuilder, ChatInputCommandInteraction, MessageActionRowComponentBuilder } from 'discord.js'
import myClient from './customClient'

async function createTicketToolComponent (this: myClient<true> ,id: string, interaction: ChatInputCommandInteraction, description: string, img?: string) {
  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  const button = new ButtonBuilder()
  button.setCustomId(id).setStyle(ButtonStyle.Primary).setLabel('open a new ticket')
  row.addComponents(button)
  const embed  = this.createEmbed(
    'Purple',
    'TicketTool',
    this.user.username,
    {
      inline: true,
      name: 'About',
      value: description
    },
    
    ).setImage(img || null)

    await interaction.reply({
      embeds: [embed],
      components: [row]
    })
}