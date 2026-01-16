import { PLAYER_COLORS, PLAYER_COUNT } from "../config";
import { GamePlayer } from "../types";

export const generatePlayers = () => {
  const players: GamePlayer[] = [];
  for (let i = 0; i < PLAYER_COUNT; i += 1) {
    players.push({
      name: `Player ${i}`,
      units: [],
      active: false,
      color: PLAYER_COLORS[i],
    });
  }

  players[0].active = true;

  return players;
};
