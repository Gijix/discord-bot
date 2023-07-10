import { Guild, Prisma, PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient()

export class GuildDB {
  private constructor (public guildInfo: Guild) {}

  private static async getGuild (guildId: string) {
    return (await prismaClient.guild.findUnique({
      where: {
        guildId
      }
    }))
  }

  private async updateGuild (data: Prisma.GuildUpdateInput) {
    return prismaClient.guild.update({
      where: {
        guildId: this.guildInfo.id
      },
      data
    })
  }

  static async ensure (guildId: string) {
    const guild = await this.getGuild(guildId)
    if (!guild) {
      return new this(await this.create(guildId))
    }
    return new this(guild)
  }

  static async create (guildId: string) {
    return await prismaClient.guild.create({ data: {
      guildId
    }})
  }

  async setPrefix (prefix: string) {
    return this.updateGuild({
      prefix
    })
  }

  async setLogChannel (logCanalId: string) {
    return this.updateGuild({ logCanalId })
  }
}
