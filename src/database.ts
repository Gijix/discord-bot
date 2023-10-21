import { Guild, Prisma, PrismaClient, User } from "@prisma/client";

const prismaClient = new PrismaClient()

export async function connect () {
  await prismaClient.$connect()
}

export class GuildDb {
  private constructor (public guildInfo: Guild) {
  }

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
        id: this.guildInfo.id
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
    return this.updateGuild({ prefix })
  }

  async setLogChannel (logCanalId: string) {
    return this.updateGuild({ logCanalId })
  }
}

export class UserDb {
  private constructor (public userInfo: User) {}

  private static async getUser (discordId: string) {
    return (await prismaClient.user.findUnique({
      where: {
        discordId
      }
    }))
  }

  private async updateUser (data: Prisma.UserUpdateInput) {
    return prismaClient.user.update({
      where: {
        id: this.userInfo.id
      },
      data
    })
  }

  static async ensure (discordId: string) {
    const user = await this.getUser(discordId)
    if (!user) {
      return new this(await this.create(discordId))
    }
    return new this(user)
  }

  static async create (discordId: string) {
    return await prismaClient.user.create({ data: {
      discordId
    }})
  }

  hasToy () {
    return Boolean(this.userInfo.loveToyId)
  }

  setToy (loveToyId: string) {
    return this.updateUser({ loveToyId })
  }
}

