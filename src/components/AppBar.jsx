// import { useState, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
// import Typography from "@mui/material/Typography";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
//icons
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveIcon from "@mui/icons-material/Save";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
//dialogs
import NewTriggerDialog from "./Dialogs/NewTriggerDialog";
import NewEventDialog from "./Dialogs/NewEventDialog";

//data
import { MissionEvent, MissionTrigger } from "../data/Mission";
import {
  useMapSectionsStore,
  useEventsStore,
  useTriggerStore,
} from "../data/dataStore";

export default function AppBar() {
  const missionEvents = useEventsStore((state) => state.missionEvents); //useEvents();
  const addEvent = useEventsStore((state) => state.addEvent);
  const addTrigger = useTriggerStore((state) => state.addTrigger);
  const addMapSection = useMapSectionsStore((state) => state.addSection);

  function onFileOpen() {
    console.log(missionEvents);
  }

  function onSave() {}

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

  return (
    <div className="menu">
      <Paper>
        <div className="menubar">
          <Typography variant="h6">Mission Editor</Typography>

          <Tooltip title="Open a Mission">
            <Button
              sx={{ marginLeft: "auto" }}
              variant="contained"
              onClick={onFileOpen}
              startIcon={<FileOpenIcon />}
            >
              Open...
            </Button>
          </Tooltip>

          <Tooltip title="Save the Mission">
            <Button
              variant="contained"
              onClick={onSave}
              startIcon={<SaveIcon />}
            >
              Save...
            </Button>
          </Tooltip>

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
    </div>
  );
}

AppBar.propTypes = {
  mapSections: PropTypes.array,
  onChangeSelectedSection: PropTypes.func,
};
