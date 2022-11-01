const { Message, Permissions, Collection } = require("discord.js");
/**
 *
 * @param {Message} message
 */
async function fn(message) {
  /**
   * @type {Collection<string,Message>}
   */
  let messages
  do{
  messages = (await message.channel.messages.fetch({limit:100}))
  message.channel.bulkDelete(messages)
  }
  while(messages.size>= 2)
}

const name = "clear";
/**
 * @type {Permissions}
 */
const permList = ["MANAGE_MESSAGES"];
const description = "Delete all message of current channel";
module.exports = { fn, name, description, permList };
