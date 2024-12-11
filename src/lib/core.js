import { purple, blue } from "@mui/material/colors";
import dimensions from "../data/dimensions.json";

export const createTranslatorTheme = {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "dashboardButton" },
          style: {
            display: "flex",
            flexDirection: "column",
            border: "1px solid purple",
            margin: "0",
          },
        },
      ],
    },
  },
  palette: {
    mode: "dark",
    primary: purple,
    secondary: blue,
    background: {
      default: "#160627",
      paper: "#160627",
    },
    text: {
      primary: "#fff",
      secondary: "rgba(133,219,255,1)",
    },
  },
};

// export function makeEnum(arr) {
//   let obj = Object.create(null);
//   for (let val of arr) {
//     obj[val] = Symbol(val);
//   }
//   return Object.freeze(obj);
// }

export function createGUID() {
  return crypto.randomUUID();
}

export const emptyGUID = "00000000-0000-0000-0000-000000000000";
export const oneGUID = "11111111-1111-1111-1111-111111111111";

export function parseDiceString(dice) {
  const regex = /\d\w+/gi; // Case-insensitive regex for digits followed by word character
  const diceColors = [];

  try {
    for (const diceItem of dice) {
      const matches = diceItem.matchAll(regex); // Get all matches using matchAll

      for (const match of matches) {
        const count = parseInt(match[0][0], 10); // Parse the first character as count

        for (let i = 0; i < count; i++) {
          const color = DiceColor[match[0].substring(1)]; // Access enum value by string
          if (color >= 0) {
            // Check if valid color exists in enum
            diceColors.push(color);
          } else {
            throw new Error("Invalid dice color found"); // Throw error for invalid color
          }
        }
      }
    }
    return diceColors;
  } catch (error) {
    console.error("Error parsing dice values:", error.message); // Log error message
    return []; // Return empty array
  }
}

export function traitsToIntArray(traits) {
  let intArray = [];
  for (const [key, value] of Object.entries(traits)) {
    if (key === "incBrawler" && value) intArray.push(GroupTraits.Brawler);
    if (key === "incCreature" && value) intArray.push(GroupTraits.Creature);
    if (key === "incDroid" && value) intArray.push(GroupTraits.Droid);
    if (key === "incForceUser" && value) intArray.push(GroupTraits.ForceUser);
    if (key === "incGuardian" && value) intArray.push(GroupTraits.Guardian);
    if (key === "incHeavyWeapon" && value)
      intArray.push(GroupTraits.HeavyWeapon);
    if (key === "incHunter" && value) intArray.push(GroupTraits.Hunter);
    if (key === "incLeader" && value) intArray.push(GroupTraits.Leader);
    if (key === "incSmuggler" && value) intArray.push(GroupTraits.Smuggler);
    if (key === "incSpy" && value) intArray.push(GroupTraits.Spy);
    if (key === "incTrooper" && value) intArray.push(GroupTraits.Trooper);
    if (key === "incWookiee" && value) intArray.push(GroupTraits.Wookiee);
    if (key === "incVehicle" && value) intArray.push(GroupTraits.Vehicle);
  }
  return intArray;
}

export function intArrayToTraits(intArray) {
  let traits = {
    incBrawler: false,
    incCreature: false,
    incDroid: false,
    incForceUser: false,
    incGuardian: false,
    incHeavyWeapon: false,
    incHunter: false,
    incLeader: false,
    incSmuggler: false,
    incSpy: false,
    incTrooper: false,
    incWookiee: false,
    incVehicle: false,
  };
  for (const value of intArray) {
    if (value === GroupTraits.Brawler) traits.incBrawler = true;
    if (value === GroupTraits.Creature) traits.incCreature = true;
    if (value === GroupTraits.Droid) traits.incDroid = true;
    if (value === GroupTraits.ForceUser) traits.incForceUser = true;
    if (value === GroupTraits.Guardian) traits.incGuardian = true;
    if (value === GroupTraits.HeavyWeapon) traits.incHeavyWeapon = true;
    if (value === GroupTraits.Hunter) traits.incHunter = true;
    if (value === GroupTraits.Leader) traits.incLeader = true;
    if (value === GroupTraits.Smuggler) traits.incSmuggler = true;
    if (value === GroupTraits.Spy) traits.incSpy = true;
    if (value === GroupTraits.Trooper) traits.incTrooper = true;
    if (value === GroupTraits.Wookiee) traits.incWookiee = true;
    if (value === GroupTraits.Vehicle) traits.incVehicle = true;
  }
  return traits;
}

