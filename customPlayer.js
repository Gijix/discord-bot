const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const { Message, VoiceChannel, StreamDispatcher } = require("discord.js");
class customPlayer {
     queue  = 0
    /**
     * @type {StreamDispatcher}
     */
    #state
  /**
   *
   * @param {string} query
   * @param {Message} message
   *
   */
  async stream(query) {
    /**
     * 
     * @param {string} search 
     */
    const videoFinder = async (search) => {
      const videoResult = await ytSearch(search);
      return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    };
    const video = await videoFinder(query)
    const stream = ytdl(video.url,{highWaterMark:1})
    return stream
  }
  /**
   *
   * @param {Message} message
   */
  async play(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();
     /**
     * @type {VoiceChannel}
    */
     const voice = message.channel;
     const connection = await voice.join();
     const state =  connection.play((await this.stream(args.join(' '))))
     if(!this.#state){
     this.#state = state
     }
     else {
         
     }
  }
}
module.exports = customPlayer;
