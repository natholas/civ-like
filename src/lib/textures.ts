import { Assets } from "pixi.js";

export const tileTextures = {
  grass: await Assets.load("/assets/tile-grass.svg"),
  water: await Assets.load("/assets/tile-water.svg"),
  sand: await Assets.load("/assets/tile-sand.svg"),
  mountain: await Assets.load("/assets/tile-mountain.svg"),
  mountainPeak: await Assets.load("/assets/tile-mountain-peak.svg"),
};

export const resourceTextures = {
  trees: await Assets.load("/assets/resource-trees.svg"),
  rocks: await Assets.load("/assets/resource-rocks.svg"),
  fish: await Assets.load("/assets/resource-fish.svg"),
  food: await Assets.load("/assets/resource-food.svg"),
  nothing: undefined,
} as const;

export const unitTextures = {
  soldier: await Assets.load("/assets/soldier.svg"),
  builder: await Assets.load("/assets/builder.svg"),
} as const;

export const iconTextures = {
  builder: await Assets.load("/assets/icon-builder.svg"),
  soldier: await Assets.load("/assets/icon-soldier.svg"),
} as const;

export const miscTextures = {
  empty: await Assets.load("/assets/tile-empty.svg"),
} as const;

export const structureTextures = {
  cityCenter: await Assets.load("/assets/city-center.svg"),
  farm: await Assets.load("/assets/city-center.svg"),
  mine: await Assets.load("/assets/city-center.svg"),
  lumberMill: await Assets.load("/assets/city-center.svg"),
} as const;
