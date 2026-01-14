import { Sprite } from "pixi.js";

export type TileType =
  | "grass"
  | "water"
  | "sand"
  | "forest"
  | "mountain"
  | "mountainPeak";

export interface GameTile {
  sprite?: Sprite;
  type: TileType;
  offset: [number, number];
  leftNeighbor?: GameTile;
  topLeftNeighbor?: GameTile;
  topRightNeighbor?: GameTile;
  rightNeighbor?: GameTile;
  bottomLeftNeighbor?: GameTile;
  bottomRightNeighbor?: GameTile;
}

export type NeighborSide =
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";
