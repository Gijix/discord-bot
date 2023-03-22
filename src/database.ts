import { prismaClient } from "./customClient.js";

export async function ensureUser (discordId: string) {
  let user = await prismaClient.user.findFirst({
    where: {
      discord_id: discordId
    }
  })

  if (!user) {
    user = await prismaClient.user.create({
      data: {
        discord_id: discordId
      }
    })
  }

  return user
}

export async function getGomette () {
  return await prismaClient.gomette.findMany()
}
