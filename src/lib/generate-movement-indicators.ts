import { Application, Renderer, Sprite } from "pixi.js";
import { UNIT_MOVEMENTS } from "../config";
import { GameTile, GameUnit } from "../types";
import { getTileNeighbors } from "./get-tile-neighbors";
import { miscTextures } from "./textures";
import { tileHeight, tileWidth } from "./map-generation";

const calcMovementTiles = (unit: GameUnit) => {
  const movementData = UNIT_MOVEMENTS[unit.type];
  let movementLeft = movementData.tilesPerTurn - unit.tilesMovedThisTurn;

  const validTiles: { tile: GameTile; movementLeft: number }[] = [
    { tile: unit.tile, movementLeft },
  ];

  while (movementLeft > 0) {
    movementLeft -= 1;
    const tilesToCheck = Array.from(validTiles);
    tilesToCheck.forEach((tile) => {
      const neighbors = getTileNeighbors(tile.tile);
      neighbors.forEach((neighbor) => {
        if (neighbor.units.length) return;
        if (!movementData.tileTypes.includes(neighbor.type)) return;
        if (validTiles.some((t) => t.tile === neighbor)) return;
        validTiles.push({ tile: neighbor, movementLeft });
      });
    });
  }

  validTiles.splice(0, 1);

  return validTiles;
};

export const generateMovementIndicators = (
  app: Application<Renderer>,
  unit: GameUnit
) => {
  const tiles = calcMovementTiles(unit);

  return tiles.map(({ tile, movementLeft }) => {
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
      movementLeft,
    };
  });
};
