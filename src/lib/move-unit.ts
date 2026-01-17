import { Application, Renderer } from "pixi.js";
import { GameTile, GameUnit } from "../types";
import { findPathLength } from "./find-path-length";
import { UNIT_MOVEMENTS, UNIT_OFFSET } from "../config";
import { tileHeight, tileWidth } from "./map-generation";
import { adjustUnitsInTile } from "./generate-unit";

export const moveUnit = (
  app: Application<Renderer>,
  unit: GameUnit,
  tile: GameTile
) => {
  const oldTile = unit.tile;
  const pathLength = findPathLength(
    oldTile,
    tile,
    UNIT_MOVEMENTS[unit.type].tileTypes
  )!;

  unit.tile.units = unit.tile.units.filter((u) => u !== unit);
  unit.tile = tile;
  unit.sprite.position.set(
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 +
      tile.offset[1] * tileHeight +
      tileHeight * UNIT_OFFSET
  );
  tile.units.push(unit);
  unit.tilesMovedThisTurn += pathLength;

  adjustUnitsInTile(app, oldTile);
  adjustUnitsInTile(app, tile);
};
