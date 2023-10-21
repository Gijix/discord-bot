import { ButtonStyle } from "discord.js";
import { ComponentRow } from "../handlers/componentHandler.js";

export default new ComponentRow({
  name: 'validate-toy',
  type: 'Button',
  make (builder) {
    builder.setLabel('validate')
    builder.setCustomId('validate-toy')
    builder.setStyle(ButtonStyle.Primary)
  },
  async handler (interaction) {
    
  }
})