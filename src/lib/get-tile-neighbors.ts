import { GameTile } from "../types";

export const getTileNeighbors = (tile: GameTile): GameTile[] => {
  return [
    tile.bottomLeftNeighbor,
    tile.bottomRightNeighbor,
    tile.leftNeighbor,
    tile.rightNeighbor,
    tile.topLeftNeighbor,
    tile.topRightNeighbor,
  ].filter(Boolean) as GameTile[];
};
