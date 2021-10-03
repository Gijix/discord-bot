const play = require("play-dl");
const { SoundCloud, Spotify } = require("play-dl");
const { Message } = require("discord.js");
const Client = require("./customClient");
const {
  createAudioPlayer,
  getVoiceConnection,
  createAudioResource,
  AudioResource,
} = require("@discordjs/voice");
class customPlayer {
  player = createAudioPlayer();
  /**
   * @typedef media
   * @property {AudioResource<any>} audioRessource
   * @property {play.YouTube} streamInfo
   */
  /**
   * @type {media[]}
   */
  queue = [];
  /**
   * @param {Message} message
   */
  checkPresence(message) {
    return message.member.voice.channelId !== message.guild.me.voice.channelID;
  }
  playNext() {
    console.log("gonna start the queue");
    this.player.play(this.queue.shift().audioRessource);

    return this.player;
  }
  /**
   * @param {play.YouTube} streamInfo
   */
  async getAudioRessource(streamInfo) {
    console.log("gonna get audio ressource");
    const playMedia = (
      await play.search(streamInfo.name || streamInfo.title)
    ).shift();
    const { stream, type } = await play.stream(playMedia.url);
    const audioRessource = createAudioResource(stream, { inputType: type });
    console.log(streamInfo.type);
    return { audioRessource, streamInfo };
  }
  /**
   *
   * @param {string} baseUrl
   * @returns {Promise<play.YouTube | play.Spotify | play.SoundCloud>}
   */
  async getMedia(baseUrl) {
    console.log("getting media");
    const validation = await play.validate(baseUrl);
    console.log(validation);
    if (validation.startsWith("yt")) {
      return await play.search(baseUrl);
    } else if (validation.startsWith("so")) {
      return await play.soundcloud(baseUrl);
    } else if (validation.startsWith("sp")) {
      console.log("gonna return spotify track");
      return await play.search(baseUrl,{source:{spotify:"track"}});
    }
    console.log("error returning " + validation);
  }
  /**
   *
   * @param {Message} message
   * @param {string} prefix
   * @param {Client} bot
   */
  async play(message, prefix, bot) {
    if (
      message.guild.me.voice.channelId !== message.member.voice.channelId &&
      message.guild.me.voice.channelId
    )
      return;
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g)
      .slice(1)
      .join(" ");
    const connection = getVoiceConnection(message.guildId) || bot.join(message);
    const streamInfo = await this.getMedia(args);
    console.log(" gonna add to queue" , streamInfo);
    if (streamInfo.tracks) {
      console.log("valide tracklist");
      this.queue.push(
        ...streamInfo.tracks.map(
          async (track) => (track = await this.getAudioRessource(track))
        )
      );
    } else if (streamInfo.type === "playlist" || streamInfo.type === "album") {
      console.log("valide playlist");
      for (let i = 0; i < streamInfo.total_pages; i++) {
        console.log("add to queue");
        this.queue.push(
          ...streamInfo.page(i).map(async (video) => {
            video = await this.getAudioRessource(video);
          })
        );
      }
    } else {
      console.log("valide track");
      this.queue.push(await this.getAudioRessource(streamInfo));
    }
    if (this.player.state.status !== "playing") {
      connection.subscribe(this.player);
      this.playNext();
    }
    message.delete();
    return this.player;
  }
  /**
   * @param {Message} message
   */
  pause(message) {
    if (this.checkPresence(message)) return;
    this.player.pause(true);
    return this.player;
  }
  /**
   * @param {Message} message
   */
  resume(message) {
    if (this.checkPresence(message)) return;
    this.player.unpause();
    return this.player;
  }
  /**
   *
   * @param {Message} message
   */
  skip(message) {
    if (this.checkPresence(message)) return;
    this.player.stop();
    return this.playNext();
  }
}
const music = new customPlayer();
music.player.on("idle", () => {
  if (this.queue.length > 0) {
    this.playNext();
  }
});

module.exports = music;