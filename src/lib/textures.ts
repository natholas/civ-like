import { Assets } from "pixi.js";

export const textures = {
  grass: await Assets.load("/assets/tile-grass.svg"),
  water: await Assets.load("/assets/tile-water.svg"),
  sand: await Assets.load("/assets/tile-sand.svg"),
  mountain: await Assets.load("/assets/tile-mountain.svg"),
  mountainPeak: await Assets.load("/assets/tile-mountain-peak.svg"),
  trees: await Assets.load("/assets/resource-trees.svg"),
  rocks: await Assets.load("/assets/resource-rocks.svg"),
  fish: await Assets.load("/assets/resource-fish.svg"),
  food: await Assets.load("/assets/resource-food.svg"),
  soldier: await Assets.load("/assets/soldier.svg"),
  builder: await Assets.load("/assets/builder.svg"),
  movementIndicator: await Assets.load("/assets/movement-indicator.svg"),
  nothing: undefined,
} as const;
