import { VoiceState, ChannelType, CategoryChannel, VoiceChannel, Collection, Guild } from "discord.js";

let temporary: string[] = [];

const channelID = "870994373159039017";
const categoryID = ""


function createAutoVoice (name: string) {
  
}

export class AutoVoiceManager {
  // static channels: Collection<string, VoiceChannel> = new Collection()
  // static async onVoiceEnter (voiceState: VoiceState & { channelId: string }) {
  //   const creationChannel = this.channels.get(voiceState.channelId)!

  //   const channel = new VoiceChannel()
  // }
  // temporaryChannels: Collection<string, VoiceChannel> = new Collection() 
}

export function fn(oldState: VoiceState, newState: VoiceState) {
  if (newState.channelId) {
    if (newState.channel!.id === channelID) {
      const createChannel = newState.guild.channels.cache.get(channelID) as VoiceChannel;
      newState.guild.channels
        .create({ 
          name: `salon de ${
            newState.member!.nickname ?? newState.member!.user.username
          }`,
          type: ChannelType.GuildVoice,
          parent: newState.guild.channels.cache.get(categoryID) as CategoryChannel,
          position: createChannel.position + 1,
          permissionOverwrites: [
            {
              id: newState.id,
              allow: [
                "DeafenMembers",
                "MuteMembers",
                "ManageChannels",
                "MoveMembers",
              ],
            },
          ],
        })
        .then((chan) => {
          newState.member!.voice.setChannel(chan).catch((e) => console.error(e));
          temporary.push(chan.id);
        });
    }
  } else if ( 
    temporary.includes(oldState.channelId!) &&
    oldState.channel!.members.size === 0
    ) {
      oldState.channel!
        .delete()
        .then(
          () => (temporary = temporary.filter((x) => x === oldState.channelId))
        )
        .catch((e) => console.error(e));
  }
}
