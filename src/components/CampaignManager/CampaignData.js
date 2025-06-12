import { createGUID } from "../../lib/core";

export class CampaignPackage {
  constructor() {
    this.packageVersion = "2";
    this.GUID = createGUID();
    this.campaignName = "Default Campaign Name";
    this.campaignStructure = [];
    this.campaignMissionItems = [];
    this.campaignTranslationItems = [];
    this.campaignInstructions = "";
    this.campaignIconName = "none.png";
  }
}

// export class CampaignTranslationItem {
//   constructor() {
//     this.languageCode = "en";
//     this.campaignName = "";
//     this.campaignInstructions = "";
//     this.campaignIconName = "none.png";
//     this.campaignDescription = "";
//     this.campaignMissionItems = [];
//   }
// }

export class CampaignStructure {
  constructor() {
    //in ICE, missionID is the missionGUID of the CampaignMissionItem.mission as a string
    this.missionID = "00000000-0000-0000-0000-000000000000";
    this.itemTier = Tier.One;
    this.expansionCode = "Imported";
    this.isItemChecked = false;
    this.isForced = false;
    this.agendaType = AgendaType.NotSet;
    this.missionSource = MissionSource.None;
    this.structureGUID = createGUID();
    this.canModify = true;
    this.projectItem = new ProjectItem();
    this.customMissionIdentifier = null;
    this.hasCustomSetNextEventActions = false;
    this.missionType = MissionType.Story;
    this.threatLevel = 0;
    this.isAgendaMission = false;
  }
}

export class ProjectItem {
  constructor() {
    this.Title = "Player's Choice";
    this.fullPathWithFilename = null;
    this.Date = null;
    this.fileVersion = null;
    this.Description = null;
    this.fileName = null;
    this.timeTicks = 0;
    this.missionGUID = "00000000-0000-0000-0000-000000000000";
  }
}

export class CampaignSlot {
  constructor() {
    this.GUID = createGUID();
    this.campaignMissionItem = new MissionItem();
    this.structure = new CampaignStructure();
    this.translationItems = []; //TranslationItem (Missions)
  }
}

//campaignTranslationItems in final CampaignPackage
export class TranslationItem {
  constructor() {
    //default values for instruction translations
    this.fileName = "";
    this.assignedMissionName = "Campaign Instructions";
    this.isInstruction = true;
    this.assignedMissionGUID = "00000000-0000-0000-0000-000000000000";

    //app data not part of the final CampaignPackage
    // this.languageID = "English (EN)"; //default language ID
  }
}

//campaignMissionItems in final CampaignPackage
export class MissionItem {
  constructor() {
    this.GUID = createGUID();
    this.missionGUID = "00000000-0000-0000-0000-000000000000";
    this.customMissionIdentifier = "00000000-0000-0000-0000-000000000000";
    this.missionName = "";
  }
}

//all the imported files that are not part of the CampaignPackage
export class RawTranslationData {
  constructor(id, data, type) {
    this.identifier = id; //filename
    //the actual translation text (instructions translations) or JSON (mission translations)
    this.translationData = data;
    this.dataType = type; //TranslationType
  }
}

export const TranslationType = {
  Mission: 0,
  Instruction: 1,
};

export const Tier = {
  One: ["1"],
  Two: ["2"],
  Three: ["3"],
  OneTwo: ["1", "2"],
  OneTwoThree: ["1", "2", "3"],
  OneThree: ["1", "3"],
  TwoThree: ["2", "3"],
};

export const MissionType = {
  Story: 1,
  Side: 2,
  Forced: 3,
  Introduction: 4,
  Interlude: 5,
  Finale: 6,
};

export const AgendaType = {
  NotSet: 0,
  Rebel: 1,
  Imperial: 2,
};

export const MissionSource = {
  None: 0,
  Official: 1,
  Custom: 2,
  Embedded: 3,
};
