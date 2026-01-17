import { Application, Graphics, Renderer } from "pixi.js";
import { GameTile } from "../types";
import { tileHeight, tileWidth } from "./map-generation";
import { COLORS } from "../config";

export const createTileOutlines = (
  app: Application<Renderer>,
  tiles: GameTile[]
) => {
  const tileSide = tileWidth / 1.73;
  const border = new Graphics();

  for (const tile of tiles) {
    border.moveTo(
      app.screen.width / 2 + tile.offset[0] * tileWidth + tileWidth / 2,
      app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide / 2
    );

    border.lineTo(
      app.screen.width / 2 + tile.offset[0] * tileWidth + tileWidth / 2,
      app.screen.height / 2 + tile.offset[1] * tileHeight + tileSide / 2
    );

    border.lineTo(
      app.screen.width / 2 + tile.offset[0] * tileWidth,
      app.screen.height / 2 + tile.offset[1] * tileHeight + tileHeight / 2
    );

    border.lineTo(
      app.screen.width / 2 + tile.offset[0] * tileWidth - tileWidth / 2,
      app.screen.height / 2 + tile.offset[1] * tileHeight + tileSide / 2
    );

    border.lineTo(
      app.screen.width / 2 + tile.offset[0] * tileWidth - tileWidth / 2,
      app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide / 2
    );

    border.lineTo(
      app.screen.width / 2 + tile.offset[0] * tileWidth,
      app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide
    );

    border.lineTo(
      app.screen.width / 2 + tile.offset[0] * tileWidth + tileWidth / 2,
      app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide / 2
    );
  }

  border.closePath();

  border.stroke({ color: COLORS.attackTileBorderColor, width: 10 });
  border.fill({ color: COLORS.attackTileFillColor });
  app.stage.addChild(border);
  return border;
};
