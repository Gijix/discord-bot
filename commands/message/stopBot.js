const { Message, Client } = require("discord.js");
/**
 *
 * @param {Message} msg
 * @param {Client} bot
 */
function fn(msg, bot) {
  msg.reply("i will disconnect in 5 seconds").then((message) =>
    setTimeout(() => {
      message
        .delete({timeout:2500})
        .then(() => bot.destroy())
        .catch((e) => console.error(e));
    },5000)
  );
}
const name = "stopBot";

module.exports = { fn, name };