export function stringArrayToTraits(stringArray) {
  let traits = {
    incBrawler: false,
    incCreature: false,
    incDroid: false,
    incForceUser: false,
    incGuardian: false,
    incHeavyWeapon: false,
    incHunter: false,
    incLeader: false,
    incSmuggler: false,
    incSpy: false,
    incTrooper: false,
    incWookiee: false,
    incVehicle: false,
  };
  for (const value of stringArray) {
    if (value === "Brawler") traits.incBrawler = true;
    if (value === "Creature") traits.incCreature = true;
    if (value === "Droid") traits.incDroid = true;
    if (value === "ForceUser") traits.incForceUser = true;
    if (value === "Guardian") traits.incGuardian = true;
    if (value === "HeavyWeapon") traits.incHeavyWeapon = true;
    if (value === "Hunter") traits.incHunter = true;
    if (value === "Leader") traits.incLeader = true;
    if (value === "Smuggler") traits.incSmuggler = true;
    if (value === "Spy") traits.incSpy = true;
    if (value === "Trooper") traits.incTrooper = true;
    if (value === "Wookiee") traits.incWookiee = true;
    if (value === "Vehicle") traits.incVehicle = true;
  }
  return traits;
}

export function traitsToStringArray(traits) {
  let stringArray = [];
  if (traits.incBrawler) stringArray.push("Brawler");
  if (traits.incCreature) stringArray.push("Creature");
  if (traits.incDroid) stringArray.push("Droid");
  if (traits.incForceUser) stringArray.push("ForceUser");
  if (traits.incGuardian) stringArray.push("Guardian");
  if (traits.incHeavyWeapon) stringArray.push("HeavyWeapon");
  if (traits.incHunter) stringArray.push("Hunter");
  if (traits.incLeader) stringArray.push("Leader");
  if (traits.incSmuggler) stringArray.push("Smuggler");
  if (traits.incSpy) stringArray.push("Spy");
  if (traits.incTrooper) stringArray.push("Trooper");
  if (traits.incWookiee) stringArray.push("Wookiee");
  if (traits.incVehicle) stringArray.push("Vehicle");
  return stringArray;
}

export function calculateEntityPosition(entity, drawingPosition) {
  let dims = { x: 2, y: 2 }; //door default

  if (entity.entityType === EntityType.Tile) {
    const expansion = Object.keys(Expansion)[entity.expansion];
    dims = dimensions.find(
      (x) => x.expansion === expansion && x.id == entity.tileID
    );
    dims = { x: dims.width, y: dims.height };
  }

  if (entity.entityRotation === 0) {
    return {
      x: drawingPosition.x - (dims.x * 10) / 2,
      y: drawingPosition.y - (dims.y * 10) / 2,
    };
  } else if (entity.entityRotation === 90) {
    return {
      x: drawingPosition.x + (dims.y * 10) / 2,
      y: drawingPosition.y - (dims.x * 10) / 2,
    };
  } else if (entity.entityRotation === 180) {
    return {
      x: drawingPosition.x + (dims.x * 10) / 2,
      y: drawingPosition.y + (dims.y * 10) / 2,
    };
  } else if (entity.entityRotation === 270) {
    return {
      x: drawingPosition.x - (dims.y * 10) / 2,
      y: drawingPosition.y + (dims.x * 10) / 2,
    };
  }
}

export const PriorityTraits = [
  { name: "Brawler", propName: "incBrawler" },
  { name: "Creature", propName: "incCreature" },
  { name: "Droid", propName: "incDroid" },
  { name: "Force User", propName: "incForceUser" },
  { name: "Guardian", propName: "incGuardian" },
  { name: "Heavy Weapon", propName: "incHeavyWeapon" },
  { name: "Hunter", propName: "incHunter" },
  { name: "Leader", propName: "incLeader" },
  { name: "Smuggler", propName: "incSmuggler" },
  { name: "Spy", propName: "incSpy" },
  { name: "Trooper", propName: "incTrooper" },
  { name: "Wookiee", propName: "incWookiee" },
  { name: "Vehicle", propName: "incVehicle" },
];

