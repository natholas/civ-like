import { Application, Renderer, Sprite } from "pixi.js";
import { generateMap, tileHeight, tileWidth } from "./lib/map-generation";
import { GameTile, GameUnit, UnitType } from "./types";
import { generateUnit } from "./lib/generate-unit";
import { generateMovementIndicators } from "./lib/generate-movement-indicators";
import { findPathLength } from "./lib/find-path-length";
import { UNIT_MOVEMENTS } from "./config";

let selectedUnit: GameUnit | undefined;
let movementIndicators: { sprite: Sprite; tile: GameTile }[] = [];

const unselectUnit = () => {
  if (!selectedUnit) return;
  selectedUnit.sprite.alpha = 1;
  movementIndicators.forEach((indicator) => {
    indicator.sprite.destroy();
  });
  movementIndicators = [];
  selectedUnit = undefined;
};

const moveUnit = (
  app: Application<Renderer>,
  unit: GameUnit,
  tile: GameTile
) => {
  const pathLength = findPathLength(
    unit.tile,
    tile,
    UNIT_MOVEMENTS[unit.type].tileTypes
  );
  unit.tile.units = unit.tile.units.filter((u) => u !== unit);
  unit.tile = tile;
  unit.sprite.position.set(
    app.screen.width / 2 + tile.offset[0] * tileWidth,
    app.screen.height / 2 + tile.offset[1] * tileHeight
  );
  tile.units.push(unit);
  unit.tilesMovedThisTurn += pathLength;
};

const selectUnit = (app: Application<Renderer>, unit: GameUnit) => {
  unselectUnit();
  selectedUnit = unit;
  selectedUnit.sprite.alpha = 0.5;
  movementIndicators = generateMovementIndicators(app, unit);
  movementIndicators.forEach((indicator) => {
    indicator.sprite.interactive = true;
    indicator.sprite.on("click", () => {
      unselectUnit();
      moveUnit(app, unit, indicator.tile);
    });
  });
};

const endTurn = (units: GameUnit[]) => {
  unselectUnit();
  units.forEach((unit) => {
    unit.tilesMovedThisTurn = 0;
  });
};

const spawnUnit = (
  app: Application<Renderer>,
  units: GameUnit[],
  tile: GameTile,
  type: UnitType
) => {
  const unit = generateUnit(app, tile, type);
  unit.sprite.interactive = true;
  unit.sprite.on("click", () => {
    selectUnit(app, unit);
  });
  units.push(unit);
};

const setupUi = (
  app: Application<Renderer>,
  units: GameUnit[],
  centerTile: GameTile
) => {
  const endTurnButton = document.getElementById("end-turn-button");
  endTurnButton!.onclick = () => {
    endTurn(units);
  };
  const spawnBuilderButton = document.getElementById("spawn-builder-button");
  spawnBuilderButton!.onclick = () => {
    spawnUnit(app, units, centerTile, "builder");
  };
  const spawnSoldierButton = document.getElementById("spawn-soldier-button");
  spawnSoldierButton!.onclick = () => {
    spawnUnit(app, units, centerTile, "soldier");
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

  const { centerTile } = generateMap(app);

  const units: GameUnit[] = [];

  setupUi(app, units, centerTile);

  // app.ticker.add((time) => {
  //   // tiles.forEach((tile) => {
  //   //   scale += 0.0001;
  //   //   tile.sprite!.scale.set(scale, scale);
  //   // });
  // });
})();
