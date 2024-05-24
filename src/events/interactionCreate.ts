import { EventListener } from "../handlers/EventHandler.js";
import { error } from "../util/logger.js";

export default new EventListener({
  name: 'interactionCreate',
  async listener(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = this.commandHandler.slashs.get(interaction.commandName)
      if (command) {
        if (((!interaction.inGuild()) && command.data?.dm_permission === false)) {
          return
        }

        if (command.isActivated) {
          await command.handler.call(this, interaction).catch((err) => error(err, __filename, true))
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
