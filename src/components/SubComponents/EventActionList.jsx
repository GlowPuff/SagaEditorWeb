import PropTypes from "prop-types";
//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
//icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//dialogs
import NewEADialog from "../Dialogs/NewEADialog";
//data
import { EAFactoryActions } from "../../data/EventActions";
//event action dialogs
import MissionManagementDialog from "../EventActionDialogs/MissionManagementDialog";
import ChangeObjectiveDialog from "../EventActionDialogs/ChangeObjectiveDialog";
import ModifyVariableDialog from "../EventActionDialogs/ModifyVariableDialog";
import ModifyThreatDialog from "../EventActionDialogs/ModifyThreatDialog";
import ActivateEventGroupDialog from "../EventActionDialogs/ActivateEventGroupDialog";
import ModifyRoundLimitDialog from "../EventActionDialogs/ModifyRoundLimitDialog";
import SetCountdownDialog from "../EventActionDialogs/SetCountdownDialog";
import QuestionPromptDialog from "../EventActionDialogs/QuestionPromptDialog";
import InputPromptDialog from "../EventActionDialogs/InputPromptDialog";
import EnemyDeploymentDialog from "../EventActionDialogs/EnemyDeploymentDialog";
import AllyDeploymentDialog from "../EventActionDialogs/AllyDeploymentDialog";
import OptionalDeploymentDialog from "../EventActionDialogs/OptionalDeploymentDialog";
import RandomDeploymentDialog from "../EventActionDialogs/RandomDeploymentDialog";
import AddToHandDialog from "../EventActionDialogs/AddToHandDialog";
import ChangeInstructionsDialog from "../EventActionDialogs/ChangeInstructionsDialog";
import ChangeTargetDialog from "../EventActionDialogs/ChangeTargetDialog";
import ChangeRepositionDialog from "../EventActionDialogs/ChangeRepositionDialog";
import ChangeGroupStatusDialog from "../EventActionDialogs/ChangeGroupStatusDialog";
import ResetGroupDialog from "../EventActionDialogs/ResetGroupDialog";
import RemoveGroupDialog from "../EventActionDialogs/RemoveGroupDialog";
import QueryGroupDialog from "../EventActionDialogs/QueryGroupDialog";
import MapManagementDialog from "../EventActionDialogs/MapManagementDialog";
import ModifyMapEntityDialog from "../EventActionDialogs/ModifyMapEntityDialog";
import ModifyXPDialog from "../EventActionDialogs/ModifyXPDialog";
import ModifyCreditsDialog from "../EventActionDialogs/ModifyCreditsDialog";
import ModifyFameAwardsDialog from "../EventActionDialogs/ModifyFameAwardsDialog";
import SetNextMissionDialog from "../EventActionDialogs/SetNextMissionDialog";
import AddCampaignRewardDialog from "../EventActionDialogs/AddCampaignRewardDialog";

export default function EventActionList({ eventActions, modifyEA }) {
  function modifyEAClick(command, ea) {
    // console.log("🚀 ~ modifyEAClick ~ ea:", ea);
    // console.log("🚀 ~ modifyEAClick ~ command:", command);
    switch (command) {
      case "add":
        NewEADialog.ShowDialog((eaType) => {
          console.log("🚀 ~ NewEADialog.ShowDialog ~ eaType:", eaType);
          EAFactoryActions(eaType, undefined, (eA) => modifyEA("add", eA));
        });
        break;
      case "edit":
        EAFactoryActions(ea.eventActionType, ea, (eA) => modifyEA("edit", eA));
        break;
      case "remove":
        modifyEA("remove", ea); //ea=index
        break;
      case "up":
        modifyEA("up", ea); //ea=index
        break;
      case "down":
        modifyEA("down", ea); //ea=index
        break;
    }
  }

  return (
    <div className="event-container">
      {/* LEFT */}
      <List
        sx={{
          flex: "1",
          borderRight: "1px solid white",
          paddingRight: ".5rem",
          overflow: "hidden auto",
          scrollbarColor: "#bc56ff #4c4561",
          scrollbarWidth: "thin",
          maxHeight: "14rem",
        }}
      >
        {eventActions.map((item, index) => (
          <div key={index} className="event-container">
            <ListItem
              disablePadding
              onDoubleClick={() => modifyEAClick("edit", item)}
            >
              <ListItemButton>{item.displayName}</ListItemButton>
            </ListItem>

            <div className="quad-column-grid">
              {/* <Tooltip title="Edit Event Action"> */}
              <IconButton
                edge="end"
                onClick={() => modifyEAClick("edit", item)}
                fontSize="medium"
              >
                <EditIcon />
              </IconButton>
              {/* </Tooltip> */}
              {/* <Tooltip title="Move Event Action Up"> */}
              <IconButton edge="end" onClick={() => modifyEAClick("up", index)}>
                <KeyboardArrowUpIcon />
              </IconButton>
              {/* </Tooltip> */}
              {/* <Tooltip title="Move Event Action Down"> */}
              <IconButton
                edge="end"
                onClick={() => modifyEAClick("down", index)}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
              {/* </Tooltip> */}
              {/* <Tooltip title="Remove Event Action"> */}
              <IconButton
                edge="end"
                onClick={() => modifyEAClick("remove", index)}
              >
                <DeleteIcon />
              </IconButton>
              {/* </Tooltip> */}
            </div>
          </div>
        ))}
      </List>

      {/* RIGHT */}
      <div style={{ marginBottom: "auto" }}>
        <Tooltip title="Add New Event Action">
          <IconButton
            onClick={(ev) => {
              modifyEAClick("add", ev);
            }}
          >
            <AddIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </div>

      <NewEADialog />
      <MissionManagementDialog />
      <ChangeObjectiveDialog />
      <ModifyVariableDialog />
      <ModifyThreatDialog />
      <ActivateEventGroupDialog />
      <ModifyRoundLimitDialog />
      <SetCountdownDialog />
      <QuestionPromptDialog />
      <InputPromptDialog />
      <EnemyDeploymentDialog />
      <AllyDeploymentDialog />
      <OptionalDeploymentDialog />
      <RandomDeploymentDialog />
      <AddToHandDialog />
      <ChangeInstructionsDialog />
      <ChangeTargetDialog />
      <ChangeRepositionDialog />
      <ChangeGroupStatusDialog />
      <ResetGroupDialog />
      <RemoveGroupDialog />
      <QueryGroupDialog />
      <MapManagementDialog />
      <ModifyMapEntityDialog />
      <ModifyXPDialog />
      <ModifyCreditsDialog />
      <ModifyFameAwardsDialog />
      <SetNextMissionDialog />
      <AddCampaignRewardDialog />
    </div>
  );
}

EventActionList.propTypes = {
  eventActions: PropTypes.array,
  modifyEA: PropTypes.func,
};
