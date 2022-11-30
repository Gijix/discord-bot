import { Collection } from "discord.js";
import path from "path";
import { readdir, stat } from "fs/promises";
import { BaseComponent } from "./baseComponent.js";
import { success } from "./logger.js";

export class Handler<S extends BaseComponent> {
  path: string
  cache = new Collection<string, S>()

  constructor (...args: string[]) {
    this.path = path.join(process.cwd(), ...args)
  }

  async setup () {
    this.cache = await this.load()

    success(`loaded ${this.constructor.name} (loaded ${this.cache.size})`)
  }

  async load (...paths: string[]): Promise<Collection<string, S>> {
    const filenames = await readdir(path.join(this.path, ...paths));
    let preCache = new Collection<string, S>()

    for await (const filename of filenames) {
      const filepath = path.join(this.path,...paths, filename)
      const isDir = (await stat(filepath)).isDirectory()
      
      if (isDir) {
        const subCache = await this.load(...paths, filename)

        preCache = preCache.concat(subCache)

        continue
      }

      const file = (await import("file://" + filepath)) as { default: any };
      const baseComponent = file.default

      if (!(baseComponent instanceof BaseComponent)) {
        throw new Error('import is not based on BaseComponent')
      }

      if (preCache.has(baseComponent.id || baseComponent.name)) {
        throw new Error('Collection member already exist')
      }

      if (paths.length !== 0) {
        baseComponent.category = paths.join('-')
      }

      preCache.set(baseComponent.id || baseComponent.name, baseComponent as S)
    }

    return preCache
  }
}