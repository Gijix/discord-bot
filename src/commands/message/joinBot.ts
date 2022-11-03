import { Message, PermissionsString } from "discord.js";
import { joinVoiceChannel } from '@discordjs/voice';

export function fn(msg: Message) {
  let arg = msg.content.split(" ").slice(1).join(" ");
  const guild  = msg.guild!;
  const channelJoin = guild.channels.cache.find(chan => chan.name === arg)
  channelJoin && joinVoiceChannel({
    channelId:channelJoin.id,
    guildId:guild.id,
    adapterCreator:guild.voiceAdapterCreator
  })
  
}

export const name = "join";
export const permList: PermissionsString[] = ["Administrator"];
export const description = "Make the bot join current voice channel";
