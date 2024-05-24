import { Command } from "../handlers/commandHandler.js";
import { filename } from 'dirname-filename-esm'

export default new Command({
  name: 'delete',
  description: 'Delete a number of message or all of specific user',
  permissions: ["ManageMessages"],
  isActivated: false,
  guildOnly: true,
  arguments: [
    {
      name: 'member',
      type: 'member',
      required: true
    }
  ],
  async handler (message) {
    message.arguments.member
    let messages  = [...(await message.channel.messages.fetch()).values()]

    for (let i = 0 ; i < messages.length; i++) {
      const current = messages[i]

      if (current.member && (current.member.id === message.arguments.member.id)) {
        await message.delete()
      }
    }
  }
})
