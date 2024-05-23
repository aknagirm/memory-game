import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { faIconList } from 'src/app/model/fa.const';
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
  gameType: GameType | undefined;
  timer = { mm: '00', ss: '00' };
  timerSub$: NodeJS.Timeout | undefined;
  lastTwoClickedIdx: number[] = [];
  clickCounter = 0;
  @ViewChild('dialog', { read: ElementRef })
  dialog!: ElementRef;
  nonMatchedItem = 0;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;

    if (!state) {
      this.router.navigateByUrl('/');
    } else {
      this.gameType = state['gameType'];
    }
  }

  ngOnInit(): void {
    this.dataLoad();
    this.gameBoardSetup();
  }

  dataLoad() {
    this.indexArr = [...Array(this.gameType!.gridSize).keys()];
    this.playerIdx = [...Array(this.gameType!.numberOfPlayers).keys()].map(
      (idx, id) => {
        return {
          title: `Player ${idx + 1}`,
          points: 0,
          current: id === 0 ? true : false,
        };
      }
    );
  }

  gameBoardSetup() {
    let dataValTemp: string[] = [];
    const totalIndex = Math.pow(this.gameType!.gridSize, 2) / 2;
    this.nonMatchedItem = totalIndex;
    if (this.gameType!.gameTheme === 'number') {
      dataValTemp = [...Array(totalIndex).keys()].map((a) =>
        (a + 1).toString()
      );
    } else {
      dataValTemp = faIconList.slice(0, totalIndex);
    }

    const dataVal: MemoryDataSet[] = [...dataValTemp, ...dataValTemp].map(
      (data) => {
        return {
          value: data,
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
    if (this.gameType!.numberOfPlayers === 1) {
      this.clickCounter++;
      if (this.clickCounter === 1) {
        this.timerStart();
      }
    }

    this.memoryDataSet[idx].opened = true;
    if (this.lastTwoClickedIdx.length === 2) {
      this.lastTwoClickedIdx = [];
    }
    this.lastTwoClickedIdx.push(idx);
    if (this.lastTwoClickedIdx.length === 2) {
      if (
        this.memoryDataSet[this.lastTwoClickedIdx[0]]?.value !==
        this.memoryDataSet[this.lastTwoClickedIdx[1]]?.value
      ) {
        this.memoryDataSet[this.lastTwoClickedIdx[0]].opened = false;
        this.memoryDataSet[this.lastTwoClickedIdx[1]].opened = false;
        this.currentPlayerChange();
      } else {
        this.memoryDataSet[this.lastTwoClickedIdx[0]].matched = true;
        this.memoryDataSet[this.lastTwoClickedIdx[1]].matched = true;
        this.playerIdx.map((player) => {
          if (player.current) {
            player.points++;
          }
        });
        if (!--this.nonMatchedItem) {
          clearTimeout(this.timerSub$);
          this.playerIdx = [...this.playerIdx];
          (this.dialog.nativeElement as HTMLDialogElement).showModal();
        }
      }
    }
  }

  currentPlayerChange() {
    for (let i = 0; i < this.playerIdx.length; i++) {
      const player = this.playerIdx[i];
      if (player.current) {
        if (i === this.playerIdx.length - 1) {
          this.playerIdx[0].current = true;
        } else {
          this.playerIdx[i + 1].current = true;
        }
        player.current = false;
        break;
      }
    }
  }

  restartCall() {
    (this.dialog.nativeElement as HTMLDialogElement).close();
    this.cleanUp();
    this.dataLoad();
    this.gameBoardSetup();
  }

  newSetup() {
    this.router.navigateByUrl('/home');
  }

  cleanUp() {
    this.lastTwoClickedIdx = [];
    this.clickCounter = 0;
    this.timer = { mm: '00', ss: '00' };
    clearInterval(this.timerSub$);
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }
}
