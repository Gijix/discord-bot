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
} from "play-dl";
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

const __filename = filename(import.meta)

interface Media {
  audioRessource: AudioResource
  streamInfo: YouTube
}

type MediaType = YouTube | Spotify | SoundCloud

let soId = await play.getFreeClientID()
await play.setToken({
  soundcloud:{
    client_id: soId
  }
})

export class MusicPlayer {
  constructor (public guildId: string, public client: Bot) {
    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.queue.length > 0) {
        this.playNext();
      }
    })

    this.player.on('error', (err) => {
      error(err, __filename)
    })
  }

  player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause
    }
  })

  queue: Media[] = []

  checkPresence(message: MessageCommand) {
    return message.member!.voice.channelId !== getVoiceConnection(message.guildId)?.joinConfig.channelId
  }


  playNext() {
    const nextTrack = this.queue.shift()

    if (nextTrack) {
      this.player.play(nextTrack.audioRessource)
    }

    return this.player;
  }

  async getAudioRessource (streamInfo: MediaType) {
    let data

    if (this.isSoundClound(streamInfo)) {
      data = await this.getFromSoundCloud(streamInfo)
    } else if (this.isYoutube(streamInfo)) {
      data = await this.getFromYoutube(streamInfo)
    } else {
      data = await this.getFromSpotify(streamInfo)
    }

    let url = data.url

    if (data instanceof SpotifyTrack) {
      url = (await play.search(data.name))[0].url
    }

    const stream = await play.stream(url)

    return createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true })
  }

  async getFromSoundCloud (streamInfo: SoundCloud): Promise<SoundCloudTrack> {
    return streamInfo instanceof SoundCloudPlaylist ? (await streamInfo.all_tracks())[0] : streamInfo
  }

  async getFromSpotify (streamInfo: Spotify): Promise<SpotifyTrack> {
    return streamInfo instanceof SpotifyAlbum || streamInfo instanceof SpotifyPlaylist ? 
      (await streamInfo.all_tracks())[0] : 
      streamInfo
  }

  async getFromYoutube(streamInfo: YouTube): Promise<YouTubeVideo> {
    let playMedia: YouTubeVideo
    if (streamInfo instanceof YouTubeChannel) {
      playMedia = (await play.search(streamInfo.name!, { limit: 1 }))[0]
    } else if (streamInfo instanceof YouTubePlayList) {
      playMedia = (await play.search(streamInfo.title!, { limit: 1 }))[0]
    } else {
      playMedia = streamInfo
    }

    return playMedia
  }

  async getMedia(baseUrl: string): Promise<YouTubeVideo | Spotify | SoundCloud | null> {

    const validation = await play.validate(baseUrl.replace('intl-fr/', ''));
    if (!validation) {
      console.log("error returning with validation " + validation);
      return null
    }

    if (validation.startsWith("yt") || validation === 'search') {
      return (await play.search(baseUrl))[0];
    } else if (validation.startsWith("so")) {
      return await play.soundcloud(baseUrl);
    } else if (validation.startsWith("sp")) {
      if (play.is_expired()) {
        await play.refreshToken()
      }

      return await play.spotify(baseUrl);
    }

    return null
  }

  async play(query: string, member: GuildMember) {
    const channelId = member.guild.members.me!.voice.channelId
    const userChannelId = member.voice.channelId

    if (channelId && (member.voice.channelId !== channelId)) {
      throw new Error('already in voice channel')
    }
  
    if (!userChannelId) {
      throw new Error('user is not in voice channel')
    }

    const connection = this.client.join(member.guild, userChannelId, true)
    const media = (await this.getMedia(query));
  
    if (!media) {
      throw new Error('invalid media')
    }

    const audioRessource = await this.getAudioRessource(media)

    if (this.player.state.status !== AudioPlayerStatus.Idle ) {
      this.queue.push({ audioRessource, streamInfo: media as YouTube })
    } else {
      connection.subscribe(this.player)
    
      this.player.play(audioRessource)
    }

    return this.player;
  }

  pause(message: MessageCommand) {
    if (this.checkPresence(message)) return this.player;
    this.player.pause(true);
    return this.player;
  }

  resume(message: MessageCommand) {
    if (this.checkPresence(message)) return this.player;
    this.player.unpause();
    return this.player;
  }

  skip(message: MessageCommand) {
    if (this.checkPresence(message)) return this.player;
    this.player.stop();
    return this.playNext();
  }

  private compareMedia (media: MediaType, constructors: Function[]) {
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

  ensure (guildId: string) {
    if (!this.client.guilds.cache.has(guildId)) {
      throw new Error('invalid guild id')
    }

    return this.get(guildId) || new MusicPlayer(guildId, this.client)
  }
}
