import { GameTile, TileType } from "../types";
import { getTileNeighbors } from "./get-tile-neighbors";

export const findPathLength = (
  start: GameTile,
  end: GameTile,
  allowedTileTypes: TileType[]
) => {
  const validTiles = new Set<GameTile>([start]);
  let length = 0;

  while (length < 100) {
    length += 1;
    const tilesToCheck = Array.from(validTiles);

    tilesToCheck.forEach((tile) => {
      const neighbors = getTileNeighbors(tile);
      neighbors.forEach((neighbor) => {
        if (neighbor.units.length && neighbor !== end) return;
        if (!allowedTileTypes.includes(neighbor.type)) return;
        validTiles.add(neighbor);
      });
    });
    if (validTiles.has(end)) return length;
  }

  console.error("Couldnt find path to target tile");
};
