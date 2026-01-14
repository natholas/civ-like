import { Application, Renderer, Sprite } from "pixi.js";
import {
  MAP_SIZE,
  RESOURCE_ICON_SIZE,
  RESOURCE_TILE_MAP,
  TILE_TYPE_WEIGHTS,
  TYPE_TOUCH_MAP,
} from "../config";
import { GameTile, NeighborSide, ResourceType, TileType } from "../types";
import { seededRandom } from "./seeded-random";
import { textures } from "./textures";
import { getTileNeighbors } from "./get-tile-neighbors";

export const tileWidth =
  Math.floor(
    ((Math.min(window.innerWidth, window.innerHeight * 1.1547005) /
      (MAP_SIZE * 2 + 1)) *
      0.9) /
      2
  ) * 2;

export const tileHeight = tileWidth * 1.1547005;

const resourceIconSize = Math.floor(tileWidth * RESOURCE_ICON_SIZE);

const allTypes = Object.keys(TILE_TYPE_WEIGHTS) as TileType[];
// const allResources = Object.keys(RESOURCE_TILE_MAP) as ResourceType[];

const addTile = (tiles: GameTile[], offset: [number, number]) => {
  if (
    tiles.some((t) => t.offset[0] === offset[0] && t.offset[1] === offset[1])
  ) {
    throw new Error(
      "err, tile already exists at " + offset[0] + "," + offset[1]
    );
  }

  const tile: GameTile = {
    sprite: undefined,
    offset,
    units: [],
    type: undefined as unknown as TileType,
  };

  tiles.push(tile);
  return tile;
};

const getTypesForTiles = (tiles: GameTile[]) => {
  return tiles.reduce((types, t) => {
    if (!t?.type) return types;
    types.add(t.type);
    return types;
  }, new Set<TileType>());
};

const getValidTileTypes = (tile: GameTile): TileType[] => {
  const neighbors = getTileNeighbors(tile);
  const neighborTypes = getTypesForTiles(neighbors);
  const validTypes = new Set(allTypes);

  neighborTypes.forEach((type) => {
    const canTouch = TYPE_TOUCH_MAP[type];
    validTypes.forEach((vt) => {
      if (!canTouch.includes(vt)) {
        validTypes.delete(vt);
      }
    });
  });

  return Array.from(validTypes);
};

const addWeightingToTileTypes = (types: TileType[]) => {
  const weightedTypes: TileType[] = [];

  types.forEach((type) => {
    for (let i = 0; i < TILE_TYPE_WEIGHTS[type]; i += 1) {
      weightedTypes.push(type);
    }
  });

  return weightedTypes;
};

const calcType = (tile: GameTile) => {
  if (tile.type) return;
  const validTypes = getValidTileTypes(tile);
  if (!validTypes.length) return "grass";
  const weightedTypes = addWeightingToTileTypes(validTypes);
  tile.type = weightedTypes[Math.floor(seededRandom() * weightedTypes.length)];
};

const generateTile = (app: Application<Renderer>, tile: GameTile) => {
  // Create a bunny Sprite
  const texture = textures[tile.type];
  const sprite = new Sprite(texture);
  sprite.width = tileWidth;
  sprite.height = tileHeight;

  // Center the sprite's anchor point
  sprite.anchor.set(0.5);

  // Move the sprite to the center of the screen
  sprite.position.set(
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 + tile.offset[1] * tileHeight
  );

  tile.sprite = sprite;

  // Add the sprite to the stage
  app.stage.addChild(sprite);
};

const generateResource = (
  app: Application<Renderer>,
  tile: GameTile,
  type: ResourceType
) => {
  // Create a bunny Sprite
  const texture = textures[type];
  const sprite = new Sprite(texture);
  sprite.width = resourceIconSize;
  sprite.height = resourceIconSize;

  // Center the sprite's anchor point
  sprite.anchor.set(0.5);

  // Move the sprite to the center of the screen
  sprite.position.set(
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 + tile.offset[1] * tileHeight
  );

  // Add the sprite to the stage
  app.stage.addChild(sprite);
  return sprite;
};

