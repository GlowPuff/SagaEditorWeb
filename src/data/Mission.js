//Mission related classes and data structures
import * as core from "../lib/core";
import * as thumbData from "../data/thumbnails.json";
import {
  enemyData,
  allyData,
  heroData,
  villainData,
  instructionsData,
  bonusEffectsData,
} from "./carddata";

export class Mission {
  constructor() {
    this.Guid = core.createGUID();
    this.fileVersion = 22;
    this.languageID = "English (EN)";
  }
  //string
  Guid;
  fileName = "";
  fileVersion;
  saveDate = "";
  languageID;
  //long
  timeTicks = 0;
  //object
  missionProperties = {}; //MissionProperties
  //arrays
  mapSections = [];
  globalTriggers = [];
  globalEvents = [];
  mapEntities = [];
  initialDeploymentGroups = [];
  reservedDeploymentGroups = [];
  eventGroups = [];
  entityGroups = [];
  customCharacters = [];
}

export class MissionTrigger {
  constructor(name = "New Trigger") {
    this.name = name;
    this.GUID = core.createGUID();
    this.isGlobal = true;
    this.useReset = false;
    this.maxValue = -1;
    this.initialValue = 0;
    this.eventGUID = core.emptyGUID;
  }
  name;
  GUID;
  eventGUID;
  isGlobal;
  useReset;
  //int
  maxValue;
  initialValue;
}

class EmptyTrigger extends MissionTrigger {
  constructor() {
    super();
    this.name = "None";
    this.GUID = core.emptyGUID;
  }
}
export const emptyTrigger = new EmptyTrigger();

export class MissionEvent {
  constructor(name = "New Event") {
    this.GUID = core.createGUID();
    this.name = name;
    this.isGlobal = true;
    this.eventText = "";
    this.startOfRound = this.endOfRound = 1;
    this.useStartOfRound =
      this.useEndOfRound =
      this.useStartOfEachRound =
      this.useEndOfEachRound =
      this.useAllGroupsDefeated =
      this.useAllHeroesWounded =
      this.useAllyDefeated =
      this.useHeroWounded =
      this.useHeroWithdraws =
      this.useActivation =
      this.useAnyHeroWounded =
      this.useAnyHeroDefeated =
      this.isEndOfCurrentRound =
      this.isRepeatable =
        false;
    this.behaviorAll = true;
    this.additionalTriggers = [];
    this.eventActions = [];
    this.heroWounded = "H1";
    this.heroWithdraws = "H1";
    this.allyDefeated = "A001";
    this.activationOf = "DG001";
    // this.additionalTriggers.push(new MissionTrigger());
  }
  //string
  GUID; //GUID as string
  name;
  eventText;
  allyDefeated;
  heroWounded;
  heroWithdraws;
  activationOf;
  //int
  startOfRound;
  endOfRound;
  //bool
  useStartOfRound;
  useEndOfRound;
  useStartOfEachRound;
  useEndOfEachRound;
  useAllGroupsDefeated;
  useAllHeroesWounded;
  useAllyDefeated;
  useHeroWounded;
  useHeroWithdraws;
  useAnyHeroWounded;
  useAnyHeroDefeated;
  useActivation;
  isRepeatable;
  isEndOfCurrentRound;
  behaviorAll;
  //arrays
  additionalTriggers;
  eventActions;
}

class EmptyEvent extends MissionEvent {
  constructor() {
    super();
    this.name = "None";
    this.GUID = core.emptyGUID;
  }
}
export const emptyEvent = new EmptyEvent();

export class ButtonAction {
  constructor() {
    this.GUID = core.createGUID();
    this.buttonText = "Button Text";
    this.triggerGUID = core.emptyGUID;
    this.eventGUID = core.emptyGUID;
  }
}

export class Thumbnail {
  constructor(name, id) {
    this.Name = name; //full name of icon's character
    this.ID = id; //basically the filename
  }
}

function getDigits(text) {
  let digits = text.split("").reduce((acc, cur) => {
    return acc + (Number.isInteger(parseInt(cur)) ? cur : "");
  }, "");
  // trim leading 0's
  digits = digits.split("");
  while (digits.length > 0 && digits[0] === "0") {
    digits.shift();
  }
  return digits.length > 0 ? digits.join("") : "";
}

