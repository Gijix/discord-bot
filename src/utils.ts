import { dirname as __dirname } from "path"
import { fileURLToPath } from "url"
import { promisify } from "util"

export function dirname (meta: ImportMeta) {
  return __dirname(fileURLToPath(meta.url))
}
export const wait = promisify(setTimeout)