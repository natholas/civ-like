import { Sprite } from "pixi.js";

export type TileType = "grass" | "water" | "sand" | "mountain" | "mountainPeak";

export type ResourceType = "trees" | "rocks" | "fish" | "food" | "nothing";

export type UnitType = "soldier" | "builder";

export interface GameResource {
  type: ResourceType;
  sprite: Sprite;
}

export interface GameUnit {
  type: UnitType;
  sprite: Sprite;
  tile: GameTile;
  tilesMovedThisTurn: number;
}

export interface GameTile {
  sprite?: Sprite;
  type: TileType;
  offset: [number, number];
  resource?: GameResource;
  units: GameUnit[];
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
