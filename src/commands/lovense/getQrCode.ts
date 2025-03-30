import { UserDb, UserLovenseDb } from "../../database.js";
import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'getqrcode',
  isSlash: true,
  description: 'get the qr code for authorizing the bot to send commands',
  async handler(interaction) {
    const id = interaction.user.id

    const lovenseIO = await this.socketManager.getInstance(id)

    lovenseIO.on('qrCodeSend', async(res) => {
      const { data } = res

      if (!(data && data.ackId === id)) return
    
      const embed = this.createEmbed('Blue', 'qrcode', interaction.user.displayName, data.qrcodeUrl)
      

      await interaction.reply({ ephemeral: true , embeds: [embed]})
      let deleteSocket = true
      setTimeout(() => {
        if (deleteSocket) {
          this.socketManager.delete(id)
          interaction.user.send("30 seconde ! le proccesus d'enregistrement de votre jouet est annulé, veuillez redemander un qrCode")
        }
      }, 30000)
      lovenseIO.once('deviceUpdate', async(res) => {
        const toy = res.toyList[0]
        if (!toy) {
          interaction.user.send('Nous ne trouvons pas votre jouet')
        } else {
          const userDb = await this.UserManager.ensure(id)
          const lovenseUser = await userDb.lovense()

          if (lovenseUser) lovenseUser.setToy(toy.id)
          else await UserLovenseDb.ensure(userDb, toy.id)
        
          deleteSocket = false
          interaction.user.send(`Votre jouet ${toy.name} ${toy.nickname}  a été enregistré avec succès`)
        }
      })
    })

    lovenseIO.emit('requestQrcode', {
      ackId: id,
    })

  }
})