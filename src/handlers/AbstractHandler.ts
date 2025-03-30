import { Collection } from "discord.js";
import path from "path";
import { readdir } from "fs/promises";
import { BaseComponent } from "../baseComponent.js";
import { log } from "../util/logger.js";
import { existsSync, mkdirSync } from "fs";

export abstract class Handler<S extends BaseComponent> {
  path?: string
  cache = new Collection<string, S>()

  constructor (...paths: string[]) {
    if (paths.length > 0) {
      this.path = path.join(...paths)
    }
  }

  protected onLoad?(component: S): void;

  async load () {
    this.cache = this.cache.concat(await this._load())

    log(`loaded ${this.constructor.name} (loaded ${this.cache.size})`)
  }

  private async _load (...paths: string[]): Promise<Collection<string, S>> {
    if (!this.path) throw new Error('no path provided')
    if (!existsSync(this.path)) mkdirSync(this.path)
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
      const file = (await import("file://" + process.cwd() + '/' + filepath)) as { default: any };
      const baseComponent = file.default as S
      if (!(Object.getPrototypeOf(baseComponent) !== BaseComponent.prototype)) {
        throw new Error(`import is not based on BaseComponent "${BaseComponent.name}"`)
      }

      const identifier = baseComponent.id || baseComponent.name

      if (preCache.has(identifier)) {
        throw new Error(`Collection member already exist ${identifier}`)
      }

      if (paths.length !== 0) {
        baseComponent.category = paths.join('-')
      }

      if (this.onLoad) this.onLoad(baseComponent)

      preCache.set(baseComponent.id || baseComponent.name, baseComponent as S)
    }

    return preCache
  }
}
