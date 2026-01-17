import { Color } from "pixi.js";
import { ResourceType, TileType } from "./types";

export const MAP_SIZE = 3;
export const PLAYER_COUNT = 2;

export const RESOURCE_ICON_SIZE = 0.4;
export const UNIT_ICON_SIZE = 0.5;
export const STRUCTURE_ICON_SIZE = 0.7;
export const UNIT_OFFSET = 0.1;
export const UNIT_INDICATOR_OFFSET = 105;
export const HEALTH_BAR_WIDTH = 100;
export const HEALTH_BAR_HEIGHT = 20;
export const HEALTH_BAR_OFFSET = 165;

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

export const STRUCTURE_PLACEMENT_MAP: {
  [type: string]: { resourceTypes?: ResourceType[]; tileTypes?: TileType[] };
} = {
  farm: {
    resourceTypes: ["food", "nothing"],
    tileTypes: ["grass"],
  },
  mine: {
    resourceTypes: ["rocks", "nothing"],
    tileTypes: ["mountain"],
  },
  lumberMill: {
    resourceTypes: ["trees"],
  },
  cityCenter: {},
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

export const UNIT_BASE_HEALTH: {
  [type: string]: number;
} = {
  builder: 100,
  soldier: 200,
};

export const UNIT_BASE_ATTACK: {
  [type: string]: number;
} = {
  builder: 0,
  soldier: 150,
};

export const UNIT_PASSIVE_MAP: {
  [type: string]: boolean;
} = {
  builder: true,
  soldier: false,
};

export const PLAYER_COLORS: Color[] = [
  new Color({ r: 200, g: 50, b: 50 }),
  new Color({ r: 50, g: 150, b: 50 }),
  new Color({ r: 0, g: 0, b: 255 }),
  new Color({ r: 0, g: 255, b: 255 }),
  new Color({ r: 255, g: 255, b: 0 }),
  new Color({ r: 255, g: 0, b: 255 }),
];

export const COLORS = {
  unitIndicatorBorder: new Color({ r: 0, g: 0, b: 0 }),
  movementTileBorderColor: new Color({ r: 255, g: 255, b: 255 }),
  movementTileFillColor: new Color({ r: 255, g: 255, b: 255, a: 0.1 }),
  attackTileBorderColor: new Color({ r: 255, g: 0, b: 0 }),
  attackTileFillColor: new Color({ r: 255, g: 0, b: 0, a: 0.3 }),
  healthBarColor: new Color({ r: 255, g: 0, b: 0 }),
};
