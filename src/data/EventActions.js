import {
  EventActionType,
  ThreatModifierType,
  ThreatAction,
  DeploymentSpot,
  createGUID,
  emptyGUID,
  CustomInstructionType,
  PriorityTargetType,
  GroupType,
} from "../lib/core";
import { NoneThumb, EnemyGroupData } from "./Mission";
//components
import GenericTextDialog from "../components/Dialogs/GenericTextDialog";
import MissionManagementDialog from "../components/EventActionDialogs/MissionManagementDialog";
import ChangeObjectiveDialog from "../components/EventActionDialogs/ChangeObjectiveDialog";
import ModifyVariableDialog from "../components/EventActionDialogs/ModifyVariableDialog";
import ModifyThreatDialog from "../components/EventActionDialogs/ModifyThreatDialog";
import ActivateEventGroupDialog from "../components/EventActionDialogs/ActivateEventGroupDialog";
import ModifyRoundLimitDialog from "../components/EventActionDialogs/ModifyRoundLimitDialog";
import SetCountdownDialog from "../components/EventActionDialogs/SetCountdownDialog";
import QuestionPromptDialog from "../components/EventActionDialogs/QuestionPromptDialog";
import InputPromptDialog from "../components/EventActionDialogs/InputPromptDialog";
import EnemyDeploymentDialog from "../components/EventActionDialogs/EnemyDeploymentDialog";
import AllyDeploymentDialog from "../components/EventActionDialogs/AllyDeploymentDialog";
import OptionalDeploymentDialog from "../components/EventActionDialogs/OptionalDeploymentDialog";
import RandomDeploymentDialog from "../components/EventActionDialogs/RandomDeploymentDialog";
import AddToHandDialog from "../components/EventActionDialogs/AddToHandDialog";
import ChangeInstructionsDialog from "../components/EventActionDialogs/ChangeInstructionsDialog";
import ChangeTargetDialog from "../components/EventActionDialogs/ChangeTargetDialog";
import ChangeRepositionDialog from "../components/EventActionDialogs/ChangeRepositionDialog";
import ChangeGroupStatusDialog from "../components/EventActionDialogs/ChangeGroupStatusDialog";
import ResetGroupDialog from "../components/EventActionDialogs/ResetGroupDialog";
import RemoveGroupDialog from "../components/EventActionDialogs/RemoveGroupDialog";
import QueryGroupDialog from "../components/EventActionDialogs/QueryGroupDialog";
import MapManagementDialog from "../components/EventActionDialogs/MapManagementDialog";
import ModifyMapEntityDialog from "../components/EventActionDialogs/ModifyMapEntityDialog";
import ModifyXPDialog from "../components/EventActionDialogs/ModifyXPDialog";
import ModifyCreditsDialog from "../components/EventActionDialogs/ModifyCreditsDialog";
import ModifyFameAwardsDialog from "../components/EventActionDialogs/ModifyFameAwardsDialog";
import SetNextMissionDialog from "../components/EventActionDialogs/SetNextMissionDialog";
import AddCampaignRewardDialog from "../components/EventActionDialogs/AddCampaignRewardDialog";

