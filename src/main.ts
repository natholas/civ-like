import { Application, Assets, Renderer, Sprite } from "pixi.js";

type TileType =
  | "grass"
  | "water"
  | "sand"
  | "forest"
  | "mountain"
  | "mountainPeak";

interface GameTile {
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

type NeighborSide =
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

const tiles: GameTile[] = [];

const mapSize = 8;

const textures = {
  grass: await Assets.load("/assets/tile-grass.svg"),
  water: await Assets.load("/assets/tile-water.svg"),
  sand: await Assets.load("/assets/tile-sand.svg"),
  forest: await Assets.load("/assets/tile-forest.svg"),
  mountain: await Assets.load("/assets/tile-mountain.svg"),
  mountainPeak: await Assets.load("/assets/tile-mountain-peak.svg"),
} as const;

const typeTouchMap: { [type: string]: TileType[] } = {
  grass: ["grass", "forest", "sand", "mountain"],
  water: ["water", "sand"],
  sand: ["sand", "water", "grass"],
  forest: ["forest", "grass", "mountain"],
  mountain: ["mountain", "forest", "grass", "mountainPeak"],
  mountainPeak: ["mountainPeak", "mountain"],
};

const tileTypeWeights: { [key: string]: number } = {
  grass: 5,
  water: 5,
  sand: 3,
  forest: 2,
  mountain: 1,
  mountainPeak: 2,
};

const allTypes = Object.keys(textures) as TileType[];

const tileWidth =
  Math.floor(
    ((Math.min(window.innerWidth, window.innerHeight * 1.1547005) /
      (mapSize * 2 + 1)) *
      0.9) /
      2
  ) * 2;

const tileHeight = tileWidth * 1.1547005;

const addTile = (offset: [number, number]) => {
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
    type: undefined as unknown as TileType,
  };

  tiles.push(tile);
  return tile;
};

const getTileNeighbors = (tile: GameTile): GameTile[] => {
  return [
    tile.bottomLeftNeighbor,
    tile.bottomRightNeighbor,
    tile.leftNeighbor,
    tile.rightNeighbor,
    tile.topLeftNeighbor,
    tile.topRightNeighbor,
  ].filter(Boolean) as GameTile[];
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
  const validTypes = new Set<TileType>(allTypes);

  neighborTypes.forEach((type) => {
    const canTouch = typeTouchMap[type];
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
    for (let i = 0; i < tileTypeWeights[type]; i += 1) {
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
  tile.type = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
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

  // Add the bunny to the stage
  app.stage.addChild(sprite);
};

// const cleanUpTile = (tile: GameTile) => {
//   const neighbors = getTileNeighbors(tile);
//   const neighborTypes = getTypesForTiles(neighbors);
//   if (tile.type === "sand") {
//     if (neighborTypes.size === 1) {
//       tile.type = Array.from(neighborTypes.values())[0];
//     }
//   }
// };

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

const generateNeighbor = (tile: GameTile, neighborSide: NeighborSide) => {
  const neigborOffset = getNeighborOffset(tile, neighborSide);
  const newTile = addTile(neigborOffset);
  connectNeighbors(tile, newTile, neighborSide);
  return newTile;
};

const generateNeighbors = (tile: GameTile) => {
  if (!tile.topLeftNeighbor) {
    generateNeighbor(tile, "topLeft");
  }
  if (!tile.topRightNeighbor) {
    generateNeighbor(tile, "topRight");
  }
  if (!tile.rightNeighbor) {
    generateNeighbor(tile, "right");
  }
  if (!tile.bottomRightNeighbor) {
    generateNeighbor(tile, "bottomRight");
  }
  if (!tile.bottomLeftNeighbor) {
    generateNeighbor(tile, "bottomLeft");
  }
  if (!tile.leftNeighbor) {
    generateNeighbor(tile, "left");
  }
};

const growMap = () => {
  const currentTiles = tiles.slice();
  for (const tile of currentTiles) {
    generateNeighbors(tile);
  }
};

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#333", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")?.appendChild(app.canvas);
  const centerTile = addTile([0, 0]);
  centerTile.type = "grass";
  for (let i = 0; i < mapSize; i++) {
    growMap();
  }

  tiles.forEach((tile) => calcType(tile));
  // tiles.forEach((tile) => cleanUpTile(tile));

  for (const tile of tiles) {
    generateTile(app, tile);
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 10));
  }

  // Listen for animate update
  // app.ticker.add((time) => {
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  //   bunny.rotation += 0.1 * time.deltaTime;
  // });
})();
