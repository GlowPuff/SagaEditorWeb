// import { useState, useEffect } from "react";
import { Fragment, useState } from "react";
import PropTypes from "prop-types";
//mui
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//dialogs
import NewTriggerDialog from "./Dialogs/NewTriggerDialog";
import NewEventDialog from "./Dialogs/NewEventDialog";
//components
import MissionSaveButton from "./SubComponents/MissionSaveButton";
import MissionLoadButton from "./SubComponents/MissionLoadButton";
//data
import { createGUID } from "../lib/core";
import { MissionEvent, MissionTrigger } from "../data/Mission";
import {
  useMissionPropertiesStore,
  useInitialGroupsStore,
  useReservedGroupsStore,
  useEventGroupStore,
  useEntityGroupStore,
  useMapSectionsStore,
  useEventsStore,
  useTriggerStore,
  useMapEntitiesStore,
  useToonsStore,
} from "../data/dataStore";
import emptyMissionRaw from "../data/emptyMission.json?raw";

export default function AppBar({ languageID, onClearMap }) {
  const addEvent = useEventsStore((state) => state.addEvent);
  const addTrigger = useTriggerStore((state) => state.addTrigger);
  const addMapSection = useMapSectionsStore((state) => state.addSection);
  const [open, setOpen] = useState(false);
  //set state methods
  const importMissionProps = useMissionPropertiesStore(
    (state) => state.importMission
  );
  const importInitialGroups = useInitialGroupsStore(
    (state) => state.importMission
  );
  const importReservedGroups = useReservedGroupsStore(
    (state) => state.importMission
  );
  const importEventGroups = useEventGroupStore((state) => state.importMission);
  const importEntityGroups = useEntityGroupStore(
    (state) => state.importMission
  );
  const importMapSections = useMapSectionsStore((state) => state.importMission);
  const importEvents = useEventsStore((state) => state.importMission);
  const importTriggers = useTriggerStore((state) => state.importMission);
  const importMapEntities = useMapEntitiesStore((state) => state.importMission);
  const importCustomToons = useToonsStore((state) => state.importMission);

  function onNewMission() {
    setOpen(true);
  }

  function onNewTrigger() {
    NewTriggerDialog.ShowDialog(new MissionTrigger(), (value) => {
      addTrigger(value);
    });
  }

  function onNewEvent() {
    NewEventDialog.ShowDialog(new MissionEvent(), (value) => {
      addEvent(value);
    });
  }

  function onNewSection() {
    addMapSection("New Map Section");
  }

  function handleClose(bContinue) {
    setOpen(false);
    if (bContinue) {
      const emptyMission = JSON.parse(emptyMissionRaw);
      //generate new GUIDs
      emptyMission.missionProperties.customMissionIdentifier = createGUID();
      emptyMission.missionGUID = createGUID();
      // console.log("🚀 ~ handleClose ~ emptyMission:", emptyMission);

      onClearMap();

      importMissionProps(emptyMission);
      importInitialGroups(emptyMission);
      importReservedGroups(emptyMission);
      importEventGroups(emptyMission);
      importEntityGroups(emptyMission);
      importMapSections(emptyMission);
      importEvents(emptyMission);
      importTriggers(emptyMission);
      importMapEntities(emptyMission);
      importCustomToons(emptyMission);
    }
  }

  function clearData() {
    onClearMap();
  }

  return (
    <div className="menu">
      <Paper>
        <div className="menubar">
          <Typography variant="h6">Mission Editor</Typography>

          <Tooltip title="Create a new Mission">
            <IconButton
              variant="contained"
              onClick={onNewMission}
              size="large"
              style={{ color: "purple" }}
            >
              <AddBoxIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>

          <MissionLoadButton onClearData={clearData} />

          <MissionSaveButton languageID={languageID} />

          <FiberManualRecordIcon sx={{ transform: "scale(.5)" }} />

          <Tooltip title="Add a new Trigger">
            <Button
              variant="contained"
              onClick={onNewTrigger}
              startIcon={<ToggleOnIcon />}
            >
              Add Trigger...
            </Button>
          </Tooltip>

          <Tooltip title="Add a new Event">
            <Button
              variant="contained"
              onClick={onNewEvent}
              startIcon={<DynamicFormIcon />}
            >
              Add Event...
            </Button>
          </Tooltip>

          <Tooltip title="Add a new Map Section">
            <Button
              variant="contained"
              onClick={onNewSection}
              startIcon={<LibraryAddIcon />}
            >
              Add Map Section
            </Button>
          </Tooltip>

          {/* <FiberManualRecordIcon sx={{ transform: "scale(.5)" }} /> */}

          {/* <Typography>Active Section</Typography> */}

          {/* <Select
            value={selectedSection}
            onChange={(e) => changeSection(e.target.value)}
            displayEmpty
          >
            {mapSections &&
              mapSections.map((item, index) => (
                <MenuItem key={index} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
          </Select> */}
        </div>
      </Paper>

      <NewTriggerDialog />
      <NewEventDialog />
      <Fragment>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            {"Create a new Mission?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Creating a new Mission will clear the current Mission and you will
              lose any unsaved changes. Do you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{ color: "pink" }}
              onClick={() => handleClose(true)}
            >
              Create New Mission
            </Button>
            <Button
              variant="contained"
              onClick={() => handleClose(false)}
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </div>
  );
}

AppBar.propTypes = {
  mapSections: PropTypes.array,
  onChangeSelectedSection: PropTypes.func,
  languageID: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
  onClearMap: PropTypes.func,
};
