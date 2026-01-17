import { Application, Renderer } from "pixi.js";
import { GameCity, GamePlayer, GameTile } from "../types";
import { getTileNeighbors } from "./get-tile-neighbors";
import { createTileOutline } from "./create-tile-outline";
import { generateStructure } from "./generate-structure";

export const generateCity = (
  app: Application<Renderer>,
  players: GamePlayer[],
  name: string,
  tile: GameTile
) => {
  const activePlayer = players.find((p) => p.active)!;
  const cityTiles = [tile, ...getTileNeighbors(tile)].filter(
    (tile) => !tile.city
  );

  const city: GameCity = {
    name,
    centerTile: tile,
    tiles: cityTiles,
    player: activePlayer,
  };

  cityTiles.forEach((tile) => (tile.city = city));

  const cityCenter = generateStructure(app, activePlayer, tile, "cityCenter");

  createTileOutline(app, cityTiles, activePlayer.color);

  tile.structure = cityCenter;

  return { city, cityCenter };
};
