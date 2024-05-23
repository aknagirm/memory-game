import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  GameTheme,
  GameType,
  GridSize,
  NumberOfPlayers,
} from 'src/app/model/game-type.model';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit {
  gameTheme: GameTheme = 'number';
  numberofPlayer: NumberOfPlayers = 1;
  gridSize: GridSize = 2;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  startGame() {
    const gameType: GameType = {
      gameTheme: this.gameTheme,
      numberOfPlayers: this.numberofPlayer,
      gridSize: this.gridSize,
    };
    this.router.navigateByUrl('/game', { state: { gameType } });
  }
}
