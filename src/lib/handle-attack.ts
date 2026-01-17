import { Application, Renderer } from "pixi.js";
import { UNIT_BASE_ATTACK, UNIT_PASSIVE_MAP } from "../config";
import { GameTile, GameUnit } from "../types";
import { drawUnitIndicator } from "./generate-unit";
import { moveUnit } from "./move-unit";
import { removeUnit } from "./remove-unit";

const captureUnit = (
  app: Application<Renderer>,
  capturingUnit: GameUnit,
  capturedUnit: GameUnit
) => {
  capturedUnit.player.units.splice(
    capturedUnit.player.units.indexOf(capturedUnit),
    1
  );
  capturingUnit.player.units.push(capturedUnit);
  capturedUnit.player = capturingUnit.player;

  drawUnitIndicator(capturedUnit);
  moveUnit(app, capturingUnit, capturedUnit.tile);
};

const attackUnit = (
  app: Application<Renderer>,
  attackingUnit: GameUnit,
  attackedUnit: GameUnit,
  attackFromTile: GameTile
) => {
  attackedUnit.health -= UNIT_BASE_ATTACK[attackingUnit.type];

  if (attackedUnit.health > 0) {
    // TODO: move unit next to attacked unit
    moveUnit(app, attackingUnit, attackFromTile);
    attackingUnit.tilesMovedThisTurn += 1;
    return;
  }
  removeUnit(attackedUnit);

  moveUnit(app, attackingUnit, attackedUnit.tile);
};

export const handleAttack = (
  app: Application<Renderer>,
  attackingUnit: GameUnit,
  tile: GameTile,
  attackFromTile: GameTile
) => {
  const attackedUnit =
    tile.units.find((u) => !UNIT_PASSIVE_MAP[u.type]) || tile.units[0];

  if (UNIT_PASSIVE_MAP[attackedUnit.type]) {
    return captureUnit(app, attackingUnit, attackedUnit);
  }
  return attackUnit(app, attackingUnit, attackedUnit, attackFromTile);
};
