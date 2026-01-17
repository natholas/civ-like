import { Application, Renderer, Sprite } from "pixi.js";
import { GameTile, GameUnit } from "../types";
import { getTileNeighbors } from "./get-tile-neighbors";
import { UNIT_MOVEMENTS, UNIT_PASSIVE_MAP } from "../config";
import { miscTextures } from "./textures";
import { tileHeight, tileWidth } from "./map-generation";

const calcAttackTiles = (
  unit: GameUnit,
  movementTiles: { tile: GameTile; movementLeft: number }[]
) => {
  if (UNIT_PASSIVE_MAP[unit.type]) return [];
  const movementData = UNIT_MOVEMENTS[unit.type];
  const attackTiles: {
    tile: GameTile;
    attackFromTile: GameTile;
    movementLeft: number;
  }[] = [];

  movementTiles.forEach((tile) => {
    if (tile.movementLeft <= 0) return;
    const neighbors = getTileNeighbors(tile.tile);
    neighbors.forEach((neighbor) => {
      if (!movementData.tileTypes.includes(neighbor.type)) return;
      const otherPlayerUnits = neighbor.units.filter(
        (u) => u.player !== unit.player
      );
      if (!otherPlayerUnits.length) return;
      const existingAttackTile = attackTiles.find((t) => t.tile === neighbor);
      if (existingAttackTile) {
        if (existingAttackTile.movementLeft < tile.movementLeft) {
          return;
        } else {
          attackTiles.splice(attackTiles.indexOf(existingAttackTile), 1);
        }
      }

      const attackingFromUnitTile = getTileNeighbors(unit.tile).includes(
        neighbor
      );
      const attackFromTile = attackingFromUnitTile ? unit.tile : tile.tile;
      attackTiles.push({
        tile: neighbor,
        attackFromTile,
        movementLeft: tile.movementLeft,
      });
    });
  });

  return attackTiles;
};

export const generateAttackIndicators = (
  app: Application<Renderer>,
  unit: GameUnit,
  movementTiles: { tile: GameTile; movementLeft: number }[]
) => {
  const tiles = calcAttackTiles(unit, movementTiles);

  return tiles.map(({ tile, attackFromTile }) => {
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
      attackFromTile,
    };
  });
};
