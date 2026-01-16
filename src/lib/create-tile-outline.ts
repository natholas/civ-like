import { Application, Graphics, Renderer } from "pixi.js";
import { GameTile } from "../types";
import { tileHeight, tileWidth } from "./map-generation";

export const createTileOutline = (
  app: Application<Renderer>,
  tiles: GameTile[]
) => {
  const tileSide = tileWidth / 1.73;
  const lines: [[number, number], [number, number]][] = [];

  for (const tile of tiles) {
    if (!tile.rightNeighbor || !tiles.includes(tile.rightNeighbor)) {
      lines.push([
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth + tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide / 2,
        ],
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth + tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight + tileSide / 2,
        ],
      ]);
    }

    if (!tile.leftNeighbor || !tiles.includes(tile.leftNeighbor)) {
      lines.push([
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth - tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide / 2,
        ],
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth - tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight + tileSide / 2,
        ],
      ]);
    }

    if (!tile.bottomLeftNeighbor || !tiles.includes(tile.bottomLeftNeighbor)) {
      lines.push([
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth - tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight + tileSide / 2,
        ],
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth,
          app.screen.height / 2 + tile.offset[1] * tileHeight + tileHeight / 2,
        ],
      ]);
    }

    if (
      !tile.bottomRightNeighbor ||
      !tiles.includes(tile.bottomRightNeighbor)
    ) {
      lines.push([
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth + tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight + tileSide / 2,
        ],
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth,
          app.screen.height / 2 + tile.offset[1] * tileHeight + tileHeight / 2,
        ],
      ]);
    }

    if (!tile.topRightNeighbor || !tiles.includes(tile.topRightNeighbor)) {
      lines.push([
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth + tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide / 2,
        ],
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth,
          app.screen.height / 2 + tile.offset[1] * tileHeight - tileHeight / 2,
        ],
      ]);
    }

    if (!tile.topLeftNeighbor || !tiles.includes(tile.topLeftNeighbor)) {
      lines.push([
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth - tileWidth / 2,
          app.screen.height / 2 + tile.offset[1] * tileHeight - tileSide / 2,
        ],
        [
          app.screen.width / 2 + tile.offset[0] * tileWidth,
          app.screen.height / 2 + tile.offset[1] * tileHeight - tileHeight / 2,
        ],
      ]);
    }
  }
  const border = new Graphics();

  let nextLine = lines[0];
  lines.splice(0, 1);

  border.moveTo(nextLine[1][0], nextLine[1][1]);

  const joinLimit = 1;

  while (lines.length > 0) {
    const line = lines.find((line) => {
      return line.some((p) => {
        if (Math.abs(p[0] - nextLine[1][0]) > joinLimit) return;
        if (Math.abs(p[1] - nextLine[1][1]) > joinLimit) return;
        return true;
      });
    })!;
    if (!line) {
      throw new Error("No Next line");
    }

    if (
      Math.abs(line[0][0] - nextLine[1][0]) > joinLimit ||
      Math.abs(line[0][1] - nextLine[1][1]) > joinLimit
    ) {
      const temp = line[0];
      line[0] = line[1];
      line[1] = temp;
    }

    border.lineTo(line[1][0], line[1][1]);
    lines.splice(lines.indexOf(line), 1);
    nextLine = line;
  }

  border.closePath();

  border.stroke({ color: 0xffffff, width: 8 });
  app.stage.addChild(border);
  return border;
};
