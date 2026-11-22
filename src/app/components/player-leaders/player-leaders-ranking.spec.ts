import { describe, expect, it } from 'vitest';
import { PlayerStatistics } from '../../interfaces/PlayerStatistics';
import { rankPlayers } from './player-leaders-ranking';

describe('rankPlayers', () => {
  const rows: PlayerStatistics[] = [
    { playerId: 1, playerName: 'Ali', playerFirstName: 'Sami', clubId: 10, clubName: 'Club A', goals: 2, assists: 0, yellowCards: 0, redCards: 0 },
    { playerId: 1, playerName: 'Ali', playerFirstName: 'Sami', clubId: 20, clubName: 'Club B', goals: 3, assists: 1, yellowCards: 0, redCards: 0 },
    { playerId: 2, playerName: 'Ben', playerFirstName: 'Karim', clubId: 30, clubName: 'Club C', goals: 5, assists: 2, yellowCards: 0, redCards: 0 },
    { playerId: 3, playerName: 'Slim', playerFirstName: 'Hedi', clubId: 30, clubName: 'Club C', goals: 0, assists: 3, yellowCards: 1, redCards: 0 },
    { playerId: 4, playerName: 'Zero', playerFirstName: 'Test', clubId: 30, clubName: 'Club C', goals: 0, assists: 0, yellowCards: 1, redCards: 0 }
  ];

  it('combines a transferred player and gives equal goal totals the same rank', () => {
    const scorers = rankPlayers(rows, 'goals');
    expect(scorers.map(player => [player.playerId, player.goals, player.rank])).toEqual([[2, 5, 1], [1, 5, 1]]);
    expect(scorers[1].clubs).toEqual(['Club A', 'Club B']);
    expect(scorers[1].assists).toBe(1);
  });

  it('ranks assists independently and excludes players with no assists', () => {
    const passers = rankPlayers(rows, 'assists');
    expect(passers.map(player => [player.playerId, player.assists, player.rank]))
      .toEqual([[3, 3, 1], [2, 2, 2], [1, 1, 3]]);
  });
});
