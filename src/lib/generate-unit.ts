import { Application, Renderer, Sprite } from "pixi.js";
import { GameTile, GameUnit, UnitType } from "../types";
import { textures } from "./textures";
import { UNIT_ICON_SIZE } from "../config";
import { tileHeight, tileWidth } from "./map-generation";

const unitIconSize = Math.floor(tileWidth * UNIT_ICON_SIZE);

export const generateUnit = (
  app: Application<Renderer>,
  tile: GameTile,
  type: UnitType
): GameUnit => {
  // Create a bunny Sprite
  const texture = textures[type];
  const sprite = new Sprite(texture);
  sprite.width = unitIconSize;
  sprite.height = unitIconSize;

  // Center the sprite's anchor point
  sprite.anchor.set(0.5);

  // Move the sprite to the center of the screen
  sprite.position.set(
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 + tile.offset[1] * tileHeight
  );

  // Add the sprite to the stage
  app.stage.addChild(sprite);

  const unit: GameUnit = {
    sprite,
    type,
    tile,
    tilesMovedThisTurn: 0,
  };
  tile.units.push(unit);

  return unit;
};