export class ThumbnailData {
  // constructor() {
  static removeDupes = (list) => {
    let singles = [];
    for (let index = 0; index < list.length; index++) {
      if (!singles.find((x) => x.Name === list[index].Name))
        singles.push(list[index]);
    }
    return singles;
  };

  //these are all List<Thumbnail>();
  //custom icons
  static CustomOther = thumbData.Other;
  static CustomRebel = thumbData.Rebel;
  static CustomImperial = thumbData.Imperial;
  static CustomMercenary = thumbData.Mercenary;
  //stock icons
  //filter out Elites
  static StockImperial = this.removeDupes(
    enemyData
      .map(
        (item) =>
          new Thumbnail(`${item.name}`, "StockImperial" + getDigits(item.id))
      )
      .filter((d) => !d.Name.includes("Elite"))
  );
  static StockAlly = allyData.map(
    (item) => new Thumbnail(`${item.name}`, "StockAlly" + getDigits(item.id))
  );
  static StockHero = heroData.map(
    (item) => new Thumbnail(`${item.name}`, "StockHero" + getDigits(item.id))
  );
  static StockVillain = villainData.map(
    (item) => new Thumbnail(`${item.name}`, "StockVillain" + getDigits(item.id))
  );

  // }
}

export const NoneThumb = new Thumbnail("Select a Thumbnail", "None");

export class DCPointer {
  constructor(name = "", id = "") {
    this.name = name;
    this.id = id;
  }
}

export class InputRange {
  constructor() {
    //string
    this.triggerGUID = core.emptyGUID;
    this.eventGUID = core.emptyGUID;
    this.theText = "";
    //int
    this.fromValue = 0;
    this.toValue = 0;
  }
}

export class RepoOverride {
  constructor() {
    this.theText = "";
    this.useSpecific = false;
    this.repoGroups = [];
    this.GUID = core.createGUID();
    this.eventActionType = 17;
    this.displayName = "";
  }
  theText;
  useSpecific;
  repoGroups;
  GUID;
  eventActionType;
  displayName;
}

export class TriggerModifier {
  constructor() {
    this.triggerName = "New Trigger";
    this.triggerGUID = "";
    this.setValue = -1;
    this.modifyValue = 0;
  }
  //string
  triggerName;
  triggerGUID;
  //int
  setValue;
  modifyValue;
}

export class TriggeredBy {
  constructor(trigger) {
    this.triggerName = trigger.name;
    this.triggerGUID = trigger.GUID;
    this.triggerValue = 0;
  }
  //string
  triggerName;
  triggerGUID;
  //int
  triggerValue;
}

export class MapTile {
  constructor(id = "", exp = core.Expansion.Core, side = "A") {
    this.name = Object.getOwnPropertyNames(core.Expansion)[exp] + id + side;
    this.GUID = core.createGUID();
    this.tileID = id;
    this.tileSide = side;
    this.expansion = exp;
    this.textureName =
      Object.getOwnPropertyNames(core.Expansion)[exp] + "_" + id + side;
    Object.getOwnPropertyNames(core.Expansion)[exp];
  }
}

export class MapSection {
  constructor() {
    this.name = "Start Section";
    this.GUID = core.createGUID();
    this.invisibleUntilActivated = false;
    this.triggers = [];
    this.missionEvents = [];
    this.mapTiles = [
      new MapTile(Math.random().toString(), core.Expansion.Core, "A"),
    ];
  }
  name;
  GUID;
  invisibleUntilActivated;
  triggers;
  missionEvents;
  mapTiles;
}

class StartSection extends MapSection {
  constructor() {
    super();
    this.GUID = "11111111-1111-1111-1111-111111111111";
    this.mapTiles = [new MapTile("1", core.Expansion.Core, "A")];
  }
}
export const startSection = new StartSection();

