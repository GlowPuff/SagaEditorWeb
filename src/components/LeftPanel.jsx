import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
//mui
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
//icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//dialogs
import NewTriggerDialog from "./Dialogs/NewTriggerDialog";
import NewEventDialog from "./Dialogs/NewEventDialog";
//components
import TriggerValidator from "./SubComponents/TriggerValidator";
//data
import { emptyGUID } from "../lib/core";
import { MissionTrigger, MissionEvent } from "../data/Mission";
import { useEventsStore, useTriggerStore } from "../data/dataStore";

const LeftPanel = forwardRef((props, ref) => {
  const [selectedTriggerIndex, setSelectedTriggerIndex] = useState(0);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [dataChanged, setDataChanged] = useState(false);

  const missionTriggers = useTriggerStore((state) => state.missionTriggers);
  const addTrigger = useTriggerStore((state) => state.addTrigger);
  const updateTrigger = useTriggerStore((state) => state.updateTrigger);
  const removeTrigger = useTriggerStore((state) => state.removeTrigger);

  const missionEvents = useEventsStore((state) => state.missionEvents);
  const addEvent = useEventsStore((state) => state.addEvent);
  const removeEvent = useEventsStore((state) => state.removeEvent);
  const updateEvent = useEventsStore((state) => state.updateEvent);
  const duplicateEvent = useEventsStore((state) => state.duplicateEvent);
  const moveUp = useEventsStore((state) => state.moveUp);
  const moveDown = useEventsStore((state) => state.moveDown);

  useEffect(() => setDataChanged(false), []);

  function modifyEventClick(command) {
    //don't process "None" event
    if (command !== "add" && selectedEventIndex === 0) return;

    switch (command) {
      case "add":
        NewEventDialog.ShowDialog(new MissionEvent(), (value) => {
          addEvent(value);
        });
        break;
      case "edit":
        if (missionEvents[selectedEventIndex].GUID === emptyGUID) return;
        NewEventDialog.ShowDialog(
          missionEvents[selectedEventIndex],
          (value) => {
            updateEvent(value);
          }
        );
        break;
      case "remove":
        removeEvent(missionEvents[selectedEventIndex].GUID);
        setSelectedEventIndex(0);
        break;
      case "duplicate":
        duplicateEvent(missionEvents[selectedEventIndex]);
        setSelectedEventIndex(selectedEventIndex);
        break;
      case "up":
        if (selectedEventIndex <= 1) return;
        moveUp(selectedEventIndex);
        setSelectedEventIndex(selectedEventIndex - 1);
        break;
      case "down":
        if (selectedEventIndex === missionEvents.length - 1) return;
        moveDown(selectedEventIndex);
        setSelectedEventIndex(selectedEventIndex + 1);
        break;
    }
  }

  function modifyTriggerClick(command) {
    //don't process "None" trigger
    if (command !== "add" && selectedTriggerIndex === 0) return;

    switch (command) {
      case "add":
        NewTriggerDialog.ShowDialog(new MissionTrigger(), (value) => {
          addTrigger(value);
        });
        break;
      case "edit":
        NewTriggerDialog.ShowDialog(
          missionTriggers[selectedTriggerIndex],
          (value) => {
            updateTrigger(value);
            setDataChanged(true);
          }
        );
        break;
      case "remove":
        removeTrigger(missionTriggers[selectedTriggerIndex].GUID);
        setSelectedTriggerIndex(0);
        setDataChanged(true);
        break;
    }
  }

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setSelectedTriggerIndex(0);
      setSelectedEventIndex(0);
      setDataChanged(false);
    },
  }));

  return (
    <div className="left-panel">
      <Paper
        sx={{
          padding: ".5rem",
          height: "100%",
        }}
      >
        <div className="left-panel__layout">
          {/* TRIGGERS */}
          <div className="left-panel__item">
            <Accordion
              defaultExpanded
              sx={{
                backgroundColor: "#281b40",
                overflow: "auto",
                height: "100%",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Trigger Variables
              </AccordionSummary>
              <AccordionDetails>
                <div className="left-panel__item-layout">
                  <List
                    sx={{
                      // minHeight: "250px",
                    }}
                  >
                    {missionTriggers.map((item, index) => (
                      <ListItem
                        disablePadding
                        key={item.GUID}
                        onDoubleClick={() => modifyTriggerClick("edit")}
                      >
                        <ListItemButton
                          selected={selectedTriggerIndex === index}
                          onClick={() => setSelectedTriggerIndex(index)}
                        >
                          {item.name}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  {/* BUTTONS */}
                  <Paper sx={{ padding: ".5rem" }}>
                    <div className="left-panel__button-layout">
                      <Tooltip title="Add New Trigger">
                        <IconButton onClick={() => modifyTriggerClick("add")}>
                          <AddIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Selected Trigger">
                        <IconButton onClick={() => modifyTriggerClick("edit")}>
                          <EditIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Selected Trigger">
                        <IconButton
                          onClick={() => modifyTriggerClick("remove")}
                        >
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Paper>
                </div>
              </AccordionDetails>
            </Accordion>
            {/* </Paper> */}
          </div>

          {/* EVENTS */}
          <div className="left-panel__item">
            <Accordion
              defaultExpanded
              sx={{
                backgroundColor: "#281b40",
                overflow: "auto",
                height: "100%",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Events
              </AccordionSummary>
              <AccordionDetails>
                <div className="left-panel__item-layout">
                  <List
                    sx={
                      {
                        // minHeight: "250px",
                      }
                    }
                  >
                    {missionEvents.map((item, index) => (
                      <ListItem
                        disablePadding
                        key={item.GUID}
                        onDoubleClick={() => modifyEventClick("edit")}
                      >
                        <ListItemButton
                          selected={selectedEventIndex === index}
                          onClick={() => setSelectedEventIndex(index)}
                        >
                          {item.name}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  {/* BUTTONS */}
                  <Paper sx={{ padding: ".5rem" }}>
                    <div className="left-panel__button-layout">
                      <Tooltip title="Add New Event">
                        <IconButton onClick={() => modifyEventClick("add")}>
                          <AddIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Selected Event">
                        <IconButton onClick={() => modifyEventClick("edit")}>
                          <EditIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Selected Event">
                        <IconButton onClick={() => modifyEventClick("remove")}>
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Duplicate Event">
                        <IconButton
                          onClick={() => modifyEventClick("duplicate")}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Move Event Up">
                        <IconButton onClick={() => modifyEventClick("up")}>
                          <KeyboardArrowUpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Move Event Down">
                        <IconButton onClick={() => modifyEventClick("down")}>
                          <KeyboardArrowDownIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Paper>
                </div>
              </AccordionDetails>
            </Accordion>
            {/* </Paper> */}
          </div>
        </div>
      </Paper>
      <NewTriggerDialog />
      <NewEventDialog />
      <TriggerValidator dataChanged={dataChanged} />
    </div>
  );
});

export default LeftPanel;
LeftPanel.displayName = "LeftPanel";
