import { Message, Client, PermissionsString } from "discord.js";
import { getVoiceConnection } from '@discordjs/voice';

export function fn(msg: Message, _bot: Client) {
  const connection = getVoiceConnection(msg.guild!.id)
  connection && connection.destroy()
}

export const name = "leave";
export const permList: PermissionsString[] = ["Administrator"];
export const description = "Make the bot leave the current voice channel";