export class MissionProperties {
  constructor() {
    this.missionID = "Custom";
    this.missionName = "Mission Name";
    this.customMissionIdentifier = core.createGUID();
    this.fixedAlly = "A001";
    this.bannedAlly = "A001";
    this.specificAlly = "A001";
    this.specificHero = "H1";
    this.optionalDeployment = false;
    this.factionImperial = true;
    this.factionMercenary = true;
    this.customInstructionType = core.CustomInstructionType.Replace;
    this.useFixedAlly = core.YesNoAll.No;
    this.useBannedAlly = core.YesNoAll.No;
    this.priorityTargetType = core.PriorityTargetType.Rebel;
    this.startingEvent = core.emptyGUID;
    this.roundLimitEvent = core.emptyGUID;
    this.roundLimit = -1;
    this.missionType = core.MissionType.Story;
    this.changeRepositionOverride = null;
    this.missionSubType = [];
    this.multipleBannedAllies = [];
    this.bannedGroups = [];
    this.useAlternateEventSystem = false;
    //empty values so they aren't undefined
    this.campaignName = "";
    this.additionalMissionInfo = "";
    this.startingObjective = "";
    this.missionInfo = "";
    this.priorityOther = "";
  }
  //string
  missionName;
  campaignName;
  missionDescription;
  additionalMissionInfo;
  fixedAlly;
  bannedAlly;
  startingObjective;
  missionID;
  customMissionIdentifier;
  missionInfo;
  specificAlly;
  specificHero;
  priorityOther;
  startingEvent; //GUID as string
  roundLimitEvent; //GUID as string
  //bool
  optionalDeployment;
  factionImperial;
  factionMercenary;
  useAlternateEventSystem;
  //int
  roundLimit;
  //enums
  useFixedAlly; //YesNoAll
  useBannedAlly; //YesNoAll
  customInstructionType; //CustomInstructionType
  priorityTargetType; //PriorityTargetType
  missionType; //MissionType
  //object
  changeRepositionOverride;
  //arrays
  missionSubType; //MissionSubType enum
  bannedGroups; //string
  multipleBannedAllies; //string
}

export class EnemyGroupData {
  constructor() {
    //string
    this.GUID = core.createGUID();
    this.cardName = "";
    this.cardID = "";
    this.customText = "";
    this.customInstructionType = core.CustomInstructionType.Replace;
    this.pointList = [
      {
        GUID: core.emptyGUID,
      },
      {
        GUID: core.emptyGUID,
      },
      {
        GUID: core.emptyGUID,
      },
    ];
    this.groupPriorityTraits = {
      incBrawler: true,
      incCreature: true,
      incDroid: true,
      incForceUser: true,
      incGuardian: true,
      incHeavyWeapon: true,
      incHunter: true,
      incLeader: true,
      incSmuggler: true,
      incSpy: true,
      incTrooper: true,
      incWookiee: true,
      incVehicle: true,
      useDefaultPriority: true,
    };
    //string GUID
    this.defeatedTrigger = core.emptyGUID;
    this.defeatedEvent = core.emptyGUID;
    //bool
    this.useGenericMugshot = false;
    this.useInitialGroupCustomName = false;
  }
}

class DeploymentPointProps {
  constructor() {
    this.incImperial = this.incMercenary = true;
    this.incSmall = this.incMedium = this.incLarge = this.incHuge = true;
    this.incBrawler =
      this.incCreature =
      this.incDroid =
      this.incForceUser =
        true;
    this.incGuardian =
      this.incHeavyWeapon =
      this.incHunter =
      this.incLeader =
        true;
    this.incSmuggler =
      this.incSpy =
      this.incTrooper =
      this.incWookiee =
      this.incVehicle =
        true;
  }
}

export class DeploymentPoint {
  constructor(ownerGUID) {
    this.GUID = core.createGUID();
    this.name = "New Deployment Point";
    this.entityType = core.EntityType.DeploymentPoint;
    this.entityProperties = new EntityProperties(); //EntityProperties
    this.entityProperties.isActive = false;
    this.entityProperties.name = "New Deployment Point";
    this.mapSectionOwner = ownerGUID;
    this.deploymentPointProps = new DeploymentPointProps(); //DeploymentPointProps
    this.deploymentColor = "Gray";
  }
  entityPosition; //vector
  entityRotation; //double
  //bool
  hasProperties;
  hasColor;
  //string
  mapSectionOwner; //GUID as string
}

export class ActiveDeploymentPoint extends DeploymentPoint {
  constructor() {
    super();
    this.name = "Active Deployment Point";
    this.GUID = core.emptyGUID;
  }
}

export class NoneDeploymentPoint extends DeploymentPoint {
  constructor() {
    super();
    this.name = "None";
    this.GUID = core.oneGUID;
  }
}

class EntityProperties {
  constructor(name = "") {
    this.name = name;
    this.isActive = true;
    this.theText = "";
    this.entityColor = "Gray";
    this.ownerGUID = core.oneGUID;
    this.buttonActions = []; //ButtonAction
  }
}

