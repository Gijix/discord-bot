const { Message, Permissions } = require("discord.js");
const Client = require("./customClient");
const commandsMsg = require("./commands/message/index");
const {musicInfos} = require('./music')
/**
 *
 * @param {Message} messsage
 * @param {Client} bot
 * @param {string} prefix: ;
 */
function fn(messsage, bot,prefix) {
  const helpBasic = () => {
    let str = ""
    commandsMsg.forEach(com => {
      str = str.concat("``"+prefix+com.name+"`` "+com.description+"\n" )
    })
    return str
  };

  const helpMusic = () => {
    let str = ""
    musicInfos.forEach(info => {
      str = str.concat("``"+prefix+info.name+"`` "+info.description+"\n" )
    })
    return str
  };

  const embed = bot.createEmbed(
    "PURPLE",
    "Command List",
    bot.user.username,
    {
      name: "Basics",
      value: helpBasic(),
    },
    {
      name: "Music",
      value: helpMusic(),
    }
  );

  messsage.channel.send(embed);
}

const name = "help";
/**
 * @type {Permissions}
 */
const permList = ["SEND_MESSAGES"];
const description = "";
module.exports = { fn, name, permList, description };