import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../handlers/commandHandler.js";
import { UserLovenseDb } from "../../database.js";


export default new Command({
  name: 'lovense',
  description: 'Commandes lovense',
  isSlash: true,
  guildOnly: false,
  subs: [{
    name: 'play',
    description: 'Jouez avec votre jouet',
    options: [
      {
        name: "type",
        description: "L'effet que vous voulez déclenché",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: 'Vibrate',
            value: 'Vibrate'
          },
          {
            name: 'Thrust',
            value: 'Thrust'
          },
          {
            name: 'Finger',
            value: 'Finger'
          },
          {
            name: 'Pump',
            value: 'Pump',
          },
          {
            name: 'Firework',
            value: 'Firework',
          },
          {
            name: 'Pulse',
            value: 'Pulse',
          },
          {
            name: 'Wave',
            value: 'Wave',
          },
          {
            name: 'Earthquake',
            value: 'Earthquake',
          },
          {
            name: 'Stop',
            value: 'Stop'
          }
        ]
      }, {
        name: 'membre',
        type: ApplicationCommandOptionType.User,
        required: false,
        description: 'le membre que vous voulez stimuler'
      }
    ],
    async handler (interaction) {
      const userDb = await this.UserManager.ensure(interaction.user.id)
      const target = interaction.options.getUser('membre')
      let userLovense: UserLovenseDb
      if (target) {
        const current = await (await this.UserManager.ensure(target.id)).lovense()
        if (!current) {
          return interaction.reply({ ephemeral: true, content: "L'utilisateur n'a pas de jouet enregistré"})
        }

        if (!(await current.isAuthorized(userDb.userInfo.id))) {
          return interaction.reply({ ephemeral: true, content: "Vous n'avez pas la permission de jouer avec le jouet de cet utilisateur"})
        }

        userLovense = current
      } else {
        const current = await userDb.lovense()

        if (!current) {
          return interaction.reply({ ephemeral: true, content: "Vous n'avez pas enregistré votre jouet"})
        }

        userLovense = current
      }

      const lovenseIO = await this.socketManager.getInstance(interaction.user.id)
      const toyId = userLovense.lovenseInfo.lovenseToyId
      const type = interaction.options.getString('type', true)
      switch (type) {
        case 'Vibrate':
          lovenseIO.vibrate(toyId)
          break
        case 'Thrust':
          lovenseIO.thrust(toyId)
          break
        case 'Finger':
          lovenseIO.finger(toyId)
          break
        case 'Pump':
          lovenseIO.pump(toyId)
        break
        case 'Fireword':
          lovenseIO.firework(toyId)
        break
        case 'Wave':
          lovenseIO.wave(toyId)
        break
        case 'Pulse':
          lovenseIO.pulse(toyId)
        break
        case 'Earthquake':
          lovenseIO.earthquake(toyId)
        break
        case 'Stop':
          lovenseIO.stop(toyId)
        break
      }

      interaction.reply({ephemeral: true, content: 'Commande lancé avec succès'})
    }
  }, {
    name: 'authorize',
    description: 'donne la permission à un membre de jouer avec votre jouet',
    options: [
      {
        type: ApplicationCommandOptionType.User,
        name: 'membre',
        required: true,
        description: 'le membre que vous voulez auhtoriser',
      }
    ],
    async handler (interaction) {
      const userDb = await this.UserManager.ensure(interaction.user.id) 
      const userLovense = await userDb.lovense()
      const user = interaction.options.getUser('membre', true)

      if (!userLovense) {
        return interaction.reply({ ephemeral: true, content: "Vous n'avez pas enregistré votre jouet"})
      }
      const otherUser = await this.UserManager.ensure(user.id)
      if (await userLovense.isAuthorized(otherUser.userInfo.id)) {
        return interaction.reply({ ephemeral: true, content: "L'utilisateur est déjà autorisé"})
      }

      await userLovense.authorizePlaying(otherUser.userInfo.id)

    }
  }],
  async handler(interaction) {
    // before subCommand
  }
})