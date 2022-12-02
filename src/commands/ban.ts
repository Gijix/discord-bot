import { Command } from "../commandHandler.js";

export default new Command({
  name : "ban",
  description: "ban mentionned user",
  permissions: ["BanMembers"],
  async handler (message) {
    console.log(message.arguments)
    const reason = message.arguments[1]

    // if (message.mentions.members!.size === 1) {
    //   await message.mentions.members!.first()!.ban({
    //     reason
    //   });
    // }
  }
})
