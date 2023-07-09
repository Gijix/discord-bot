import { Command } from "../commandHandler.js";

export default new Command({
  name: "kick",
  description: "Kick mentionned user",
  permissions: ["KickMembers"],
  async handler (message) {
    if (message.mentions.members!.size === 1) {
      await message.mentions.members!.first()!.kick(message.arguments[0]);
    }
  }
})
