import { Color, Sprite } from "pixi.js";

export type TileType = "grass" | "water" | "sand" | "mountain" | "mountainPeak";

export type ResourceType = "trees" | "rocks" | "fish" | "food" | "nothing";

export type UnitType = "soldier" | "builder";
export type StructureType = "cityCenter" | "farm" | "mine" | "lumberMill";

export interface GameCity {
  name: string;
  player: GamePlayer;
  centerTile: GameTile;
  tiles: GameTile[];
}

export interface GameResource {
  type: ResourceType;
  sprite: Sprite;
}

export interface GameUnit {
  type: UnitType;
  sprite: Sprite;
  tile: GameTile;
  tilesMovedThisTurn: number;
  player: GamePlayer;
  health: number;
}

export interface GameStructure {
  type: StructureType;
  sprite: Sprite;
  tile: GameTile;
  player: GamePlayer;
}

export interface GameTile {
  sprite?: Sprite;
  type: TileType;
  offset: [number, number];
  resource?: GameResource;
  units: GameUnit[];
  structure?: GameStructure;
  city?: GameCity;
  leftNeighbor?: GameTile;
  topLeftNeighbor?: GameTile;
  topRightNeighbor?: GameTile;
  rightNeighbor?: GameTile;
  bottomLeftNeighbor?: GameTile;
  bottomRightNeighbor?: GameTile;
}

export interface GamePlayer {
  name: string;
  units: GameUnit[];
  cities: GameCity[];
  active: boolean;
  color: Color;
}

export type NeighborSide =
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";
