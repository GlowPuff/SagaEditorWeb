import { useState, useRef, useReducer } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//components
import Formatting from "../SubComponents/Formatting";
import QuickAddDialog from "../Dialogs/QuickAddDialog.jsx";
import EventSelectAdd from "../SubComponents/EventSelectAdd.jsx";
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd.jsx";
//data
import { ButtonAction } from "../../data/Mission";
import { emptyGUID } from "../../lib/core";
import { useEventsStore, useTriggerStore } from "../../data/dataStore.js";

export default function QuestionPromptDialog() {
  const missionTriggers = useTriggerStore((state) => state.missionTriggers);
  const missionEvents = useEventsStore((state) => state.missionEvents);

  const [refresh, forceUpdate] = useReducer((x) => x + 1, 0);
  const [, setSelectedTrigger] = useState([
    missionTriggers.find((x) => x.GUID === emptyGUID),
  ]);
  const [, setSelectedEvent] = useState(
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
    setEventAction({ ...eventAction, [name]: value });
  }

  function newButtonClick() {
    setEAValue("buttonList", [...eventAction.buttonList, new ButtonAction()]);
  }

  function changeButtonText(index, value) {
    let buttons = [...eventAction.buttonList];
    buttons[index].buttonText = value;
    setEventAction({ ...eventAction, buttonList: buttons });
  }

  function onChangeTrigger(index, ev) {
    setSelectedTrigger(ev);
    let buttons = [...eventAction.buttonList];
    buttons = buttons.map((item, idx) => {
      if (idx === index) {
        item.triggerGUID = ev.GUID;
      }
      return item;
    });
    setEventAction({ ...eventAction, buttonList: buttons });
  }

  function onChangeEvent(index, ev) {
    setSelectedEvent(ev);
    let buttons = [...eventAction.buttonList];
    buttons = buttons.map((item, idx) => {
      if (idx === index) {
        item.eventGUID = ev.GUID;
      }
      return item;
    });
    setEventAction({ ...eventAction, buttonList: buttons });
  }

  function removeButtonClick(idx) {
    setEAValue(
      "buttonList",
      eventAction.buttonList.filter((item, index) => idx !== index)
    );
    forceUpdate();
  }

  function showDialog(ea, callback) {
    console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setOpen(true);
  }
  QuestionPromptDialog.ShowDialog = showDialog;

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
          maxWidth={fPanelOpen ? "lg" : "md"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Question Prompt Event Action</DialogTitle>
          <DialogContent>
            <div
              className={fPanelOpen ? "mission-panel" : ""}
              style={{ marginBottom: ".5rem" }}
            >
              {/* LEFT */}
              <Paper sx={{ padding: ".5rem" }}>
                <TextField
                  label={"Text"}
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

            <Paper sx={{ padding: ".5rem" }}>
              <FormControlLabel
                sx={{ marginRight: "auto" }}
                control={
                  <Checkbox
                    checked={eventAction.includeCancel}
                    name="includeCancel"
                    onChange={(e) =>
                      setEAValue(e.target.name, e.target.checked)
                    }
                  />
                }
                label="Include Cancel Button"
              />
              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionDetails>
                  <div className="event-container pt-1">
                    <div>
                      <Button onClick={newButtonClick} variant="contained">
                        add new button
                      </Button>
                    </div>
                    {/* <div className="event-container pt-1">
                      <div>
                        <Button onClick={newTriggerClick} variant="contained">
                          create new trigger...
                        </Button>
                      </div>
                      <div>
                        <Button onClick={newEventClick} variant="contained">
                          create new event...
                        </Button>
                      </div>
                    </div> */}
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                defaultExpanded
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionDetails>
                  <div className="button-row">
                    <Typography>Button Text</Typography>
                    <Typography>When Clicked, Fire Trigger:</Typography>
                    <Typography>When Clicked, Fire Event:</Typography>
                    <Typography></Typography>
                  </div>
                  <hr />
                  {eventAction.buttonList.map((item, index) => (
                    <div className="button-row" key={index}>
                      <TextField
                        label={"Button Text"}
                        variant="filled"
                        name="buttonText"
                        value={item.buttonText}
                        onKeyUp={onKeyUp}
                        onChange={(e) =>
                          changeButtonText(index, e.target.value)
                        }
                        onFocus={(e) => e.target.select()}
                        fullWidth
                      />
                      <TriggerSelectAdd
                        key={refresh}
                        initialGUID={
                          missionTriggers.find(
                            (x) => x.GUID === item.triggerGUID
                          ).GUID
                        }
                        onItemChanged={(e) => onChangeTrigger(index, e)}
                      />

                      <EventSelectAdd
                        key={refresh + 1}
                        initialGUID={
                          missionEvents.find((x) => x.GUID === item.eventGUID)
                            .GUID
                        }
                        onItemChanged={(e) => onChangeEvent(index, e)}
                      />
                      <Tooltip title="Remove Button">
                        <IconButton
                          onClick={() => removeButtonClick(index)}
                          sx={{ width: "32px", height: "32px" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))}
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
      <QuickAddDialog />
    </>
  );
}
