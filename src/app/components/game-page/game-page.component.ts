import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
export class GamePageComponent implements OnInit, OnDestroy {
  memoryDataSet: MemoryDataSet[] = [];
  indexArr: number[] = [];
  playerIdx: PlayerPonits[] = [];
  dataReady = false;
  gameType: GameType = {
    gameTheme: 'number',
    numberOfPlayers: 1,
    gridSize: 6,
  };
  timer = { mm: '00', ss: '00' };
  timerSub$: NodeJS.Timeout | undefined;
  lastTwoClickedIdx: number[] = [];
  clickCounter = 0;

  constructor() {}

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
          matched: false,
        };
      }
    );
    this.dataSetArrCreation(dataVal);
  }

  timerStart() {
    let ss = 0;
    let mm = 0;
    this.timerSub$ = setInterval(() => {
      if (ss === 59) {
        ss = 0;
        mm++;
      } else {
        ss++;
      }
      this.timer = { mm: `0${mm}`.slice(-2), ss: `0${ss}`.slice(-2) };
    }, 1000);
  }

  dataSetArrCreation(dataVal: MemoryDataSet[]) {
    for (let i = dataVal.length - 1; i >= 0; i--) {
      const randomNum = Math.floor(Math.random() * i);
      const temp = dataVal[i];
      dataVal[i] = dataVal[randomNum];
      dataVal[randomNum] = temp;
    }
    this.memoryDataSet = dataVal;
  }

  coinClicked(idx: number) {
    if (this.memoryDataSet[idx].matched) {
      return;
    }
    if (this.lastTwoClickedIdx.includes(idx)) {
      return;
    }
    if (this.gameType.numberOfPlayers === 1) {
      this.clickCounter++;
      if (this.clickCounter === 1) {
        this.timerStart();
      }
    }

    this.memoryDataSet[idx].opened = true;
    if (this.lastTwoClickedIdx.length === 2) {
      if (
        this.memoryDataSet[this.lastTwoClickedIdx[0]]?.value !==
        this.memoryDataSet[this.lastTwoClickedIdx[1]]?.value
      ) {
        this.memoryDataSet[this.lastTwoClickedIdx[0]].opened = false;
        this.memoryDataSet[this.lastTwoClickedIdx[1]].opened = false;
      } else {
        this.memoryDataSet[this.lastTwoClickedIdx[0]].matched = true;
        this.memoryDataSet[this.lastTwoClickedIdx[1]].matched = true;
      }
      this.lastTwoClickedIdx = [];
    }
    this.lastTwoClickedIdx.push(idx);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerSub$);
  }
}
