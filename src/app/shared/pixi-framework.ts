import {Container, Sprite, Texture, TilingSprite} from "pixi.js";
import {PixiGame} from "./pixi.game";

export class Actor extends Sprite {

  protected app: PixiGame;
  protected aspectRatio: number;

  constructor(app, spriteSrc: string) {
    const texture = new Texture(app.loader.resources[spriteSrc].texture);
    super(texture);
    this.aspectRatio = this.height / this.width;
    this.app = app;
  }

  update(delta) {
  }

  die() {
    this.parent?.removeChild(this);
  }

}

export interface Asset {
  name: string;
  src: string;
}

export class TitleScreen extends Container {


  constructor(bgTextures: Texture[]) {
    super();
    bgTextures.forEach(texture => {
    this.addChild(new TilingSprite(texture, 1280, 1280));
    })
  }

  onAdded() {
  }

}
