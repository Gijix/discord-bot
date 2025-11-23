import play, {
  YouTube,
  YouTubeVideo,
  YouTubeChannel,
  SoundCloud,
  Spotify,
  SoundCloudPlaylist,
  SoundCloudTrack,
  YouTubePlayList,
  SpotifyAlbum,
  SpotifyPlaylist,
  SpotifyTrack,
  Deezer,
  DeezerTrack,
  DeezerAlbum,
  DeezerPlaylist,
  InfoData
} from "./play-dl";
import Bot from "./bot.js";
import { 
  createAudioPlayer,
  getVoiceConnection,
  createAudioResource,
  AudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import { MessageCommand } from "./handlers/commandHandler.js";
import { error } from "./util/logger.js";
import { filename } from "dirname-filename-esm";
import { Collection, GuildMember } from "discord.js";
import { InputDefault } from "./util/arguments.js";
import { spawn } from "node:child_process";


const __filename = filename(import.meta)

interface Media {
  audioRessource: AudioResource
  streamInfo: TrackInfo
}

interface TrackInfo {
  url: string
  name: string
}

type MediaType = YouTube | Spotify | SoundCloud | Deezer

let soId = await play.getFreeClientID()
await play.setToken({
  soundcloud:{
    client_id: soId
  }
})



export class MusicPlayer {
  constructor (public guildId: string, public client: Bot) {
    this.player.on(AudioPlayerStatus.Idle, async() => {
      if (this.isLooping && this.currentAudio) {
        this.player.play(this.currentAudio.audioRessource)

        return
      }

      if (this.queue.length > 0) {
        await this.playNext();
      }
    })

    this.player.on('error', (err) => {
      error(err, __filename)
    })
  }

  LastPushedInQueue = false
  player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause
    }
  })

  currentAudio: Media | undefined
  queue: TrackInfo[] = []
  isLooping = false

  checkPresence(message: MessageCommand<InputDefault, true>) {
    const { channelId } = message.member.voice
    const botChannelId = getVoiceConnection(message.guildId)?.joinConfig.channelId
    return Boolean(channelId) && (channelId === botChannelId)
  }

  async playNext() {
    const nextTrack = this.queue.shift()

    if (nextTrack) {
      const audioRessource = await this.createAudioResource(nextTrack.url)
      this.player.play(audioRessource)
      this.currentAudio = { audioRessource, streamInfo: nextTrack}
    }

    return this.player;
  }

  async createAudioResource (url: string, seek?: number) {
    const process = spawn('yt-dlp', [
      '-f', 'bestaudio',
      '-o', '-',                  // Output to stdout
      '--quiet',
      '--no-playlist',
      url
    ], {
      stdio: ['ignore', 'pipe', 'ignore']
    });
    // const stream = await play.stream(url, {
    //   discordPlayerCompatibility: true,
    //   quality: 2
    // })
    process.on('close', () => console.log('close'))
    process.on('exit', () => console.log('exit'))
    process.on('error', (err) => console.log(err))
    return createAudioResource(process.stdout, { inlineVolume: true })
  }

  async getYoutubeVideo (media: YouTubeVideo | DeezerTrack | SoundCloudTrack | SpotifyTrack) {
    let url = media.url
    if (media instanceof SpotifyTrack || media instanceof SoundCloudTrack) {
      url = (await play.search(media.name))[0].url
      return { url, name: media.name }
    } else if (media instanceof DeezerTrack) {
      url = (await play.search(media.title))[0].url
      return { url, name: media.title }
    }

    return { url, name: media.title! }
  }

  async getDataFromMedia (streamInfo: MediaType) {
    let data
    if (this.isSoundClound(streamInfo)) {
      data = await this.getFromSoundCloud(streamInfo)
    } else if (this.isYoutube(streamInfo)) {
      data = await this.getFromYoutube(streamInfo)
    } else if (this.isSpotify(streamInfo)) {
      data = await this.getFromSpotify(streamInfo)
    } else {
      data = await this.getFromDeezer(streamInfo)
    }
    console.log(data)

    return Promise.all((Array.isArray(data) ? data : [data]).map(x => this.getYoutubeVideo(x)))
  }

  async getFromSoundCloud (streamInfo: SoundCloud): Promise<SoundCloudTrack | SoundCloudTrack[]> {
    return streamInfo instanceof SoundCloudPlaylist ? (await streamInfo.all_tracks()) : streamInfo
  }

  async getFromSpotify (streamInfo: Spotify): Promise<SpotifyTrack | SpotifyTrack[]> {
    return streamInfo instanceof SpotifyAlbum || streamInfo instanceof SpotifyPlaylist ? 
      (await streamInfo.all_tracks()) : 
      streamInfo
  }

  async getFromYoutube(streamInfo: YouTube): Promise<YouTubeVideo | YouTubeVideo[]> {
    let playMedia: YouTubeVideo | YouTubeVideo[]
    if (streamInfo instanceof YouTubeChannel) {
      playMedia = (await play.search(streamInfo.name!, { limit: 5 }))
    } else if (streamInfo instanceof YouTubePlayList) {
      playMedia = (await play.search(streamInfo.title!))
    } else {
      playMedia = streamInfo
    }

    return playMedia
  }

  async getFromDeezer(streamInfo: Deezer): Promise<DeezerTrack | DeezerTrack[]> {
    let playMedia: DeezerTrack | DeezerTrack[]
    if (streamInfo instanceof DeezerAlbum){
      playMedia = await streamInfo.all_tracks()
    } else if (streamInfo instanceof DeezerPlaylist) {
      playMedia = await streamInfo.all_tracks()
    } else {
      playMedia = streamInfo
    }

    return playMedia
  }

  async getMedia(baseUrl: string): Promise<YouTube | Spotify | SoundCloud | Deezer | null> {

    const validation = await play.validate(baseUrl.replace('intl-fr/', ''));
    if (!validation) {
      console.log("error returning with validation " + validation);
      return null
    }
    
    if (play.yt_validate(baseUrl)) {
      if (validation === 'yt_playlist') {
        return await play.playlist_info(baseUrl)
      } else if (validation === 'yt_video') {
        return (await play.video_info(baseUrl)).video_details
      }
    }

    if (validation === 'search') {
      return (await play.search(baseUrl))[0];
    } else if (validation.startsWith("so")) {
      return await play.soundcloud(baseUrl);
    } else if (validation.startsWith("sp")) {
      console.log(play.is_expired())
      if (play.is_expired()) {
        await play.refreshToken()
        console.log('refreshed')
      }

      return await play.spotify(baseUrl);
    } else if (validation.startsWith("dz")) {
      return await play.deezer(baseUrl)
    }

    return null
  }

  async play(query: string, member: GuildMember, seek?: number) {
    const channelId = member.guild.members.me!.voice.channelId
    const userChannel = member.voice.channel

    if (channelId && (userChannel?.id !== channelId)) {
      throw new Error('already in voice channel')
    }
  
    if (!userChannel) {
      throw new Error('user is not in voice channel')
    }

    const connection = userChannel.join(true)
    
    const media = (await this.getMedia(query));
    console.log('getted media')
  
    if (!media) {
      throw new Error('invalid media')
    }

    const tracks = await this.getDataFromMedia(media)

    if (this.player.state.status !== AudioPlayerStatus.Idle ) {
      this.queue.push(...tracks)
      this.LastPushedInQueue = true
    } else {
      connection.subscribe(this.player)
      console.log('subscribing')
      let track = tracks.shift()!
      this.queue.push(...tracks)
      console.log(track.url)
      const audioRessource = await this.createAudioResource(track.url)
      this.player.play(audioRessource)
      this.LastPushedInQueue = false
      this.currentAudio = { audioRessource, streamInfo: track }
    }

    return this.player;
  }

  pause(message: MessageCommand<InputDefault, true>) {
    if (!this.checkPresence(message)) return this.player;
    this.player.pause(true);
    return this.player;
  }

  resume(message: MessageCommand<InputDefault, true>) {
    if (!this.checkPresence(message)) return this.player;
    this.player.unpause();
    return this.player;
  }

  skip(message: MessageCommand<InputDefault, true>) {
    if (!this.checkPresence(message)) return this.player;
    this.player.stop();
    return this.playNext();
  }

  stop(message: MessageCommand<InputDefault, true>) {
    if (!this.checkPresence(message)) return this.player;
    this.player.stop();

    this.queue = []
    this.currentAudio = undefined

    return this
  }

  async seek (message: MessageCommand<InputDefault, true>, seek: number) {
    if (!this.checkPresence(message)) return this.player;

    if (this.currentAudio) {
      const audioRessource = await this.createAudioResource(this.currentAudio.streamInfo.url, seek)
      this.player.play(audioRessource)
      this.currentAudio.audioRessource = audioRessource
    }
  }

  private compareMedia<T extends new (...args: any[]) => any> (media: MediaType, constructors: T[]) {
    return constructors.some(construct => media instanceof construct)
  }

  isSoundClound (media: MediaType): media is SoundCloud {
    return  this.compareMedia(media, [SoundCloudPlaylist, SoundCloudTrack])
  }

  isYoutube (media: MediaType): media is YouTube {
    return  this.compareMedia(media, [YouTubeChannel, YouTubeVideo, YouTubePlayList])
  }

  isSpotify (media: MediaType): media is Spotify {
    return  this.compareMedia(media, [SpotifyAlbum, SpotifyPlaylist, SpotifyTrack])
  }
}

export class PlayerManager extends Collection<string, MusicPlayer>{
  constructor (public client: Bot) {
    super()
  }

  override ensure (guildId: string) {
    if (!this.client.guilds.cache.has(guildId)) {
      throw new Error('invalid guild id')
    }

    let player = this.get(guildId)

    if (!player) {
      player = new MusicPlayer(guildId, this.client)
      this.set(guildId, player)
    }

    return player
  }
}
