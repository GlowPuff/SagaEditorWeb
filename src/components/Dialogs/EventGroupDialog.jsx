import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//my components
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";
import EventSelectAdd from "../SubComponents/EventSelectAdd";
//data
import { emptyGUID } from "../../lib/core";
import { useEventsStore } from "../../data/dataStore";

export default function EventGroupDialog() {
  const missionEvents = useEventsStore((state) => state.missionEvents);

  const [open, setOpen] = useState(false);
  const [eventGroup, setEventGroup] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(missionEvents[0]);
  const [name, setName] = useState("");
  const [groupEvents, setGroupEvents] = useState([]); //array of {name:"foo",GUID:"00000"}
  const callbackFunc = useRef(null);

  function onModifyGroup(name, value) {
    setEventGroup({ ...eventGroup, [name]: value });
  }

  function onAddEvent() {
    if (selectedEvent.GUID !== emptyGUID) {
      setGroupEvents([
        ...groupEvents,
        { name: selectedEvent.name, GUID: selectedEvent.GUID },
      ]);
      onModifyGroup("missionEvents", [
        ...eventGroup.missionEvents,
        selectedEvent.GUID,
      ]);
    }
  }

  function onRemoveEvent(index) {
    setGroupEvents(groupEvents.filter((x, idx) => index != idx));

    onModifyGroup(
      "missionEvents",
      eventGroup.missionEvents.filter((x, idx) => index != idx)
    );
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(eGroup, callback) {
    callbackFunc.current = callback;
    setEventGroup(eGroup);
    setSelectedEvent(missionEvents[0]);
    setName(eGroup.name);
    setGroupEvents(
      eGroup.missionEvents.map((item) => ({
        name: missionEvents.find((x) => x.GUID === item).name,
        GUID: item,
      }))
    );
    setOpen(true);
  }
  EventGroupDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventGroup);
    setOpen(false);
  }

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      maxWidth={"md"}
      fullWidth={true}
      scroll={"paper"}
    >
      <DialogTitle>Event Group Editor</DialogTitle>
      <DialogContent>
        <div className="mission-panel">
          {/* LEFT */}
          <Paper sx={{ padding: ".5rem" }}>
            {/* general props */}
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">Group Name</AccordionSummary>
              <AccordionDetails>
                <TextField
                  label={"Group Name"}
                  name={"name"}
                  value={name}
                  variant="filled"
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => onModifyGroup("name", name)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                />
                <div className="two-column-grid">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="repeateable"
                        checked={eventGroup.repeateable}
                        onChange={(e) =>
                          onModifyGroup(e.target.name, e.target.checked)
                        }
                      />
                    }
                    label="Reset Upon Completion"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isUnique"
                        checked={eventGroup.isUnique}
                        onChange={(e) =>
                          onModifyGroup(e.target.name, e.target.checked)
                        }
                      />
                    }
                    label="Each Event is Unique"
                  />
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">
                Mission Events
              </AccordionSummary>
              <AccordionDetails>
                <EventSelectAdd
                  initialGUID={selectedEvent.GUID}
                  onItemChanged={(e) => setSelectedEvent(e)}
                />
                <Button
                  sx={{ marginTop: ".5rem" }}
                  variant="contained"
                  onClick={onAddEvent}
                  disabled={selectedEvent === missionEvents[0]}
                >
                  add event to group
                </Button>
              </AccordionDetails>
            </Accordion>

            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">
                Triggered By (Optional)
              </AccordionSummary>
              <AccordionDetails>
                <TriggerSelectAdd
                  initialGUID={eventGroup.triggerGUID}
                  onItemChanged={(e) => onModifyGroup("triggerGUID", e.GUID)}
                />
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* RIGHT */}
          <Paper sx={{ padding: ".5rem" }}>
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">
                Events In This Group
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {groupEvents.map((item, index) => (
                    <ListItem
                      disablePadding
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => onRemoveEvent(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemButton>{item.name}</ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </div>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
        <Button
          variant="contained"
          onClick={() => onOK()}
          disabled={eventGroup.name?.trim() === ""}
        >
          continue
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          color="error"
        >
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
