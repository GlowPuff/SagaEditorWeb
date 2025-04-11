import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//components
import Formatting from "../SubComponents/Formatting";
import EventSelectAdd from "../SubComponents/EventSelectAdd.jsx";
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd.jsx";
//dialogs
import GenericTextDialog from "../Dialogs/GenericTextDialog.jsx";
import EditInputPromptDialog from "./EditInputPromptDialog.jsx";
//data
import { InputRange } from "../../data/Mission";
import { emptyGUID } from "../../lib/core";
import { useEventsStore, useTriggerStore } from "../../data/dataStore.js";

export default function InputPromptDialog() {
  const missionTriggers = useTriggerStore((state) => state.missionTriggers);
  const missionEvents = useEventsStore((state) => state.missionEvents);

  // eslint-disable-next-line no-unused-vars
  const [selectedTrigger, setSelectedTrigger] = useState([
    missionTriggers.find((x) => x.GUID === emptyGUID),
  ]);
  // eslint-disable-next-line no-unused-vars
  const [selectedEvent, setSelectedEvent] = useState(
    missionEvents.find((x) => x.GUID === emptyGUID)
  );
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const [fPanelOpen, setFPanelOpen] = useState(false);
  const callbackFunc = useRef(null);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function setEAValue(name, value) {
    // console.log("🚀 ~ setEAValue ~ name, value:", name, value);
    setEventAction({ ...eventAction, [name]: value });
  }

  function editInputClick(index) {
    EditInputPromptDialog.ShowDialog(
      eventAction.inputList[index],
      (inputRange) => {
        let inputs = [...eventAction.inputList];
        inputs[index] = inputRange;
        setEAValue("inputList", inputs);
      }
    );
  }

  function modifyRange(index, name, value) {
    let inputs = [...eventAction.inputList];
    inputs[index][name] = value;
    setEAValue("inputList", inputs);
  }

  function newButtonClick() {
    setEAValue("inputList", [...eventAction.inputList, new InputRange()]);
  }

  function removeButtonClick(idx) {
    setEAValue(
      "inputList",
      eventAction.inputList.filter((item, index) => idx !== index)
    );
  }
  function editTextClick() {
    GenericTextDialog.ShowDialog(
      "Edit Failure Text",
      eventAction.failText,
      (value) => setEAValue("failText", value)
    );
  }

  function showDialog(ea, callback) {
    // console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setOpen(true);
  }
  InputPromptDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={fPanelOpen ? "lg" : "sm"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Input Prompt Event Action</DialogTitle>
          <DialogContent>
            <div
              className={fPanelOpen ? "mission-panel" : ""}
              style={{ marginBottom: ".5rem" }}
            >
              {/* LEFT */}
              <Paper sx={{ padding: ".5rem" }}>
                <TextField
                  label={"Description"}
                  variant="filled"
                  name="theText"
                  value={eventAction.theText}
                  onChange={(e) => setEAValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  fullWidth
                  multiline
                  sx={{ marginBottom: "1rem" }}
                />

                <Button
                  variant="contained"
                  sx={{ marginRight: "auto" }}
                  color={fPanelOpen ? "success" : "primary"}
                  onClick={() => setFPanelOpen(!fPanelOpen)}
                >
                  text formatting
                </Button>
              </Paper>

              {/* RIGHT */}
              <Formatting isOpen={fPanelOpen} />
            </div>

            <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionDetails>
                  <div className=" pt-1">
                    <Button onClick={newButtonClick} variant="contained">
                      add new input range
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                Values are inclusive, and using -1 for the To value will set the
                upper range to Infinity when testing a player&apos;s input.
              </Typography>

              <Accordion
                defaultExpanded
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionDetails>
                  <Typography>Input Ranges</Typography>
                  <hr />
                  {eventAction.inputList.map((item, index) => (
                    <div key={index} className="event-container mb-25">
                      <div className="from-to-row">
                        <TextField
                          onKeyUp={onKeyUp}
                          type="number"
                          label={"From"}
                          variant="filled"
                          name="fromValue"
                          value={eventAction.inputList[index].fromValue}
                          onChange={(e) =>
                            modifyRange(index, e.target.name, e.target.value)
                          }
                          onFocus={(e) => e.target.select()}
                          fullWidth
                        />
                        <Typography>To</Typography>
                        <TextField
                          onKeyUp={onKeyUp}
                          type="number"
                          label={"To"}
                          variant="filled"
                          name="toValue"
                          value={eventAction.inputList[index].toValue}
                          onChange={(e) =>
                            modifyRange(index, e.target.name, e.target.value)
                          }
                          onFocus={(e) => e.target.select()}
                          fullWidth
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginLeft: "auto",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Button
                            onClick={() => editInputClick(index)}
                            variant="contained"
                          >
                            edit input...
                          </Button>
                          <Tooltip title="Remove Input Range">
                            <IconButton
                              onClick={() => removeButtonClick(index)}
                            >
                              <DeleteIcon fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Paper>

            <Paper sx={{ padding: ".5rem" }}>
              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionSummary>Default Handler</AccordionSummary>
                <AccordionDetails>
                  <div className="two-column-grid">
                    <div>
                      <Button
                        sx={{
                          outline: eventAction.failText.trim()
                            ? "2px solid lime"
                            : "2px solid red",
                        }}
                        onClick={editTextClick}
                        variant="contained"
                      >
                        edit default text...
                      </Button>
                    </div>
                    <Typography
                      sx={{
                        color: "#ee82e5",
                      }}
                    >
                      When an unhandled value is entered...
                    </Typography>
                  </div>
                  <hr />
                  <div className="mission-panel mt-p5">
                    <Typography>Fire This Trigger...</Typography>
                    <Typography>Fire This Event...</Typography>
                  </div>
                  <div className="mission-panel">
                    <TriggerSelectAdd
                      initialGUID={eventAction.failTriggerGUID}
                      onItemChanged={(item) =>
                        setEAValue("failTriggerGUID", item.GUID)
                      }
                    />
                    <EventSelectAdd
                      initialGUID={eventAction.failEventGUID}
                      onItemChanged={(item) =>
                        setEAValue("failEventGUID", item.GUID)
                      }
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </DialogContent>
          <DialogActions
            sx={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "1rem",
            }}
          >
            <Button variant="contained" onClick={() => onOK()}>
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
      <EditInputPromptDialog />
    </>
  );
}
