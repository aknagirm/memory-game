import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit {
  gameTheme = 'number';
  numberofPlayer = 1;
  gridSize = 4;

  constructor() {}

  ngOnInit(): void {}

  gameThemeChoose(gameTheme: string) {
    this.gameTheme = gameTheme;
  }
}
