import { Command } from "../handlers/commandHandler.js";
import { error } from "../util/logger.js";
import { filename } from 'dirname-filename-esm'

const __filename = filename(import.meta)

export default new Command({
  name: 'delete',
  description: 'Delete a number of message or all of specific user',
  permissions: ["ManageMessages"],
  isActivated: false,
  async handler (message) {
  
  }
})
