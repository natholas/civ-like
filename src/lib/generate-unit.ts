import { Application, Graphics, Renderer, Sprite } from "pixi.js";
import { GamePlayer, GameTile, GameUnit, UnitType } from "../types";
import { iconTextures, unitTextures } from "./textures";
import {
  COLORS,
  UNIT_BASE_HEALTH,
  UNIT_ICON_SIZE,
  UNIT_OFFSET,
} from "../config";
import { tileHeight, tileWidth } from "./map-generation";

const unitIconSize = Math.floor(tileWidth * UNIT_ICON_SIZE);

export const generateUnit = (
  app: Application<Renderer>,
  tile: GameTile,
  type: UnitType,
  player: GamePlayer
): GameUnit => {
  // Create a bunny Sprite
  const texture = unitTextures[type];
  const sprite = new Sprite(texture);
  sprite.width = unitIconSize;
  sprite.height = unitIconSize;

  // Center the sprite's anchor point
  sprite.anchor.set(0.5);

  // Move the sprite to the center of the screen
  sprite.position.set(
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 +
      tile.offset[1] * tileHeight +
      tileHeight * UNIT_OFFSET
  );

  // Add the sprite to the stage
  app.stage.addChild(sprite);

  const unit: GameUnit = {
    sprite,
    type,
    tile,
    player,
    tilesMovedThisTurn: 0,
    health: UNIT_BASE_HEALTH[type],
  };
  tile.units.push(unit);

  const indicator = new Graphics();
  indicator.circle(0, -120, 32);
  indicator.fill({ color: COLORS.unitIndicatorBorder });
  indicator.closePath();

  const iconSprite = new Sprite(iconTextures[unit.type]);
  iconSprite.anchor.set(0.5);
  iconSprite.position.set(0, -120);
  iconSprite.scale.set(0.25);

  indicator.circle(0, -120, 28);

  indicator.fill({ color: player.color });

  sprite.addChild(indicator);
  indicator.addChild(iconSprite);

  return unit;
};
