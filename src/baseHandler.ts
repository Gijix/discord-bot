import { Collection } from "discord.js";
import path from "path";
import { readdir } from "fs/promises";
import { BaseComponent } from "./baseComponent.js";
import { success } from "./logger.js";

export class Handler<S extends BaseComponent> {
  path: string
  cache = new Collection<string, S>()

  constructor (...args: string[]) {
    this.path = path.join(process.cwd(), ...args)
  }

  async load () {
    const filenames = await readdir(this.path);
    const preCache = new Collection<string, S>()

    for (const filename of filenames) {
      const filepath = this.path + '/' + filename
      const file = (await import("file://" + filepath)) as { default: any };
      const baseComponent = file.default

      if (!(baseComponent instanceof BaseComponent)) {
        throw new Error('import is not based on BaseComponent')
      }

      if (preCache.has(baseComponent.id || baseComponent.name)) {
        throw new Error('Collection member already exist')
      }

      preCache.set(baseComponent.id || baseComponent.name, baseComponent as S)
    }

    this.cache = preCache

    success(`loaded ${this.constructor.name}`)
  }
}