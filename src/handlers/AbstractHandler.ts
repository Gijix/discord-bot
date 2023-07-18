import { Collection } from "discord.js";
import path from "path";
import { readdir } from "fs/promises";
import { BaseComponent } from "../baseComponent.js";
import { log } from "../logger.js";

export abstract class Handler<S extends BaseComponent> {
  path: string
  cache = new Collection<string, S>()

  constructor (...paths: string[]) {
    this.path = path.join(process.cwd(),process.env.OUTDIR, ...paths)
  }

  async load () {
    this.cache = await this._load()

    log(`loaded ${this.constructor.name} (loaded ${this.cache.size})`)
  }

  private async _load (...paths: string[]): Promise<Collection<string, S>> {
    const filenames = await readdir(path.join(this.path, ...paths), { withFileTypes: true });
    let preCache = new Collection<string, S>();

    for await (const filename of filenames) {
      const filepath = path.join(this.path,...paths, filename.name)
      
      if (filename.isDirectory()) {
        const subCache = await this._load(...paths, filename.name)

        preCache = preCache.concat(subCache)

        continue
      }

      if (!filename.isFile()) {
        throw new Error('incorrect file type')
      }

      const file = (await import("file://" + filepath)) as { default: any };
      const baseComponent = file.default

      if (!(baseComponent instanceof BaseComponent)) {
        throw new Error('import is not based on BaseComponent')
      }

      const identifier = baseComponent.id || baseComponent.name

      if (preCache.has(identifier)) {
        throw new Error(`Collection member already exist ${identifier}`)
      }

      if (paths.length !== 0) {
        baseComponent.category = paths.join('-')
      }

      preCache.set(baseComponent.id || baseComponent.name, baseComponent as S)
    }

    return preCache
  }
}