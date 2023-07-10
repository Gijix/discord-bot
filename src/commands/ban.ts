import { Command } from "../handlers/commandHandler.js";

export default new Command({
  name : "ban",
  description: "ban mentionned user",
  permissions: ["BanMembers"],
  async handler (message) {
    if (message.mentions.members!.size === 1) {
      await message.mentions.members!.first()!.ban({
        reason: message.arguments[0]
      });
    }
  }
})
