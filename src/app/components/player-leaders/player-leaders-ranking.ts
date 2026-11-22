import { PlayerLeader, PlayerStatistics } from '../../interfaces/PlayerStatistics';

interface PlayerTotal extends Omit<PlayerLeader, 'rank' | 'clubs'> {
  clubsById: Map<number, string>;
}

export function rankPlayers(rows: PlayerStatistics[], metric: 'goals' | 'assists'): PlayerLeader[] {
  const totals = new Map<number, PlayerTotal>();
  for (const row of rows) {
    let player = totals.get(row.playerId);
    if (!player) {
      player = {
        playerId: row.playerId,
        name: [row.playerFirstName, row.playerName].filter(Boolean).join(' ') || `Joueur #${row.playerId}`,
        goals: 0,
        assists: 0,
        clubsById: new Map<number, string>()
      };
      totals.set(row.playerId, player);
    }
    player.goals += row.goals;
    player.assists += row.assists;
    player.clubsById.set(row.clubId, row.clubName || `Club #${row.clubId}`);
  }

  const secondary = metric === 'goals' ? 'assists' : 'goals';
  const sorted = [...totals.values()]
    .filter(player => player[metric] > 0)
    .sort((a, b) => b[metric] - a[metric] || b[secondary] - a[secondary]
      || a.name.localeCompare(b.name) || a.playerId - b.playerId);

  let rank = 0;
  return sorted.map((player, index) => {
    if (index === 0 || player[metric] !== sorted[index - 1][metric]) rank = index + 1;
    return {
      playerId: player.playerId,
      name: player.name,
      clubs: [...player.clubsById.values()].sort((a, b) => a.localeCompare(b)),
      goals: player.goals,
      assists: player.assists,
      rank
    };
  });
}
