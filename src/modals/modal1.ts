import { TextInputStyle } from "discord.js";
import { Modal } from "../handlers/modalHandler.js";

export default new Modal({
  components:{
    field1: {
      label: "string",
      style: TextInputStyle.Paragraph
    },
    field2: {
      label: "test",
      style: TextInputStyle.Paragraph
    }
  },
  name: 'test',
  id: 'modal1',
  async handler (data, interaction) {
    interaction.reply(JSON.stringify(data))
  }
})
