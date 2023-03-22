import { GuildMember } from "discord.js";
import { Command } from "../commandHandler";

export default new Command({
  name: 'servers',
  description: 'list my server',
  isSlash: true,
  handler(interaction) {
    if (interaction.member instanceof GuildMember) {
      
    }
  }
})