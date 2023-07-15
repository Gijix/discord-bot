import { ComponentType } from "discord.js";
import { ComponentRow } from "../handlers/componentHandler";

export default new ComponentRow({
  name: 'button',
  type: ComponentType.Button,
  description: 'bonsoir',
  async handler (interaction) {}
})