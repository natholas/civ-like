import { Application, Graphics, Renderer, Sprite } from "pixi.js";
import { GamePlayer, GameTile, GameUnit, UnitType } from "../types";
import { iconTextures, unitTextures } from "./textures";
import {
  COLORS,
  HEALTH_BAR_HEIGHT,
  HEALTH_BAR_OFFSET,
  HEALTH_BAR_WIDTH,
  UNIT_BASE_HEALTH,
  UNIT_ICON_SIZE,
  UNIT_INDICATOR_OFFSET,
  UNIT_OFFSET,
} from "../config";
import { tileHeight, tileWidth } from "./map-generation";

const unitIconSize = Math.floor(tileWidth * UNIT_ICON_SIZE);

const getUnitPosition = (app: Application<Renderer>, tile: GameTile) => {
  return [
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 +
      tile.offset[1] * tileHeight +
      tileHeight * UNIT_OFFSET,
  ];
};

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
  const [x, y] = getUnitPosition(app, tile);
  sprite.position.set(x, y);

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

  drawUnitIndicator(unit);
  adjustUnitsInTile(app, unit.tile);

  return unit;
};

export const drawUnitIndicator = (unit: GameUnit) => {
  // destroy old indicator
  unit.sprite.children.forEach((s) => s.destroy());

  // Draw new unit indicator
  const indicator = new Graphics();
  indicator.circle(0, -UNIT_INDICATOR_OFFSET, 32);
  indicator.fill({ color: COLORS.unitIndicatorBorder });
  indicator.closePath();

  const iconSprite = new Sprite(iconTextures[unit.type]);
  iconSprite.anchor.set(0.5);
  iconSprite.position.set(0, -UNIT_INDICATOR_OFFSET);
  iconSprite.scale.set(0.25);

  indicator.circle(0, -UNIT_INDICATOR_OFFSET, 28);
  indicator.fill({ color: unit.player.color });
  indicator.addChild(iconSprite);

  // draw health bar
  if (unit.health < UNIT_BASE_HEALTH[unit.type]) {
    const healthPercent = unit.health / UNIT_BASE_HEALTH[unit.type];

    indicator.rect(
      -HEALTH_BAR_WIDTH / 2,
      -HEALTH_BAR_OFFSET,
      HEALTH_BAR_WIDTH,
      HEALTH_BAR_HEIGHT
    );

    indicator.fill({ color: COLORS.unitIndicatorBorder });

    indicator.closePath();

    const padding = 4;

    indicator.rect(
      -HEALTH_BAR_WIDTH / 2 + padding,
      -HEALTH_BAR_OFFSET + padding,
      HEALTH_BAR_WIDTH * healthPercent - padding * 2,
      HEALTH_BAR_HEIGHT - padding * 2
    );
    indicator.fill({ color: COLORS.healthBarColor });
  }

  unit.sprite.addChild(indicator);
};

export const adjustUnitsInTile = (
  app: Application<Renderer>,
  tile: GameTile
) => {
  const offset = tileWidth / 5;
  const unitCount = tile.units.length;
  const totalOffset = (unitCount - 1) * offset;
  let currentOffset = -totalOffset / 2;

  tile.units.forEach((unit) => {
    const [x, y] = getUnitPosition(app, unit.tile);
    unit.sprite.position.set(x + currentOffset, y);
    currentOffset += offset;
  });
};
