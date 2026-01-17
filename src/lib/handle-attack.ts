import { Application, Renderer } from "pixi.js";
import { UNIT_BASE_ATTACK, UNIT_MOVEMENTS, UNIT_PASSIVE_MAP } from "../config";
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
  if (capturingUnit.tile === capturedUnit.tile) return;
  moveUnit(app, capturingUnit, capturedUnit.tile);
};

const attackUnit = (
  app: Application<Renderer>,
  attackingUnit: GameUnit,
  attackedUnit: GameUnit,
  attackFromTile: GameTile,
  tileContainsMultipleNonPassiveUnits: boolean
) => {
  attackedUnit.health -= UNIT_BASE_ATTACK[attackingUnit.type];

  if (attackedUnit.health > 0) {
    moveUnit(app, attackingUnit, attackFromTile);
    return false;
  }

  removeUnit(attackedUnit);
  if (tileContainsMultipleNonPassiveUnits) {
    moveUnit(app, attackingUnit, attackFromTile);
    return false;
  }

  moveUnit(app, attackingUnit, attackedUnit.tile);
  return true;
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
    captureUnit(app, attackingUnit, attackedUnit);
  } else {
    const tileContainsMultipleNonPassiveUnits =
      attackedUnit.tile.units.filter((u) => !UNIT_PASSIVE_MAP[u.type]).length >
      1;
    const movedOntoAttackedTile = attackUnit(
      app,
      attackingUnit,
      attackedUnit,
      attackFromTile,
      tileContainsMultipleNonPassiveUnits
    );

    if (movedOntoAttackedTile) {
      const capturedUnits = tile.units.filter((u) => UNIT_PASSIVE_MAP[u.type]);
      capturedUnits.forEach((capturedUnit) =>
        captureUnit(app, attackingUnit, capturedUnit)
      );
    }
  }

  // attacking always uses up all movement
  attackingUnit.tilesMovedThisTurn =
    UNIT_MOVEMENTS[attackingUnit.type].tilesPerTurn;

  drawUnitIndicator(attackedUnit);
};
