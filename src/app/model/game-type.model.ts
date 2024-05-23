export type GameTheme = 'number' | 'icons';

export type NumberOfPlayers = 1 | 2 | 3 | 4;

export type GridSize = 4 | 6;

export interface GameType {
  gameTheme: GameTheme;
  numberOfPlayers: NumberOfPlayers;
  gridSize: GridSize;
}

export interface MemoryDataSet {
  value: string;
  opened: boolean;
  matched: boolean;
}

export interface PlayerPonits {
  title: string;
  points: number;
  current: boolean;
  winner?: boolean;
}
