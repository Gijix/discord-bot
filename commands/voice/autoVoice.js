const { VoiceState } = require("discord.js");
const temporary = [];

/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */
function fn(oldState, newState) {
    
  if (newState.channelID) {
    if(newState.channel.name === "auto-voice"){
    newState.guild.channels
      .create(
        `salon de ${newState.member.nickname ?? newState.member.user.username}`,
        {
          type: "voice",
          parent: newState.guild.channels.cache.find(
            (chan) => chan.name === "Salons vocaux"
          ),
        }
      )
      .then((chan) => {
        newState.member.voice.setChannel(chan).catch(e => console.error(e))
        temporary.push(chan.id);
      })
    }
  } else{
    if (temporary.includes(oldState.channelID) && oldState.channel.members.array().length === 0) {
      oldState.channel.delete().catch(e => console.error(e))
    }
  }
}

const name = "autoVoiceCreate";

module.exports = { fn, name };
