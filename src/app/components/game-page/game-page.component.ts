import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  GameType,
  MemoryDataSet,
  PlayerPonits,
} from 'src/app/model/game-type.model';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
  memoryDataSet: MemoryDataSet[] | undefined;
  indexArr: number[] = [];
  playerIdx: PlayerPonits[] = [];
  dataReady = false;
  gameType: GameType = {
    gameTheme: 'number',
    numberOfPlayers: 3,
    gridSize: 6,
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.indexArr = [...Array(this.gameType.gridSize).keys()];
    this.playerIdx = [...Array(this.gameType.numberOfPlayers).keys()].map(
      (idx, id) => {
        return {
          title: `Player ${idx + 1}`,
          points: 0,
          current: id === 0 ? true : false,
        };
      }
    );
    const totalIndex = Math.pow(this.gameType.gridSize, 2);
    const dataValTemp = [...Array(totalIndex / 2).keys()];
    const dataVal: MemoryDataSet[] = [...dataValTemp, ...dataValTemp].map(
      (data) => {
        return {
          value: (data + 1).toString(),
          opened: false,
        };
      }
    );
    this.dataSetArrCreation(dataVal);
  }

  dataSetArrCreation(dataVal: MemoryDataSet[]) {
    for (let i = dataVal.length - 1; i >= 0; i--) {
      const randomNum = Math.floor(Math.random() * i);
      const temp = dataVal[i];
      dataVal[i] = dataVal[randomNum];
      dataVal[randomNum] = temp;
    }
    this.memoryDataSet = dataVal;
    this.cdr.detectChanges();
  }
}