const connectNeighbors = (
  tile: GameTile,
  newTile: GameTile,
  neighborSide: NeighborSide
) => {
  if (neighborSide === "right") {
    tile.rightNeighbor = newTile;
    newTile.leftNeighbor = tile;
    if (tile.topRightNeighbor) {
      tile.topRightNeighbor.bottomRightNeighbor = newTile;
      newTile.topLeftNeighbor = tile.topRightNeighbor;
    }
    if (tile.bottomRightNeighbor) {
      tile.bottomRightNeighbor.topRightNeighbor = newTile;
      newTile.bottomLeftNeighbor = tile.bottomLeftNeighbor;
    }
  }

  if (neighborSide === "left") {
    tile.leftNeighbor = newTile;
    newTile.rightNeighbor = tile;
    if (tile.topLeftNeighbor) {
      tile.topLeftNeighbor.bottomLeftNeighbor = newTile;
      newTile.topRightNeighbor = tile.topLeftNeighbor;
    }
    if (tile.bottomLeftNeighbor) {
      tile.bottomLeftNeighbor.topLeftNeighbor = newTile;
      newTile.bottomRightNeighbor = tile.bottomLeftNeighbor;
    }
  }

  if (neighborSide === "topLeft") {
    tile.topLeftNeighbor = newTile;
    newTile.bottomRightNeighbor = tile;
    if (tile.topRightNeighbor) {
      tile.topRightNeighbor.leftNeighbor = newTile;
      newTile.rightNeighbor = tile.topRightNeighbor;
    }
    if (tile.leftNeighbor) {
      tile.leftNeighbor.topRightNeighbor = newTile;
      newTile.bottomLeftNeighbor = tile.leftNeighbor;
    }
  }

  if (neighborSide === "topRight") {
    tile.topRightNeighbor = newTile;
    newTile.bottomLeftNeighbor = tile;
    if (tile.topLeftNeighbor) {
      tile.topLeftNeighbor.rightNeighbor = newTile;
      newTile.leftNeighbor = tile.topLeftNeighbor;
    }
    if (tile.rightNeighbor) {
      tile.rightNeighbor.topLeftNeighbor = newTile;
      newTile.bottomRightNeighbor = tile.rightNeighbor;
    }
  }

  if (neighborSide === "bottomLeft") {
    tile.bottomLeftNeighbor = newTile;
    newTile.topRightNeighbor = tile;
    if (tile.bottomRightNeighbor) {
      tile.bottomRightNeighbor.leftNeighbor = newTile;
      newTile.rightNeighbor = tile.bottomRightNeighbor;
    }
    if (tile.leftNeighbor) {
      tile.leftNeighbor.bottomRightNeighbor = newTile;
      newTile.topLeftNeighbor = tile.leftNeighbor;
    }
  }

  if (neighborSide === "bottomRight") {
    tile.bottomRightNeighbor = newTile;
    newTile.topLeftNeighbor = tile;
    if (tile.bottomLeftNeighbor) {
      tile.bottomLeftNeighbor.rightNeighbor = newTile;
      newTile.leftNeighbor = tile.bottomLeftNeighbor;
    }
    if (tile.rightNeighbor) {
      tile.rightNeighbor.bottomLeftNeighbor = newTile;
      newTile.topRightNeighbor = tile.rightNeighbor;
    }
  }
};

const getNeighborOffset = (
  tile: GameTile,
  neighborSide: NeighborSide
): [number, number] => {
  if (neighborSide === "right") {
    return [tile.offset[0] + 1, tile.offset[1]];
  }
  if (neighborSide === "left") {
    return [tile.offset[0] - 1, tile.offset[1]];
  }
  if (neighborSide === "bottomLeft") {
    return [tile.offset[0] - 0.5, tile.offset[1] + 0.75];
  }
  if (neighborSide === "bottomRight") {
    return [tile.offset[0] + 0.5, tile.offset[1] + 0.75];
  }
  if (neighborSide === "topLeft") {
    return [tile.offset[0] - 0.5, tile.offset[1] - 0.75];
  }
  if (neighborSide === "topRight") {
    return [tile.offset[0] + 0.5, tile.offset[1] - 0.75];
  }
  return [0, 0];
};

const generateNeighbor = (
  tiles: GameTile[],
  tile: GameTile,
  neighborSide: NeighborSide
) => {
  const neigborOffset = getNeighborOffset(tile, neighborSide);
  const newTile = addTile(tiles, neigborOffset);
  connectNeighbors(tile, newTile, neighborSide);
  return newTile;
};

const generateNeighbors = (tiles: GameTile[], tile: GameTile) => {
  if (!tile.topLeftNeighbor) {
    generateNeighbor(tiles, tile, "topLeft");
  }
  if (!tile.topRightNeighbor) {
    generateNeighbor(tiles, tile, "topRight");
  }
  if (!tile.rightNeighbor) {
    generateNeighbor(tiles, tile, "right");
  }
  if (!tile.bottomRightNeighbor) {
    generateNeighbor(tiles, tile, "bottomRight");
  }
  if (!tile.bottomLeftNeighbor) {
    generateNeighbor(tiles, tile, "bottomLeft");
  }
  if (!tile.leftNeighbor) {
    generateNeighbor(tiles, tile, "left");
  }
};

const growMap = (tiles: GameTile[]) => {
  const currentTiles = tiles.slice();
  for (const tile of currentTiles) {
    generateNeighbors(tiles, tile);
  }
};

const addWeightingToResourseTypes = (
  resources: { type: ResourceType; weight: number }[]
) => {
  const weightedResources: ResourceType[] = [];

  resources.forEach((resource) => {
    for (let i = 0; i < resource.weight; i += 1) {
      weightedResources.push(resource.type);
    }
  });

  return weightedResources;
};

const generateResources = (app: Application<Renderer>, tiles: GameTile[]) => {
  tiles.forEach((tile) => {
    const resources = RESOURCE_TILE_MAP[tile.type];
    if (!resources.length) return;
    const weightedResources = addWeightingToResourseTypes(resources);

    const type =
      weightedResources[Math.floor(seededRandom() * weightedResources.length)];

    if (type !== "nothing") {
      tile.resource = {
        type,
        sprite: generateResource(app, tile, type),
      };
    }
  });
};

export const generateMap = (app: Application<Renderer>) => {
  const tiles: GameTile[] = [];
  const centerTile = addTile(tiles, [0, 0]);
  centerTile.type = "grass";
  for (let i = 0; i < MAP_SIZE; i++) growMap(tiles);

  tiles.forEach((tile) => calcType(tile));
  for (const tile of tiles) {
    generateTile(app, tile);
    // await new Promise((resolve) => setTimeout(() => resolve(undefined), 10));
  }

  generateResources(app, tiles);

  return {
    centerTile,
    tiles,
  };
};