export class EntityModifier {
  constructor() {
    this.GUID = core.createGUID();
    this.sourceGUID = core.emptyGUID;
    this.hasColor = false;
    this.hasProperties = false;
    this.entityProperties = {}; //EntityProperties
  }

  static fromEntity(entity) {
    // console.log("🚀 ~ EntityModifier ~ fromEntity ~ entity:", entity);
    let modifier = new EntityModifier();
    let entityProperties = new EntityProperties();
    entityProperties.name = entity.name;
    entityProperties.isActive = entity.entityProperties.isActive;
    entityProperties.theText = entity.entityProperties.theText;
    entityProperties.entityColor = entity.entityProperties.entityColor;
    entityProperties.ownerGUID = entity.entityProperties.ownerGUID;
    entityProperties.buttonActions = [...entity.entityProperties.buttonActions];
    modifier.entityProperties = entityProperties;
    modifier.hasColor = entity.hasColor;
    modifier.hasProperties = entity.hasProperties;
    modifier.sourceGUID = entity.GUID;
    return modifier;
  }
}

export class EventGroup {
  constructor() {
    this.name = "New Event Group";
    this.GUID = core.createGUID();
    this.repeateable = false;
    this.isUnique = true;
    this.triggerGUID = core.emptyGUID;
    this.missionEvents = [];
  }
  name;
  GUID;
  repeateable;
  isUnique;
  triggerGUID;
  missionEvents;
}

export class EntityGroup {
  constructor() {
    this.name = "New Entity Group";
    this.GUID = core.createGUID();
    this.repeateable = false;
    this.triggerGUID = core.emptyGUID;
  }
  name;
  GUID;
  repeateable;
  triggerGUID;
  missionEntities = [];
}

// class GroupAbility {
//   constructor() {
//     this.name = "";
//     this.text = "";
//   }
// }

export class DeploymentCard {
  constructor() {
    this.name = "New Deployment Card";
    this.subname = "";
    this.id = "";
    this.faction = "";
    this.expansion = "";
    this.ignored = "";
    this.deploymentOutlineColor = "";
    this.mugShotPath = "";
    this.traits = [];
    this.surges = [];
    this.keywords = [];
    //int
    this.tier = 0;
    this.priority = 0;
    this.cost = 0;
    this.rcost = 0;
    this.size = 0;
    this.fame = 0;
    this.reimb = 0;
    this.health = 0;
    this.speed = 0;
    //bool
    this.isElite = false;
    //objects
    this.abilities = []; //GroupAbility
    this.defense = []; //DiceColor
    this.attacks = []; //DiceColor
    this.attackType; //AttackType
    this.miniSize; //FigureSize
    this.groupTraits = []; //GroupTraits
    this.preferredTargets = []; //GroupTraits
    this.characterType; //CharacterType
  }
}

