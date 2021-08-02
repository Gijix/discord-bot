const { VoiceState } = require("discord.js");
let temporary = [];
const channelID = '870994373159039017'
/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */
function fn(oldState, newState) {
  if (newState.channelID) {
    if (newState.channel.id === channelID) {
      newState.guild.channels
        .create(
          `salon de ${
            newState.member.nickname ?? newState.member.user.username
          }`,
          {
            type: "voice",
            parent: newState.guild.channels.cache.find(
              (chan) => chan.name === "Salons vocaux"
            ),
          }
        )
        .then((chan) => {
          newState.member.voice.setChannel(chan).catch((e) => console.error(e));
          temporary.push(chan.id);
          chan.updateOverwrite(newState.member, {
            MANAGE_CHANNELS: true,
          });
        });
    }
  } else {
    if (
      temporary.includes(oldState.channelID) &&
      oldState.channel.members.array().length === 0
    ) {
      oldState.channel
        .delete()
        .then(
          () => (temporary = temporary.filter((x) => x === oldState.channelID))
        )
        .catch((e) => console.error(e));
    }
  }
}

const name = "autoVoiceCreate";

module.exports = { fn, name };
