import {Application, Container} from "pixi.js";
import {Actor, Asset, TitleScreen} from "./pixi-framework";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";

export class PixiGame extends Application {

  finishGame$ = new Subject<void>();
  vibrate$ = new Subject<number[]>();
  sound$ = new Subject<string>();
  score$: Observable<number>;
  titleScreen: TitleScreen;
  gameScreen = new Container();

  private _score$ = new BehaviorSubject<number>(0);
  protected readonly assets: Asset[];

  constructor(protected element: Element,
              public width = 1280,
              public height = 1280,
              public resolution = 1) {
    super({
      // autoStart: true,
      width: width,
      height: height,
      // view?: HTMLCanvasElement;
      // transparent?: boolean;
      // autoDensity?: boolean;
      antialias: false,
      // preserveDrawingBuffer?: boolean;
      resolution: resolution,
      // forceCanvas?: boolean;
      backgroundColor: 0x426274,
      // clearBeforeRender?: boolean;
      // powerPreference?: string;
      // sharedTicker?: boolean;
      // sharedLoader?: boolean;
      // resizeTo: element
    });
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    // this.ticker.stop();
    // gsap.ticker.add(() => {
    //   this.ticker.update();
    // });
    this.score$ = this._score$.pipe();
    element.appendChild(this.view);
    this.customResize();
  }

  addScore(score: number){
    this._score$.next(this._score$.getValue() + score);
  }

  protected resetGame() {
    this._score$.next(0);
  }

  protected loadAssets() {
    this.loader.baseUrl = 'assets/imgs/';
    this.loader.onProgress.add(this.loadingProgress.bind(this))
    this.loader.onComplete.add(this.startGame.bind(this))
    this.assets.forEach((asset: Asset) => {
      this.loader.add(asset.name, asset.src)
    })
    this.loader.load();
  }

  private loadingProgress(e) {
    // console.log(e.progress)
  }

  protected setTitleScreen() {
    this.stage.removeChild(this.gameScreen);
    this.stage.addChild(this.titleScreen);
  }

  setGameScreen() {
    this.stage.removeChild(this.titleScreen);
    this.stage.addChild(this.gameScreen);
    this.ticker.add(this.update, this);
  }

  protected startGame() {
    this.stage.addChild(this.titleScreen);
  }

  protected update(delta) {
    this.gameScreen.children.filter(el => el instanceof Actor).forEach((actor: Actor) => {
      actor.update(delta);
    });
  }

  public finishGame() {
    this.finishGame$.next();
    this.setTitleScreen();
    this.gameScreen.removeChildren();
    this.ticker.remove(this.update, this);
    this.resetGame();
  }

  customResize = () => {
    const vpw = this.element.getBoundingClientRect().width;  // Width of the viewport
    const vph = this.element.getBoundingClientRect().height; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    // The aspect ratio is the ratio of the screen's sizes in different dimensions.
    // The height-to-width aspect ratio of the game is HEIGHT / WIDTH.

    if (vph / vpw < this.height / this.width) {
      // If height-to-width ratio of the viewport is less than the height-to-width ratio
      // of the game, then the height will be equal to the height of the viewport, and
      // the width will be scaled.
      nvh = vph;
      nvw = (nvh * this.width) / this.height;
    } else {
      // In the else case, the opposite is happening.
      nvw = vpw;
      nvh = (nvw * this.height) / this.width;
    }

    // Set the game screen size to the new values.
    // This command only makes the screen bigger --- it does not scale the contents of the game.
    // There will be a lot of extra room --- or missing room --- if we don't scale the stage.
    this.renderer.resize(nvw, nvh * this.resolution);

    // This command scales the stage to fit the new size of the game.
    this.stage.scale.set((nvw / this.width) * this.resolution, (nvh / this.height) * this.resolution);
  }

}





