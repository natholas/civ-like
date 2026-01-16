import { Application, Graphics, Renderer, Sprite } from "pixi.js";
import { generateMap, tileHeight, tileWidth } from "./lib/map-generation";
import { GamePlayer, GameTile, GameUnit, UnitType } from "./types";
import { generateUnit } from "./lib/generate-unit";
import { generateMovementIndicators } from "./lib/generate-movement-indicators";
import { findPathLength } from "./lib/find-path-length";
import { UNIT_MOVEMENTS, UNIT_OFFSET } from "./config";
import { createTileOutline } from "./lib/create-tile-outline";
import { generatePlayers } from "./lib/generate-players";

let selectedUnit: GameUnit | undefined;
let movementIndicators: { sprite: Sprite; tile: GameTile }[] = [];
let movementBorder: Graphics;

const unselectUnit = () => {
  if (!selectedUnit) return;
  selectedUnit.sprite.alpha = 1;
  movementIndicators.forEach((indicator) => {
    indicator.sprite.destroy();
  });
  movementIndicators = [];
  movementBorder.destroy();
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
    app.screen.height / 2 +
      tile.offset[1] * tileHeight +
      tileHeight * UNIT_OFFSET
  );
  tile.units.push(unit);
  unit.tilesMovedThisTurn += pathLength;
};

const selectUnit = (app: Application<Renderer>, unit: GameUnit) => {
  unselectUnit();
  selectedUnit = unit;
  selectedUnit.sprite.alpha = 0.5;
  movementIndicators = generateMovementIndicators(app, unit);
  movementBorder = createTileOutline(app, [
    ...movementIndicators.map((i) => i.tile),
    unit.tile,
  ]);
  movementIndicators.forEach((indicator) => {
    indicator.sprite.interactive = true;
    indicator.sprite.on("click", () => {
      unselectUnit();
      moveUnit(app, unit, indicator.tile);
    });
  });
};

const endTurn = (players: GamePlayer[]) => {
  unselectUnit();
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
  tile: GameTile,
  type: UnitType
) => {
  const activePlayer = players.find((p) => p.active)!;
  const unit = generateUnit(app, tile, type, activePlayer);
  unit.sprite.interactive = true;
  unit.sprite.on("click", () => {
    const activePlayer = players.find((p) => p.active);
    if (activePlayer === unit.player) {
      selectUnit(app, unit);
    }
  });
  activePlayer.units.push(unit);
};

const setupUi = (
  app: Application<Renderer>,
  players: GamePlayer[],
  centerTile: GameTile
) => {
  const endTurnButton = document.getElementById("end-turn-button");
  endTurnButton!.onclick = () => {
    endTurn(players);
  };
  const spawnBuilderButton = document.getElementById("spawn-builder-button");
  spawnBuilderButton!.onclick = () => {
    spawnUnit(app, players, centerTile, "builder");
  };
  const spawnSoldierButton = document.getElementById("spawn-soldier-button");
  spawnSoldierButton!.onclick = () => {
    spawnUnit(app, players, centerTile, "soldier");
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

  setupUi(app, players, centerTile);

  // const unit = generateUnit(app, centerTile, "builder");

  // selectUnit(app, unit);

  // app.ticker.add((time) => {
  //   // tiles.forEach((tile) => {
  //   //   scale += 0.0001;
  //   //   tile.sprite!.scale.set(scale, scale);
  //   // });
  // });
})();