export class CustomToon {
  constructor(cardid) {
    this.customCharacterGUID = core.createGUID();
    this.heroSkills = []; //CampaignSkill
    //this.groupAttack = "1White 1Black";//????????

    //update the embedded DeploymentCard's name/subname, faction, instructions ID, bonus effect ID, and id when it changes
    let card = new DeploymentCard();
    card.name = "New Character";
    card.subname = "";
    //assign a free custom ID
    card.id = cardid; //Utils.GetAvailableCustomToonID();
    card.expansion = "Other";
    card.isElite = false;
    card.cost = 3;
    card.rcost = 1;
    card.size = 1;
    card.health = 3;
    card.speed = 2;
    card.tier = 2;
    card.priority = 2;
    card.fame = 6;
    card.reimb = 3;
    card.faction = "Imperial";
    card.ignored = "";
    card.attackType = core.AttackType.Melee; //cast to number, otherwise it's a string
    card.traits = [];
    card.surges = ["{B}: Bleed", "{B}: Focus", "{B}: Pierce 2"];
    card.keywords = ["+2 {H}", "Habitat: Snow"];
    card.abilities = [
      {
        name: "Composite Plating",
        text: "While defending, if the attacker is 4 or more spaces away, apply +1 {G} to the defense roll.",
      },
      {
        name: "Efficient Travel",
        text: "Snowtroopers (Elite) ignores additional movement point costs for difficult terrain and hostile figures.",
      },
    ];
    card.miniSize = core.FigureSize.Small1x1; //cast to number, otherwise it's a string
    card.deploymentOutlineColor = "Gray";
    card.mugShotPath = "CardThumbnails/none";
    card.groupTraits = [];
    card.preferredTargets = [];
    card.characterType = core.CharacterType.Imperial; //cast to number, otherwise it's a string

    this.deploymentCard = card; //DeploymentCard

    //default properties
    this.cardName = card.name;
    this.cardSubName = card.subname;
    this.cardID = card.id;
    this.faction = core.Factions.Imperial;
    this.useThreatMultiplier = false;
    this.canRedeploy = this.canReinforce = this.canBeDefeated = true;
    this.groupAttack = "1Blue 2Yellow";
    this.groupDefense = "1White 1Black";
    this.bonusEffect = {
      bonusID: this.cardID,
      effects: [
        "CHARGE: The first time this figure attacks or uses Trample, add 1 blue die to its dice pool.",
        "CRUSH: Each Rebel that suffers {H} during this activation also becomes Weakened.",
      ],
    };
    this.cardInstruction = {
      instID: this.cardID,
      instName: this.cardName,
      content: [
        {
          instruction: [
            "{-} MISSILE SALVO: This figure’s attacks do not require line of sight or Accuracy.",
            "{A} Move 2 to reposition 4.",
          ],
        },
        {
          instruction: [
            "This is a second randomized Instruction Group",
            "Separate randomized Instruction Groups with ===",
          ],
        },
        {
          instruction: [
            "This is a third randomized Instruction Group",
            "When this character Activates, one of these 3 Instruction Groups will be randomly chosen to Activate with",
          ],
        },
      ],
    };
    //default thumbnail
    this.thumbnail = NoneThumb;

    //DeploymentCard, bool
    this.CopyFrom = (oldToon, card, copyCardText) => {
      //fix attackType and miniSize, which come in as strings
      card.attackType = core.AttackType[card.attackType];
      card.miniSize = core.FigureSize[card.miniSize];
      console.log("🚀 ~ CustomToon ~ constructor ~ thumb:", oldToon);
      console.log("🚀 ~ CustomToon ~ constructor ~ card:", card);
      //  console.log("🚀 ~ CustomToon ~ constructor ~ THIS:", this);
      let updatedToon = JSON.parse(JSON.stringify(oldToon));
      updatedToon.CopyFrom = oldToon.CopyFrom;
      // console.log("🚀 ~ CustomToon ~ CopyFrom ~ updatedToon:", updatedToon);
      updatedToon.groupAttack = updatedToon.groupDefense = "";
      //store some properties from the card we want to keep
      let outline = updatedToon.deploymentCard.deploymentOutlineColor;
      let ctype = updatedToon.deploymentCard.characterType;
      let mugpath = updatedToon.deploymentCard.mugShotPath;
      //copy the card
      updatedToon.deploymentCard = JSON.parse(JSON.stringify(card));
      //set the values we want to keep
      updatedToon.deploymentCard.deploymentOutlineColor = outline;
      updatedToon.deploymentCard.characterType = ctype;
      updatedToon.deploymentCard.mugShotPath = mugpath;
      updatedToon.deploymentCard.preferredTargets = [
        ...oldToon.deploymentCard.preferredTargets,
      ];
      //set the rest
      updatedToon.deploymentCard.id = updatedToon.cardID;
      updatedToon.deploymentCard.name = updatedToon.cardName;
      updatedToon.deploymentCard.subname = updatedToon.cardSubName;
      updatedToon.deploymentCard.faction =
        updatedToon.faction === 0 ? "Imperial" : "Mercenary";
      updatedToon.deploymentCard.expansion = "Other";

      if (copyCardText) {
        //set instructions from the copied card
        let inst = instructionsData.filter((x) => x.instID === card.id)[0];
        updatedToon.cardInstruction = { ...inst };
        updatedToon.cardInstruction.instID = updatedToon.cardID;
        //set bonuses from the copied card
        let effect = bonusEffectsData.filter((x) => x.bonusID === card.id)[0];
        updatedToon.bonusEffect = { ...effect };
        updatedToon.bonusEffect.bonusID = updatedToon.cardID;
      }

      //set groupAttack from the copied card
      let colors = new Set();
      for (let i = 0; i < card.attacks.length; i++) colors.add(card.attacks[i]);
      //get number of each dice color
      for (let c of colors) {
        let n = card.attacks.filter((x) => x === c).length;
        updatedToon.groupAttack += `${n}${c} `;
      }
      //set groupDefense from the copied card
      let dcolors = new Set();
      for (let i = 0; i < card.defense.length; i++)
        dcolors.add(card.defense[i]);
      //get number of each dice color
      for (let c of dcolors) {
        let n = card.defense.filter((x) => x == c).length;
        updatedToon.groupDefense += `${n}${c} `;
      }
      updatedToon.groupAttack = updatedToon.groupAttack.trim();
      updatedToon.groupDefense = updatedToon.groupDefense.trim();
      //set the equivalent dice strings in the deployment card
      updatedToon.deploymentCard.defense = core.parseDiceString(
        updatedToon.groupDefense.split(" ")
      );
      updatedToon.deploymentCard.attacks = core.parseDiceString(
        updatedToon.groupAttack.split(" ")
      );

      console.log("🚀 ~ CustomToon ~ constructor ~ updatedToon:", updatedToon);

      return updatedToon;
    };
  }
  // #faction;
  // get faction() {
  //   return this.#faction;
  // }
  // set faction(faction) {
  //   this.#faction = faction;
  //   this.deploymentCard.faction = faction;
  // }

