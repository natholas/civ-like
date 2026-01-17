import { Application, Graphics, Renderer, Sprite } from "pixi.js";
import { generateMap } from "./lib/map-generation";
import {
  GamePlayer,
  GameStructure,
  GameTile,
  GameUnit,
  StructureType,
  UnitType,
} from "./types";
import { generateUnit } from "./lib/generate-unit";
import { generateMovementIndicators } from "./lib/generate-movement-indicators";
import { createTileOutline } from "./lib/create-tile-outline";
import { generatePlayers } from "./lib/generate-players";
import { generateAttackIndicators } from "./lib/generate-attack-indicators";
import { createTileOutlines } from "./lib/create-tile-outlines";
import { handleAttack } from "./lib/handle-attack";
import { moveUnit } from "./lib/move-unit";
import { generateCity } from "./lib/generate-city";
import { COLORS, STRUCTURE_PLACEMENT_MAP } from "./config";
import { generateStructure } from "./lib/generate-structure";

let selectedUnit: GameUnit | undefined;
let selectedStructure: GameStructure | undefined;
let movementIndicators: {
  sprite: Sprite;
  tile: GameTile;
  movementLeft: number;
}[] = [];
let attackIndicators: {
  sprite: Sprite;
  tile: GameTile;
  attackFromTile: GameTile;
}[] = [];
let movementBorder: Graphics;
let attackBorders: Graphics;

const unselectUnit = () => {
  if (!selectedUnit) return;
  movementIndicators.forEach((indicator) => {
    indicator.sprite.destroy();
  });
  movementIndicators = [];
  movementBorder.destroy();

  attackIndicators.forEach((indicator) => {
    indicator.sprite.destroy();
  });
  attackIndicators = [];
  attackBorders.destroy();
  selectedUnit = undefined;
};

const unselectStructure = () => {
  if (!selectedStructure) return;
  selectedStructure = undefined;
};

const selectUnit = (
  app: Application<Renderer>,
  players: GamePlayer[],
  unit: GameUnit
) => {
  unselectUnit();
  selectedUnit = unit;
  movementIndicators = generateMovementIndicators(app, unit);
  movementBorder = createTileOutline(
    app,
    [...movementIndicators.map((i) => i.tile), unit.tile],
    COLORS.movementTileBorderColor,
    COLORS.movementTileFillColor
  );
  movementIndicators.forEach((indicator) => {
    indicator.sprite.interactive = true;
    indicator.sprite.on("click", () => {
      unselectUnit();
      moveUnit(app, unit, indicator.tile);
    });
  });

  attackIndicators = generateAttackIndicators(app, unit, movementIndicators);
  attackBorders = createTileOutlines(
    app,
    attackIndicators.map((i) => i.tile)
  );

  attackIndicators.forEach((indicator) => {
    indicator.sprite.interactive = true;
    indicator.sprite.on("click", () => {
      handleAttack(app, unit, indicator.tile, indicator.attackFromTile);
      unselectUnit();
    });
  });
};

const selectStructure = (structure: GameStructure) => {
  unselectStructure();
  selectedStructure = structure;
};

const endTurn = (players: GamePlayer[]) => {
  unselectUnit();
  unselectStructure();
  const activePlayerIndex = players.findIndex((p) => p.active);
  players[activePlayerIndex].units.forEach((unit) => {
    unit.tilesMovedThisTurn = 0;
  });
  players[activePlayerIndex].active = false;
  const newActivePlayerIndex =
    activePlayerIndex === players.length - 1 ? 0 : activePlayerIndex + 1;
  players[newActivePlayerIndex].active = true;
};

const spawnUnit = (
  app: Application<Renderer>,
  players: GamePlayer[],
  type: UnitType
) => {
  if (!selectedStructure) {
    alert("No structure selected");
    return;
  }

  if (selectedStructure.type !== "cityCenter") {
    alert("This structure can't spawn units");
    return;
  }
  const activePlayer = players.find((p) => p.active)!;
  console.log(selectedStructure, activePlayer);
  if (selectedStructure.player !== activePlayer) {
    alert("This structure can't spawn units");
    return;
  }
  const unit = generateUnit(app, selectedStructure.tile, type, activePlayer);
  unit.sprite.interactive = true;
  unit.sprite.on("click", () => {
    const activePlayer = players.find((p) => p.active);
    if (activePlayer === unit.player) {
      selectUnit(app, players, unit);
    }
  });
  activePlayer.units.push(unit);
  return unit;
};

const createStructure = (
  app: Application<Renderer>,
  players: GamePlayer[],
  type: StructureType
) => {
  if (!selectedUnit) {
    alert("No unit selected");
    return;
  }

  if (selectedUnit.type !== "builder") {
    alert("This unit can't build this");
    return;
  }

  const tile = selectedUnit.tile;

  if (tile.structure) {
    alert("This tile already has a structure");
    return;
  }

  const placement = STRUCTURE_PLACEMENT_MAP[type];
  if (placement.resourceTypes) {
    const tileResource = tile.resource;
    if (!tileResource || !placement.resourceTypes.includes(tileResource.type)) {
      alert("This structure can't be built here");
      return;
    }
  }

  if (placement.tileTypes) {
    if (!placement.tileTypes.includes(tile.type)) {
      alert("This structure can't be built here");
      return;
    }
  }
  const activePlayer = players.find((p) => p.active)!;

  if (!tile.city || tile.city.player !== activePlayer) {
    alert("This structure can't be built outside of your city");
    return;
  }

  const structure = generateStructure(app, activePlayer, tile, type);
  tile.structure = structure;
  structure.sprite.interactive = true;
  structure.sprite.on("click", () => {
    selectStructure(structure);
  });
};

const createCity = (
  app: Application<Renderer>,
  players: GamePlayer[],
  name: string,
  tile: GameTile
) => {
  const { cityCenter } = generateCity(app, players, name, tile);
  cityCenter.sprite.interactive = true;
  cityCenter.sprite.on("click", () => {
    selectStructure(cityCenter);
  });
};

const setupUi = (app: Application<Renderer>, players: GamePlayer[]) => {
  const endTurnButton = document.getElementById("end-turn-button");
  endTurnButton!.onclick = () => {
    endTurn(players);
  };
  const spawnBuilderButton = document.getElementById("spawn-builder-button");
  spawnBuilderButton!.onclick = () => {
    spawnUnit(app, players, "builder");
  };
  const spawnSoldierButton = document.getElementById("spawn-soldier-button");
  spawnSoldierButton!.onclick = () => {
    spawnUnit(app, players, "soldier");
  };

  const buildFarmButton = document.getElementById("build-farm-button");
  buildFarmButton!.onclick = () => {
    createStructure(app, players, "farm");
  };

  const buildMineButton = document.getElementById("build-mine-button");
  buildMineButton!.onclick = () => {
    createStructure(app, players, "mine");
  };

  const buildLumberMillButton = document.getElementById(
    "build-lumber-mill-button"
  );
  buildLumberMillButton!.onclick = () => {
    createStructure(app, players, "lumberMill");
  };
};

(async () => {
  const app = new Application();
  await app.init({
    background: "#333",
    resizeTo: window,
    antialias: true,
  });
  document.getElementById("pixi-container")?.appendChild(app.canvas);

  const players = generatePlayers();
  const { centerTile } = generateMap(app);

  setupUi(app, players);

  createCity(
    app,
    players,
    "Test City",
    centerTile.bottomLeftNeighbor!.bottomLeftNeighbor!
  );
  endTurn(players);
  createCity(
    app,
    players,
    "Test City 2",
    centerTile.topRightNeighbor!.topRightNeighbor!
  );
})();
