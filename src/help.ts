import { Message, PermissionsString } from "discord.js";
import Client from "./customClient.js";
import commandsMsg from "./commands/message/index.js";
import { musicInfos } from './music.js';

function fn (messsage: Message, bot: Client, prefix: string) {
  const helpBasic = commandsMsg.reduce((acc, com) => acc.concat("``"+prefix+com.name+"`` "+com.description+"\n" ) , '')
  const helpMusic = musicInfos.reduce((acc, info) => acc.concat("``"+prefix+info.name+"`` "+info.description+"\n" ), '')

  const embed = bot.createEmbed(
    "Purple",
    "Command List",
    bot.user!.username,
    {
      name: "Basics",
      value: helpBasic,
      inline: false
    },
    {
      name: "Music",
      value: helpMusic,
      inline: false
    }
  );

  messsage.channel.send({ embeds: [embed]});
}

const name = "help";

const permList: PermissionsString[] = ['SendMessages'];
const description = "";
export default { fn, name, permList, description };
