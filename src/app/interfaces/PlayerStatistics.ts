export interface PlayerStatistics {
  playerId: number;
  playerName: string | null;
  playerFirstName: string | null;
  clubId: number;
  clubName: string | null;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface PlayerLeader {
  playerId: number;
  name: string;
  clubs: string[];
  goals: number;
  assists: number;
  rank: number;
}
