import { Command } from "../handlers/commandHandler.js";

export default new Command({
  name: 'trigger',
  description: 'trigger',
  isSlash: true,
  async handler(interaction) {
    const modal = this.modalHandler.cache.get('modal1') 
    if (modal) {
      await interaction.showModal(modal.builder)
    }
  }
})
