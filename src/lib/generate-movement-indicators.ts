import { Application, Renderer, Sprite } from "pixi.js";
import { UNIT_MOVEMENTS } from "../config";
import { GameTile, GameUnit } from "../types";
import { getTileNeighbors } from "./get-tile-neighbors";
import { miscTextures } from "./textures";
import { tileHeight, tileWidth } from "./map-generation";

const calcMovementTiles = (unit: GameUnit) => {
  const movementData = UNIT_MOVEMENTS[unit.type];
  let movementLeft = movementData.tilesPerTurn;

  const validTiles = new Set<GameTile>([unit.tile]);

  while (movementLeft > unit.tilesMovedThisTurn) {
    movementLeft -= 1;
    const tilesToCheck = Array.from(validTiles);
    tilesToCheck.forEach((tile) => {
      const neighbors = getTileNeighbors(tile);
      neighbors.forEach((neighbor) => {
        if (neighbor.units.length) return;
        if (!movementData.tileTypes.includes(neighbor.type)) return;
        validTiles.add(neighbor);
      });
    });
  }

  validTiles.delete(unit.tile);

  return Array.from(validTiles);
};

export const generateMovementIndicators = (
  app: Application<Renderer>,
  unit: GameUnit
) => {
  const tiles = calcMovementTiles(unit);

  return tiles.map((tile) => {
    const sprite = new Sprite(miscTextures["empty"]);
    sprite.width = tileWidth;
    sprite.height = tileHeight;

    // Center the sprite's anchor point
    sprite.anchor.set(0.5);

    // Move the sprite to the center of the screen
    sprite.position.set(
      app.screen.width / 2 + tile.offset[0] * tileWidth,
      app.screen.height / 2 + tile.offset[1] * tileHeight
    );

    // Add the sprite to the stage
    app.stage.addChild(sprite);

    return {
      sprite,
      tile,
    };
  });
};