  // #cardName;
  // get cardName() {
  //   return this.#cardName;
  // }
  // set cardName(cardName) {
  //   this.#cardName = cardName;
  //   this.deploymentCard.name = cardName;
  // }

  // #cardSubName;
  // get cardSubName() {
  //   return this.#cardSubName;
  // }
  // set cardSubName(cardSubName) {
  //   this.#cardSubName = cardSubName;
  //   this.deploymentCard.subname = cardSubName;
  // }

  // #cardID;
  // get cardID() {
  //   return this.#cardID;
  // }
  // set cardID(cardID) {
  //   this.#cardID = cardID;
  //   this.deploymentCard.id = cardID;
  // }
  //groupAttack,groupDefense
}

class MapEntity {
  constructor(name = "New Map Entity", ownerGUID) {
    if (this.constructor === MapEntity) {
      throw new Error(
        "MapEntity is an abstract class and cannot be instantiated directly"
      );
    }
    this.name = name;
    this.GUID = core.createGUID();
    this.mapSectionOwner = ownerGUID || core.oneGUID; //default start section
    this.entityProperties = new EntityProperties(name);
    this.entityPosition = "1000,1000";
    this.entityRotation = 0.0;
    this.hasProperties = true;
    this.hasColor = true;
  }
  entityType; //EntityType
}

export class CrateEntity extends MapEntity {
  constructor(ownerGUID) {
    super("New Crate", ownerGUID);
    this.name = "New Crate";
    this.entityProperties.name = "New Crate"; //??????
    this.entityType = core.EntityType.Crate;
    this.deploymentColor = "Gray";
  }
}

export class TerminalEntity extends MapEntity {
  constructor(ownerGUID) {
    super(ownerGUID);
    this.name = "New Terminal";
    this.entityType = core.EntityType.Console;
    this.deploymentColor = "Gray";
  }
}

export class DoorEntity extends MapEntity {
  constructor(ownerGUID) {
    super(ownerGUID);
    this.name = "New Door";
    this.entityType = core.EntityType.Door;
    this.deploymentColor = "Gray";
  }
}

export class DeploymentPointEntity extends MapEntity {
  constructor(ownerGUID) {
    super(ownerGUID);
    this.name = "New Deployment Point";
    this.entityType = core.EntityType.DeploymentPoint;
    this.deploymentColor = "Gray";
  }
}

export class TokenEntity extends MapEntity {
  constructor(ownerGUID) {
    super(ownerGUID);
    this.name = "New Marker";
    this.entityType = core.EntityType.Token;
    this.deploymentColor = "Gray";
  }
}

export class HighlightEntity extends MapEntity {
	constructor(ownerGUID) {
		super(ownerGUID);
		this.name = "New Highlight";
		this.entityType = core.EntityType.Highlight;
		this.deploymentColor = "Green";
	}
}

export class CampaignSkill {
  constructor(name, cost) {
    this.owner = core.createGUID();
    this.id = "";
    this.name = name;
    this.cost = cost;
  }
  owner;
  id;
  name;
  cost;
}
