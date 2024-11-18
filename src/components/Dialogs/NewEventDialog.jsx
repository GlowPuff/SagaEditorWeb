import { useState, useRef } from "react";
//mui
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Switch from "@mui/material/Switch";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//dialogs
import GenericTextDialog from "./GenericTextDialog";
//my components
import TriggeredByTriggers from "../SubComponents/TriggeredByTriggers";
import EventActionList from "../SubComponents/EventActionList";
import AdditionalTriggersList from "../SubComponents/AdditionalTriggersList";

export default function NewEventDialog() {
  const [open, setOpen] = useState(false);
  const [missionEvent, setMissionEvent] = useState();
  const callbackFunc = useRef(null);

  //additional triggers
  function modifyTriggers(triggers) {
    setMissionEvent({ ...missionEvent, additionalTriggers: triggers });
  }

  function modifyEA(command, value) {
    console.log("🚀 ~ modifyEA ~ eventAction:", value);
    console.log("🚀 ~ modifyEA ~ command:", command);
    switch (command) {
      case "add": {
        //value = event action
        let eas = [...missionEvent.eventActions, value];
        setMissionEvent({ ...missionEvent, eventActions: eas });
        break;
      }
      case "edit": {
        let eas = [...missionEvent.eventActions];
        eas = eas.map((item) => {
          if (item.GUID === value.GUID) return value;
          else return item;
        });
        setMissionEvent({ ...missionEvent, eventActions: eas });
        break;
      }
      case "remove": {
        //value = index
        let eas = [...missionEvent.eventActions].filter(
          (x, index) => index !== value
        );
        setMissionEvent({ ...missionEvent, eventActions: eas });
        break;
      }
      case "up": {
        //value = index
        if (value === 0) return;
        let eas = [...missionEvent.eventActions];
        let toMove = eas[value];
        eas[value] = eas[value - 1];
        eas[value - 1] = toMove;
        setMissionEvent({ ...missionEvent, eventActions: eas });
        break;
      }
      case "down": {
        //value = index
        if (value === missionEvent.eventActions.length - 1) return;
        let eas = [...missionEvent.eventActions];
        let toMove = eas[value];
        eas[value] = eas[value + 1];
        eas[value + 1] = toMove;
        setMissionEvent({ ...missionEvent, eventActions: eas });
        break;
      }
    }
  }

  function modifyEvent(name, value) {
    console.log("🚀 ~ modifyEvent ~ value:", value);
    setMissionEvent({ ...missionEvent, [name]: value });
  }

  function editTextClick() {
    GenericTextDialog.ShowDialog(
      "Edit Event Text",
      missionEvent.eventText,
      (value) => {
        modifyEvent("eventText", value);
      }
    );
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(event, callback) {
    callbackFunc.current = callback;
    setMissionEvent(event);
    setOpen(true);
  }
  NewEventDialog.ShowDialog = showDialog;

  function onOK() {
    console.log("🚀 ~ onOK ~ missionEvent:", missionEvent);
    callbackFunc.current(missionEvent);
    setOpen(false);
  }

  return (
    <div>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"lg"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <div className="mission-panel">
              {/* LEFT */}
              <Paper sx={{ padding: ".5rem" }}>
                <div className="mission-panel center-items">
                  <TextField
                    required
                    label={"Event Name"}
                    variant="filled"
                    value={missionEvent.name}
                    onChange={(e) => modifyEvent("name", e.target.value)}
                    onFocus={(e) => e.target.select()}
                    fullWidth
                    onKeyUp={onKeyUp}
                    sx={{ marginBottom: "1rem" }}
                  />
                  <Button
                    variant="contained"
                    onClick={editTextClick}
                    // color={missionEvent.eventText.trim() ? "success" : "error"}
                    sx={{
                      outline: missionEvent.eventText.trim()
                        ? "2px solid lime"
                        : "2px solid red",
                    }}
                  >
                    Edit Event Text...
                  </Button>
                </div>
                <Typography
                  sx={{
                    color: "#ee82e5",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                    display: missionEvent.eventText.trim() === "" ? "" : "none",
                  }}
                >
                  If the Event Text isn&apos;t set, this Event will still fire,
                  but no text will be shown.
                </Typography>

                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Event Actions
                  </AccordionSummary>
                  <AccordionDetails>
                    <EventActionList
                      eventActions={missionEvent.eventActions}
                      modifyEA={modifyEA}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    &apos;Triggered By&apos; Additional Triggers
                  </AccordionSummary>
                  <AccordionDetails>
                    <AdditionalTriggersList
                      additionalTriggers={missionEvent.additionalTriggers}
                      modifyTriggers={modifyTriggers}
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
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Trigger Activation Behavior (includes &apos;Additional
                    Triggers&apos;)
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="two-column-grid center-items right-items">
                      <Typography>Which Triggers fire this Event?</Typography>
                      <div className="two-column-grid center-items left-items">
                        <Switch
                          name="behaviorAll"
                          checked={missionEvent.behaviorAll}
                          onChange={(e) =>
                            modifyEvent(e.target.name, e.target.checked)
                          }
                        />
                        <Typography>
                          {missionEvent.behaviorAll ? "All" : "Any"}
                        </Typography>
                      </div>
                    </div>
                    <div className="two-column-grid center-items mt-p5">
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isRepeatable"
                            checked={missionEvent.isRepeatable}
                            onChange={(e) =>
                              modifyEvent(e.target.name, e.target.checked)
                            }
                          />
                        }
                        label="This Event is Repeatable"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isEndOfCurrentRound"
                            checked={missionEvent.isEndOfCurrentRound}
                            onChange={(e) =>
                              modifyEvent(e.target.name, e.target.checked)
                            }
                          />
                        }
                        label="Fires At End Of Current Round"
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    &apos;Triggered By&apos; General Triggers
                  </AccordionSummary>
                  <AccordionDetails>
                    <TriggeredByTriggers
                      modifyEvent={modifyEvent}
                      missionEvent={missionEvent}
                    />
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </div>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button
              variant="contained"
              onClick={() => onOK()}
              disabled={missionEvent.name.trim() === ""}
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
      )}
      <GenericTextDialog />
    </div>
  );
}
