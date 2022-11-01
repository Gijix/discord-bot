import { Message, PermissionsString } from "discord.js";
import Client from "./customClient";
import commandsMsg from "./commands/message/index";
import { musicInfos } from './music';

function fn (messsage: Message, bot: Client, prefix: string) {
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
    "Purple",
    "Command List",
    bot.user!.username,
    {
      name: "Basics",
      value: helpBasic(),
      inline: false
    },
    {
      name: "Music",
      value: helpMusic(),
      inline: false
    }
  );

  messsage.channel.send({ embeds: [embed.data]});
}

const name = "help";

const permList: PermissionsString[] = ['SendMessages'];
const description = "";
export default { fn, name, permList, description };
