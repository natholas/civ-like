import { TileType } from "./types";

export const MAP_SIZE = 8;

export const TILE_TYPE_WEIGHTS: { [key: string]: number } = {
  grass: 5,
  water: 5,
  sand: 3,
  forest: 2,
  mountain: 1,
  mountainPeak: 2,
};

export const TYPE_TOUCH_MAP: { [type: string]: TileType[] } = {
  grass: ["grass", "forest", "sand", "mountain"],
  water: ["water", "sand"],
  sand: ["sand", "water", "grass"],
  forest: ["forest", "grass", "mountain"],
  mountain: ["mountain", "forest", "grass", "mountainPeak"],
  mountainPeak: ["mountainPeak", "mountain"],
};
