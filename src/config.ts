import { ResourceType, TileType } from "./types";

export const MAP_SIZE = 5;

export const RESOURCE_ICON_SIZE = 0.5;
export const UNIT_ICON_SIZE = 0.75;

export const TILE_TYPE_WEIGHTS: { [key: string]: number } = {
  grass: 5,
  water: 5,
  sand: 3,
  mountain: 1,
  mountainPeak: 2,
};

export const TYPE_TOUCH_MAP: { [type: string]: TileType[] } = {
  grass: ["grass", "sand", "mountain"],
  water: ["water", "sand"],
  sand: ["sand", "water", "grass"],
  mountain: ["mountain", "grass", "mountainPeak"],
  mountainPeak: ["mountainPeak", "mountain"],
};

export const RESOURCE_TILE_MAP: {
  [type: string]: { type: ResourceType; weight: number }[];
} = {
  grass: [
    { type: "nothing", weight: 4 },
    { type: "trees", weight: 1 },
    { type: "food", weight: 1 },
  ],
  water: [
    { type: "nothing", weight: 4 },
    { type: "fish", weight: 1 },
  ],
  sand: [],
  mountain: [
    { type: "nothing", weight: 1 },
    { type: "rocks", weight: 1 },
  ],
  mountainPeak: [],
};

export const UNIT_MOVEMENTS: {
  [type: string]: { tilesPerTurn: number; tileTypes: TileType[] };
} = {
  soldier: {
    tilesPerTurn: 2,
    tileTypes: ["grass", "sand"],
  },
  builder: {
    tilesPerTurn: 1,
    tileTypes: ["grass", "sand", "mountain"],
  },
};
