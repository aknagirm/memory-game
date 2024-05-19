type GameTheme = 'number' | 'icons';

type NumberOfPlayers = 1 | 2 | 3 | 4;

type GridSize = 4 | 6;

export interface GameType {
  gameTheme: GameTheme;
  numberOfPlayers: NumberOfPlayers;
  gridSize: GridSize;
}

export interface MemoryDataSet {
  value: string;
  opened: boolean;
}

export interface PlayerPonits {
  title: string;
  points: number;
  current: boolean;
}
