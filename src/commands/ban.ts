import { Command } from "../commandHandler.js";

export default new Command({
  name : "ban",
  description: "ban mentionned user",
  permissions: ["BanMembers"],
  async handler (message) {
    const parsedMsg = message.content.split(" ");
    const reason = parsedMsg.slice(2).join(" ");

    if (message.mentions.members!.size === 1) {
      await message.mentions.members!.first()!.ban({
        reason
      });
    }
  }
})
