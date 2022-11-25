import { Command } from "../commandHandler.js";

export default new Command({
  name: "kick",
  description: "Kick mentionned user",
  permissions: ["KickMembers"],
  async handler (message) {
    const parsedMsg = message.content.split(" ");
    const reason = parsedMsg.slice(2).join(" ");

    if (message.mentions.members!.size === 1) {
      await message.mentions.members!.first()!.kick(reason);
    }
  }
})
