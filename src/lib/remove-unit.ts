import { GameUnit } from "../types";

export const removeUnit = (unit: GameUnit) => {
  unit.player.units.splice(unit.player.units.indexOf(unit), 1);
  unit.sprite.destroy();
};