export const DeploymentColors = [
  "Gray",
  "Purple",
  "Black",
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "LightBlue",
  /*				new( "Gray", ColorFromFloats( .3301887f, .3301887f, .3301887f ) ),
				new( "Purple", ColorFromFloats( .6784314f, 0f, 1f ) ),
				new( "Black", ColorFromFloats( 0, 0, 0 ) ),
				new( "Blue", ColorFromFloats( 0, 0.3294118f, 1 ) ),
				new( "Green", ColorFromFloats( 0, 0.735849f, 0.1056484f ) ),
				new( "Red", ColorFromFloats( 1, 0, 0 ) ),
				new( "Yellow", ColorFromFloats( 1, 202f / 255f, 40f / 255f ) ),
				new( "LightBlue", ColorFromFloats( 0, 164f / 255f, 1 ) )
*/
];

export const DeploymentColorMap = new Map([
  ["Gray", "gray"],
  ["Purple", "#ad00ff"],
  ["Black", "black"],
  ["Blue", "#0054ff"],
  ["Green", "green"],
  ["Red", "red"],
  ["Yellow", "yellow"],
  ["LightBlue", "#00a4ff"],
]);

//enumeration equivalents
export const CustomInstructionType = { Top: 0, Bottom: 1, Replace: 2 };
export const YesNoAll = { Yes: 0, No: 1, All: 2, Multi: 3 };
export const MissionType = {
  Story: "Story",
  Side: "Side",
  Forced: "Forced",
  Introduction: "Introduction",
  Interlude: "Interlude",
  Finale: "Finale",
};
export const PriorityTargetType = {
  Rebel: 0,
  Hero: 1,
  Ally: 2,
  Other: 3,
  Trait: 4,
};
export const EntityType = {
  Tile: 0,
  Console: 1,
  Crate: 2,
  DeploymentPoint: 3,
  Token: 4,
  Highlight: 5,
  Door: 6,
};
export const EventActionType = {
  G1: 0,
  G2: 1,
  G3: 2,
  G4: 3,
  G5: 4,
  G6: 5,
  D1: 6,
  D2: 7,
  D3: 8,
  D4: 9,
  D5: 10,
  GM1: 11,
  GM2: 12,
  GM3: 13,
  M1: 14,
  M2: 15,
  G7: 16,
  GM4: 17,
  GM5: 18,
  G8: 19,
  G9: 20,
  D6: 21,
  GM6: 22,
  GM7: 23,
  CM1: 24,
  CM2: 25,
  CM3: 26,
  CM4: 27,
  G10: 28,
  G11: 29,
  CM5: 30,
};
export const ThreatModifierType = {
  None: 0,
  Fixed: 1,
  Multiple: 2,
};
export const ThreatAction = { Add: 0, Remove: 1 };
export const DeploymentSpot = { Active: 0, Specific: 1 };
export const GroupType = { All: 0, Specific: 1 };
export const Expansion = {
  Core: 0,
  Twin: 1,
  Hoth: 2,
  Bespin: 3,
  Jabba: 4,
  Empire: 5,
  Lothal: 6,
};
export const Factions = { Imperial: 0, Mercenary: 1 };
export const AttackType = { Ranged: 0, Melee: 1, None: 2 };
export const FigureSize = {
  Small1x1: 0,
  Medium1x2: 1,
  Large2x2: 2,
  Huge2x3: 3,
};
export const CharacterType = {
  Hero: 0,
  Ally: 1,
  Imperial: 2,
  Villain: 3,
  Rebel: 4,
};
export const GroupTraits = {
  Trooper: 0,
  Leader: 1,
  HeavyWeapon: 2,
  Guardian: 3,
  Brawler: 4,
  Droid: 5,
  Vehicle: 6,
  Hunter: 7,
  Creature: 8,
  Smuggler: 9,
  Spy: 10,
  ForceUser: 11,
  Wookiee: 12,
  Hero: 13,
};

export const DiceColor = {
  White: 0,
  Black: 1,
  Yellow: 2,
  Red: 3,
  Green: 4,
  Blue: 5,
  Grey: 6,
};

export const MarkerType = { Neutral: 0, Rebel: 1, Imperial: 2 };
