import { jsonrepair } from "jsonrepair";

import allyDataRaw from "./allies.json?raw"; //this data has JSON errors
import heroDataRaw from "./heroes.json?raw"; //this data has JSON errors
import enemyDataRaw from "./enemies.json?raw"; //this data has JSON errors
import villainDataRaw from "./villains.json?raw"; //this data has JSON errors

import coreRaw from "./MissionData/core.json?raw";
import bespinRaw from "./MissionData/bespin.json?raw";
import empireRaw from "./MissionData/empire.json?raw";
import hothRaw from "./MissionData/hoth.json?raw";
import jabbaRaw from "./MissionData/jabba.json?raw";
import lothalRaw from "./MissionData/lothal.json?raw";
import otherRaw from "./MissionData/other.json?raw";
import twinRaw from "./MissionData/twin.json?raw";

import items from "./items.json?raw";
import rewards from "./rewards.json?raw";
import instructions from "./instructions.json?raw";
import bonusEffects from "./bonuseffects.json?raw";

export const bonusEffectsData = JSON.parse(jsonrepair(bonusEffects));

export const instructionsData = JSON.parse(jsonrepair(instructions));

export const itemData = JSON.parse(items).sort((a, b) =>
  a.name < b.name ? -1 : 1
);
export const rewardData = JSON.parse(rewards).sort((a, b) =>
  a.name < b.name ? -1 : 1
);

export const missionData = [
  { id: "Custom", name: "" },
  ...JSON.parse(coreRaw),
  ...JSON.parse(bespinRaw),
  ...JSON.parse(empireRaw),
  ...JSON.parse(hothRaw),
  ...JSON.parse(jabbaRaw),
  ...JSON.parse(lothalRaw),
  ...JSON.parse(otherRaw),
  ...JSON.parse(twinRaw),
];

export const allyData = JSON.parse(jsonrepair(allyDataRaw));
export const heroData = JSON.parse(jsonrepair(heroDataRaw));
export const enemyData = JSON.parse(jsonrepair(enemyDataRaw));
export const villainData = JSON.parse(jsonrepair(villainDataRaw));
