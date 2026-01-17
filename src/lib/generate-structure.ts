import { Application, Renderer, Sprite } from "pixi.js";
import { structureTextures } from "./textures";
import { GamePlayer, GameStructure, GameTile, StructureType } from "../types";
import { tileHeight, tileWidth } from "./map-generation";
import { STRUCTURE_ICON_SIZE } from "../config";

export const generateStructure = (
  app: Application<Renderer>,
  player: GamePlayer,
  tile: GameTile,
  type: StructureType
) => {
  const sprite = new Sprite(structureTextures[type]);
  // Center the sprite's anchor point
  sprite.anchor.set(0.5);

  // Move the sprite to the center of the screen
  sprite.position.set(
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 + tile.offset[1] * tileHeight
  );

  sprite.scale.set(STRUCTURE_ICON_SIZE);

  app.stage.addChild(sprite);

  const structure: GameStructure = {
    player,
    sprite,
    tile,
    type,
  };
  return structure;
};
