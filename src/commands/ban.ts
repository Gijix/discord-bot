import { Command } from "../commandHandler.js";

export default new Command({
  name : "ban",
  description: "ban mentionned user",
  permissions: ["BanMembers"],
  async handler (message) {

    // if (message.mentions.members!.size === 1) {
    //   await message.mentions.members!.first()!.ban({
    //     reason
    //   });
    // }
  }
})
