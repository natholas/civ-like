import { Application, Graphics, Renderer, Sprite } from "pixi.js";
import { generateMap } from "./lib/map-generation";
import { GamePlayer, GameTile, GameUnit, UnitType } from "./types";
import { generateUnit } from "./lib/generate-unit";
import { generateMovementIndicators } from "./lib/generate-movement-indicators";
import { createTileOutline } from "./lib/create-tile-outline";
import { generatePlayers } from "./lib/generate-players";
import { generateAttackIndicators } from "./lib/generate-attack-indicators";
import { createTileOutlines } from "./lib/create-tile-outlines";
import { handleAttack } from "./lib/handle-attack";
import { moveUnit } from "./lib/move-unit";

let selectedUnit: GameUnit | undefined;
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
  selectedUnit.sprite.alpha = 1;
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

const selectUnit = (
  app: Application<Renderer>,
  players: GamePlayer[],
  unit: GameUnit
) => {
  unselectUnit();
  selectedUnit = unit;
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
      selectUnit(app, players, unit);
    }
  });
  activePlayer.units.push(unit);
  return unit;
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

  spawnUnit(app, players, centerTile.rightNeighbor!.rightNeighbor!, "builder");
  spawnUnit(
    app,
    players,
    centerTile.rightNeighbor!.topLeftNeighbor!.topRightNeighbor!,
    "soldier"
  );
  endTurn(players);
  const unit = spawnUnit(app, players, centerTile, "soldier");
  spawnUnit(app, players, centerTile, "soldier");
  spawnUnit(app, players, centerTile, "soldier");
  selectUnit(app, players, unit);

  // const unit = generateUnit(app, centerTile, "builder");

  // selectUnit(app, unit);

  // app.ticker.add((time) => {
  //   // tiles.forEach((tile) => {
  //   //   scale += 0.0001;
  //   //   tile.sprite!.scale.set(scale, scale);
  //   // });
  // });
})();