export function EAFactoryActions(eaType, eventAction, callback) {
  // console.log("🚀 ~ EAFactoryActions ~ eaType:", eaType);
  switch (eaType) {
    case EventActionType.G1: {
      eventAction =
        eventAction === undefined ? new MissionManagement() : eventAction;
      MissionManagementDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G2: {
      eventAction =
        eventAction === undefined ? new ChangeMissionInfo() : eventAction;
      GenericTextDialog.ShowDialog(
        "Change Mission Info Event Action",
        eventAction.theText,
        (value) => {
          eventAction.theText = value;
          callback(eventAction);
        }
      );
      break;
    }
    case EventActionType.G3: {
      eventAction =
        eventAction === undefined ? new ChangeObjective() : eventAction;
      ChangeObjectiveDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G4: {
      eventAction =
        eventAction === undefined ? new ModifyVariable() : eventAction;
      ModifyVariableDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G5: {
      eventAction =
        eventAction === undefined ? new ModifyThreat() : eventAction;
      ModifyThreatDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G8: {
      eventAction =
        eventAction === undefined ? new ActivateEventGroup() : eventAction;
      ActivateEventGroupDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G10: {
      eventAction =
        eventAction === undefined ? new ModifyRoundLimit() : eventAction;
      ModifyRoundLimitDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G11: {
      eventAction =
        eventAction === undefined ? new SetCountdown() : eventAction;
      SetCountdownDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G7: {
      eventAction = eventAction === undefined ? new ShowTextBox() : eventAction;
      GenericTextDialog.ShowDialog(
        "Show Text Event Action",
        eventAction.theText,
        (value) => {
          eventAction.theText = value;
          callback(eventAction);
        }
      );
      break;
    }
    case EventActionType.G6: {
      eventAction =
        eventAction === undefined ? new QuestionPrompt() : eventAction;
      QuestionPromptDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.G9: {
      eventAction = eventAction === undefined ? new InputPrompt() : eventAction;
      InputPromptDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.D1: {
      eventAction =
        eventAction === undefined ? new EnemyDeployment() : eventAction;
      EnemyDeploymentDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.D2: {
      eventAction =
        eventAction === undefined ? new AllyDeployment() : eventAction;
      AllyDeploymentDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.D3: {
      eventAction =
        eventAction === undefined ? new OptionalDeployment() : eventAction;
      OptionalDeploymentDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.D4: {
      eventAction =
        eventAction === undefined ? new RandomDeployment() : eventAction;
      RandomDeploymentDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.D5: {
      eventAction =
        eventAction === undefined ? new AddGroupDeployment() : eventAction;
      AddToHandDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.GM1: {
      eventAction =
        eventAction === undefined ? new ChangeInstructions() : eventAction;
      ChangeInstructionsDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.GM2: {
      eventAction =
        eventAction === undefined ? new ChangeTarget() : eventAction;
      ChangeTargetDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.GM3: {
      eventAction =
        eventAction === undefined ? new ChangeGroupStatus() : eventAction;
      ChangeGroupStatusDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.GM4: {
      eventAction =
        eventAction === undefined
          ? new ChangeRepositionInstructions()
          : eventAction;
      ChangeRepositionDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.GM5: {
      eventAction = eventAction === undefined ? new ResetGroup() : eventAction;
      ResetGroupDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.GM6: {
      eventAction = eventAction === undefined ? new RemoveGroup() : eventAction;
      RemoveGroupDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.GM7: {
      eventAction = eventAction === undefined ? new QueryGroup() : eventAction;
      QueryGroupDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.M1: {
      eventAction =
        eventAction === undefined ? new MapManagement() : eventAction;
      MapManagementDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.M2: {
      eventAction =
        eventAction === undefined ? new ModifyMapEntity() : eventAction;
      // console.log("🚀 ~ EAFactoryActions ~ eventAction:", eventAction)
      ModifyMapEntityDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.CM1: {
      eventAction =
        eventAction === undefined ? new CampaignModifyXP() : eventAction;
      ModifyXPDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.CM2: {
      eventAction =
        eventAction === undefined ? new CampaignModifyCredits() : eventAction;
      ModifyCreditsDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.CM3: {
      eventAction =
        eventAction === undefined
          ? new CampaignModifyFameAwards()
          : eventAction;
      ModifyFameAwardsDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.CM4: {
      eventAction =
        eventAction === undefined ? new CampaignSetNextMission() : eventAction;
      SetNextMissionDialog.ShowDialog(eventAction, callback);
      break;
    }
    case EventActionType.CM5: {
      eventAction =
        eventAction === undefined ? new AddCampaignReward() : eventAction;
      AddCampaignRewardDialog.ShowDialog(eventAction, callback);
      break;
    }

    default:
      console.error(`Unknown event action type: ${eaType}`);
  }
}

class EventAction {
  constructor(dName) {
    this.displayName = dName;
    this.GUID = createGUID();
  }
  //string
  GUID;
  displayName;
  //int
  eventActionType;
}

export class MissionManagement extends EventAction {
  constructor() {
    super("Mission Management");
    this.eventActionType = EventActionType.G1;
    //EA props
    this.incRoundCounter =
      this.pauseDeployment =
      this.unpauseDeployment =
      this.pauseThreat =
      this.unpauseThreat =
      this.endMission =
        false;
  }
  //bool
  incRoundCounter;
  pauseDeployment;
  unpauseDeployment;
  pauseThreat;
  unpauseThreat;
  endMission;
}

export class ChangeMissionInfo extends EventAction {
  constructor() {
    super("Change Mission Info");
    this.eventActionType = EventActionType.G2;
    //EA props
    this.theText = "";
  }
  theText;
}

export class ChangeObjective extends EventAction {
  constructor() {
    super("Change Objective");
    this.eventActionType = EventActionType.G3;
    //EA props
    this.theText = "";
    this.longText = "";
  }
  theText;
  longText;
}

export class ModifyVariable extends EventAction {
  constructor() {
    super("Modify Variable(s)");
    this.eventActionType = EventActionType.G4;
    //EA props
    this.triggerList = [];
  }
  triggerList; //array of TriggerModifier
}

export class ModifyThreat extends EventAction {
  constructor() {
    super("Modify Threat");
    this.eventActionType = EventActionType.G5;
    //EA props
    this.threatAction = ThreatAction.Add;
    this.fixedValue = 0;
    this.threatValue = 0;
    this.threatModifierType = ThreatModifierType.Fixed;
  }
  //int
  fixedValue;
  threatValue;
  threatModifierType; //ThreatModifierType
}

export class ActivateEventGroup extends EventAction {
  constructor() {
    super("Activate Event Group");
    this.eventActionType = EventActionType.G8;
  }
  eventGroupGUID = "";
}

export class ModifyRoundLimit extends EventAction {
  constructor() {
    super("Modify Round Limit");
    this.eventActionType = EventActionType.G10;
    //EA props
    this.roundLimitModifier = 0;
    this.setLimitTo = 0;
    this.eventGUID = emptyGUID;
    this.disableRoundLimit = false;
    this.setRoundLimit = false;
  }
  //int
  roundLimitModifier;
  setLimitTo;
  //string
  eventGUID; //GUID
  //bool
  disableRoundLimit;
  setRoundLimit;
}

export class SetCountdown extends EventAction {
  constructor() {
    super("Set Countdown");
    this.eventActionType = EventActionType.G11;
    //EA props
    this.countdownTimer = 0;
    this.eventGUID = emptyGUID;
    this.triggerGUID = emptyGUID;
    this.showPlayerCountdown = false;
    this.countdownTimerName = "Timer1";
  }
}

export class ShowTextBox extends EventAction {
  constructor() {
    super("Text Box");
    this.eventActionType = EventActionType.G7;
  }
  theText = "";
}

export class QuestionPrompt extends EventAction {
  constructor() {
    super("Question Prompt");
    this.eventActionType = EventActionType.G6;
    //EA props
    this.theText = "";
    this.includeCancel = false;
    this.buttonList = [];
  }
}

export class InputPrompt extends EventAction {
  constructor() {
    super("Input Prompt");
    this.eventActionType = EventActionType.G9;
    //EA props
    this.theText = "";
    this.failText = "";
    this.failTriggerGUID = emptyGUID;
    this.failEventGUID = emptyGUID;
    this.inputList = []; //InputRange
  }
}

export class EnemyDeployment extends EventAction {
  constructor() {
    super("Deploy: DG001/Stormtrooper");
    this.eventActionType = EventActionType.D1;
    //EA props
    //string
    this.enemyName = "";
    this.deploymentGroup = "DG001";
    this.modification = "";
    this.repositionInstructions = "";
    this.specificDeploymentPoint = emptyGUID; //GUID
    //int
    this.threatCost = 0;
    //bool
    this.canReinforce = true;
    this.canRedeploy = true;
    this.canBeDefeated = true;
    this.useThreat = false;
    this.showMod = false;
    this.useCustomInstructions = false;
    this.useGenericMugshot = false;
    this.useResetOnRedeployment = false;
    //object
    this.deploymentPoint = DeploymentSpot.Active;
    this.thumbnail = NoneThumb; //Thumbnail class
    //setup enemy group with Stormtrooper data
    let group = new EnemyGroupData();
    group.name = "Stormtrooper";
    group.cardID = "DG001";
    group.pointList = [];
    for (let index = 0; index < 3; index++) {
      group.pointList.push({ GUID: emptyGUID });
    }
    this.enemyGroupData = group; //EnemyGroupData
  }
}

export class AllyDeployment extends EventAction {
  constructor() {
    super("Ally/Rebel Deployment");
    this.eventActionType = EventActionType.D2;
    //EA props
    //string
    this.allyID = "A001";
    this.allyName = "";
    this.setTrigger = emptyGUID;
    this.setEvent = emptyGUID;
    this.specificDeploymentPoint = emptyGUID;
    this.deploymentPoint = DeploymentSpot.Active; //DeploymentSpot
    //int
    this.threatCost = 0;
    //bool
    this.useThreat = false;
    this.useGenericMugshot = false;
  }
}

export class OptionalDeployment extends EventAction {
  constructor() {
    super("Optional Deployment");
    this.eventActionType = EventActionType.D3;
    //EA props
    this.specificDeploymentPoint = emptyGUID;
    this.deploymentPoint = DeploymentSpot.Active; //DeploymentSpot
    //int
    this.threatCost = 0;
    //bool
    this.useThreat = true;
    this.isOnslaught = false;
  }
}

export class RandomDeployment extends EventAction {
  constructor() {
    super("Random Deployment");
    this.eventActionType = EventActionType.D4;
    //EA props
    this.specificDeploymentPoint = emptyGUID;
    this.threatType = ThreatModifierType.Fixed; //ThreatModifierType
    this.deploymentPoint = DeploymentSpot.Active; //DeploymentSpot
    //int
    this.fixedValue = 0;
    this.threatLevel = 1;
  }
}

export class AddGroupDeployment extends EventAction {
  constructor() {
    super("Add Group(s) to Deployment Hand");
    this.eventActionType = EventActionType.D5;
    //EA props
    this.groupsToAdd = []; //DeploymentCard
  }
}

export class ChangeInstructions extends EventAction {
  constructor() {
    super("Change Group Instructions");
    this.eventActionType = EventActionType.GM1;
    //EA props
    this.theText = "";
    this.instructionType = CustomInstructionType.Replace; //CustomInstructionType
    this.groupsToAdd = []; //DCPointer
  }
}

export class ChangeTarget extends EventAction {
  constructor() {
    super("Change Priority Target");
    this.eventActionType = EventActionType.GM2;
    //EA props
    this.targetType = PriorityTargetType.Rebel; //PriorityTargetType
    this.groupType = GroupType.All; //GroupType
    this.otherTarget = "";
    this.specificHero = "H1";
    this.specificAlly = "A001";
    this.groupsToAdd = []; //DCPointer
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
      useDefaultPriority: false,
    };
    //int
    this.percentChance = 60;
  }
}

export class ChangeGroupStatus extends EventAction {
  constructor() {
    super("Change Reposition Instructions");
    this.eventActionType = EventActionType.GM3;
    //EA props
    this.readyGroups = []; //DCPointer
    this.exhaustGroups = []; //DCPointer
  }
}

export class ChangeRepositionInstructions extends EventAction {
  constructor() {
    super("Change Reposition Instructions");
    this.eventActionType = EventActionType.GM4;
    //EA props
    this.theText = "";
    this.useSpecific = false;
    this.repoGroups = []; //DCPointer
  }
}

export class ResetGroup extends EventAction {
  constructor() {
    super("Reset Group Defaults");
    this.eventActionType = EventActionType.GM5;
    //EA props
    this.groupsToAdd = []; //DCPointer
    this.resetAll = true;
  }
}

export class RemoveGroup extends EventAction {
  constructor() {
    super("Reset Group Defaults");
    this.eventActionType = EventActionType.GM6;
    //EA props
    this.groupsToRemove = []; //DCPointer
    this.allyGroupsToRemove = []; //DCPointer
  }
}

export class QueryGroup extends EventAction {
  constructor() {
    super("Query Group");
    this.eventActionType = EventActionType.GM7;
    //EA props
    this.groupEnemyToQuery = null; //DCPointer
    this.groupRebelToQuery = null; //DCPointer
    this.foundTrigger = emptyGUID; //GUID string
    this.foundEvent = emptyGUID; //GUID string
  }
}

export class MapManagement extends EventAction {
  constructor() {
    super("Map Management");
    this.eventActionType = EventActionType.M1;
    //EA props
    this.mapTile = emptyGUID;
    this.mapTileRemove = emptyGUID;
    this.mapSection = emptyGUID;
    this.mapSectionRemove = emptyGUID;
  }
}

export class ModifyMapEntity extends EventAction {
  constructor() {
    super("Modify Map Entity");
    this.eventActionType = EventActionType.M2;
    //EA props
    this.entitiesToModify = []; //EntityModifier
  }
}

export class CampaignModifyXP extends EventAction {
  constructor() {
    super("Modify XP");
    this.eventActionType = EventActionType.CM1;
    //EA props
    this.xpToAdd = 0;
  }
}

export class CampaignModifyCredits extends EventAction {
  constructor() {
    super("Modify Credits");
    this.eventActionType = EventActionType.CM2;
    //EA props
    this.creditsToModify = 0;
    this.multiplyByHeroCount = false;
  }
}

export class CampaignModifyFameAwards extends EventAction {
  constructor() {
    super("Modify Fame and Awards");
    this.eventActionType = EventActionType.CM3;
    //EA props
    this.fameToAdd = 0;
    this.awardsToAdd = 0;
  }
}

export class CampaignSetNextMission extends EventAction {
  constructor() {
    super("Set Next Mission");
    this.eventActionType = EventActionType.CM4;
    //EA props
    this.missionID = "core1";
    this.customMissionID = "";
  }
}

export class AddCampaignReward extends EventAction {
  constructor() {
    super("Add Campaign Reward");
    this.eventActionType = EventActionType.CM5;
    //EA props
    this.campaignItems = []; //item201
    this.campaignRewards = []; //general01
    this.earnedVillains = []; //DG088
    this.earnedAllies = []; //A013
    this.medpacsToModify = 0;
    this.threatToModify = 0;
  }
}
