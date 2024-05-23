import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { GameType, PlayerPonits } from 'src/app/model/game-type.model';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss'],
})
export class ResultDialogComponent implements OnChanges {
  @Input() gameType: GameType | undefined;
  @Input() playerIdx: PlayerPonits[] = [];
  @Input() timer = { mm: '00', ss: '00' };
  @Input() clickCounter: number = 0;
  @Output() restartCall = new EventEmitter();
  highestPoints: number = -1;
  winnerStatus = '';

  constructor(private router: Router) {}

  ngOnChanges(): void {
    console.log(this.gameType, this.playerIdx);
    if (this.gameType?.numberOfPlayers! > 1) {
      this.winnerCheck();
    } else {
      this.winnerStatus = 'You did it!';
    }
  }

  winnerCheck() {
    this.playerIdx.forEach((player) => {
      this.highestPoints =
        this.highestPoints < player.points ? player.points : this.highestPoints;
    });
    this.playerIdx.sort((a, b) => b.points - a.points);
    this.playerIdx.map((a) => {
      if (a.points === this.highestPoints) {
        a.winner = true;
        this.winnerStatus =
          this.winnerStatus === '' ? `${a.title} Win!` : "It's a tie!";
      }
    });
  }

  restart() {
    this.restartCall.emit();
  }

  newSetup() {
    this.router.navigateByUrl('/home');
  }
}
