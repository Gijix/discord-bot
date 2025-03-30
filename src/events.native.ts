import { error } from "console";
import { EventListener } from "./handlers/EventHandler.js";
import { filename } from "dirname-filename-esm";
import { ChatInputCommandInteraction } from "discord.js";
import { Command, SubCommandOptions } from "./handlers/commandHandler.js";
import Bot from "./bot.js";

const __filename = filename(import.meta)

const guildCreateListener = new EventListener({
  name: 'guildCreate',
  async listener (guild) {
    await this.deployCommands(guild.id)
  }
})

const interactionCreateListener = new EventListener({
  name: 'interactionCreate',
  async listener(interaction) {
    console.log('interaction create')
    if (interaction.isChatInputCommand()) {
      const command = this.commandHandler.slashs.get(interaction.commandName)
      if (command) {
        if (((!interaction.inGuild()) && command.data?.dm_permission === false)) {
          return
        }

        if (command.isActivated) {
          await command.handler.call(this, interaction)
          const name = interaction.options.getSubcommand(false)
          const subCommand = command.subs.find(x => x.name === name)
          if (subCommand) await subCommand.handler.call(this, interaction)

        } else {
          await interaction.reply({ ephemeral: true, content: `command ${command.name} not implemented yet` })
        }
      } else {
        await interaction.reply({ ephemeral: true, content: `missing handler for ${interaction.commandName} with id: ${interaction.commandId}` })
      }
    }

    if (interaction.isContextMenuCommand()) {
      await this.contextMenuHandler.runUserContextMenuInteraction(interaction, this)
    }

    if (interaction.isModalSubmit()) {
      await this.modalHandler.onSubmit(interaction, this)
    }

    if (interaction.isAnySelectMenu() || interaction.isButton()) {
      const component = this.componentHandler.cache.get(interaction.customId)
      if (component) {
        await component.handler.call(this, interaction)
      }
    }
  }
})

const messageCreateListener = new EventListener({
  name: 'messageCreate',
  async listener(message) {
    if (message.author.bot) return;
    if (!message.inGuild()) return

    await this.commandHandler.runMessage(message, this).catch((e) => error(e, __filename, true))
  }
})

export const listeners = [messageCreateListener, guildCreateListener, interactionCreateListener]

