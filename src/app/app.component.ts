import {AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild} from '@angular/core';
import {SurviveHalloweenGame} from './survive-halloween.game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('pixi') pixi: ElementRef;
  pixiGame: SurviveHalloweenGame;
  title = 'frontview-angular';

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.pixiGame = new SurviveHalloweenGame(this.pixi.nativeElement);
    });
    setTimeout(() => {
      this.pixiGame.setGameScreen();
    }, 200);
  }


}

