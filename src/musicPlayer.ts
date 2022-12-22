import play, {
  YouTube,
  YouTubeVideo,
  YouTubeChannel,
  SoundCloud,
  Spotify,
  SoundCloudPlaylist,
  SoundCloudStream,
  SoundCloudTrack,
  YouTubePlayList,
  SpotifyAlbum,
  SpotifyPlaylist,
  SpotifyTrack,
  YouTubeStream
} from "play-dl";
import Client from "./customClient.js";
import { 
  createAudioPlayer,
  getVoiceConnection,
  createAudioResource,
  AudioResource,
  AudioPlayerStatus,
  VoiceConnection,
  NoSubscriberBehavior
} from "@discordjs/voice";
import { MessageCommand } from "./commandHandler.js";
import { log, error } from "./logger.js";
import { filename } from "dirname-filename-esm";
import { Collection, GuildMember } from "discord.js";

const __filename = filename(import.meta)

interface Media {
  audioRessource: AudioResource
  streamInfo: YouTube
}

type MediaType = YouTube | Spotify | SoundCloud


class Queue extends Collection<string, Media> {

}

class MusicPlayer {
  static hasRefreshToken: boolean = false
  static setRefreshtoken () {
    return play.setToken({
      spotify: {
        client_id: '623895b5f4f7481c9bff17e0bc90a310',
        client_secret: '5992af24a1c248b894942511e231ef2f',
        market: 'FR',
        refresh_token: 'AQCjsvGTbuJj5ZerE9WeMa0QUny27ai-Vc_7GMDpqNfaph2b6guHuNDHZ8s9QmzS34nyLJr1UL2MGoLAS1lhbSdjvEdClSi6ZdEFqYBzExGMcrfSD6jpagzknO8O7K305hQ'
      }
    })
  }
  constructor (public guildId: string, public client: Client) {
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
    this.player.play(this.queue.shift()!.audioRessource);

    return this.player;
  }

  async getAudioRessource (streamInfo: MediaType) {
    let stream: SoundCloudStream | YouTubeStream

    const streamMedia = (info:  YouTubeVideo | SpotifyTrack | SoundCloudTrack) => play.stream(info.url)

    if (this.isSoundClound(streamInfo)) {
      stream = await this.getFromSoundCloud(streamInfo).then(streamMedia)
    } else if (this.isYoutube(streamInfo)) {
      stream = await this.getFromYoutube(streamInfo).then(streamMedia)
    } else {
      stream = await this.getFromSpotify(streamInfo).then(streamMedia)
    }

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
    const validation = await play.validate(baseUrl);
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
    if (!MusicPlayer.hasRefreshToken) {
      await MusicPlayer.setRefreshtoken()
    }

    let connection = getVoiceConnection(member.guild.id)
    const channelId = member.guild.members.me!.voice.channelId

    if (channelId && member?.voice.channelId !== channelId) {
      throw new Error('already in voice channel')
    }

    const userConnection = this.client.join(member)

    if (!userConnection) {
      throw new Error('user is not in voice channel')
    }

    connection = getVoiceConnection(member.guild.id) || userConnection
    const media = (await this.getMedia(query))!;
    const audioRessource = await this.getAudioRessource(media)

    connection.subscribe(this.player)

    this.player.play(audioRessource)
  
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
  constructor (public client: Client) {
    super()
  }

  ensure (guildId: string) {
    if (this.client.guilds.cache.has(guildId)) {
      throw new Error('invalid guild id')
    }

    return this.get(guildId) || new MusicPlayer(guildId, this.client)
  }
}
