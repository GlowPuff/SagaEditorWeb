import { useState, useRef, useReducer } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//components
import EventSelectAdd from "../SubComponents/EventSelectAdd";
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";
//data
import { ButtonAction } from "../../data/Mission";
import { useEventsStore, useTriggerStore } from "../../data/dataStore.js";
import { emptyGUID } from "../../lib/core";

export default function EditEntityProperties() {
  const missionTriggers = useTriggerStore((state) => state.missionTriggers);
  const missionEvents = useEventsStore((state) => state.missionEvents);
  const [, setSelectedTrigger] = useState([
    missionTriggers.find((x) => x.GUID === emptyGUID),
  ]);
  const [, setSelectedEvent] = useState(
    missionEvents.find((x) => x.GUID === emptyGUID)
  );
  const [warning, setWarning] = useState(false);

  const [open, setOpen] = useState(false);
  const callbackFunc = useRef(null);

  const [entityProp, setEntityProp] = useState();
  const [refresh, forceUpdate] = useReducer((x) => x + 1, 0);

  function setValue(name, value) {
    setEntityProp({ ...entityProp, [name]: value });
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(ea, showWarning, callback) {
    // console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEntityProp(ea);
    setWarning(showWarning);
    setOpen(true);
  }
  EditEntityProperties.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(entityProp);
    setOpen(false);
  }

  function newButtonClick() {
    setValue("buttonActions", [
      ...entityProp.buttonActions,
      new ButtonAction(),
    ]);
  }

  function removeButtonClick(idx) {
    setValue(
      "buttonActions",
      entityProp.buttonActions.filter((item, index) => idx !== index)
    );
    forceUpdate();
  }

  function changeButtonText(index, value) {
    let buttons = [...entityProp.buttonActions];
    buttons[index].buttonText = value;
    setEntityProp({ ...entityProp, buttonList: buttons });
  }

  function onChangeTrigger(index, ev) {
    setSelectedTrigger(ev);
    let buttons = [...entityProp.buttonActions];
    buttons = buttons.map((item, idx) => {
      if (idx === index) {
        item.triggerGUID = ev.GUID;
      }
      return item;
    });
    setEntityProp({ ...entityProp, buttonActions: buttons });
  }

  function onChangeEvent(index, ev) {
    setSelectedEvent(ev);
    let buttons = [...entityProp.buttonActions];
    buttons = buttons.map((item, idx) => {
      if (idx === index) {
        item.eventGUID = ev.GUID;
      }
      return item;
    });
    setEntityProp({ ...entityProp, buttonList: buttons });
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth="md"
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Edit Entity Properties</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem" }}>
              <TextField
                label={"Description"}
                variant="filled"
                name="theText"
                value={entityProp.theText || ""}
                onChange={(e) => setValue(e.target.name, e.target.value)}
                onFocus={(e) => e.target.select()}
                fullWidth
                multiline
                sx={{ marginBottom: "1rem" }}
              />
            </Paper>

            <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
              <AccordionDetails>
                <div className="event-container pt-1">
                  <div>
                    <Button onClick={newButtonClick} variant="contained">
                      add new button
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Paper
              sx={{
                padding: "1rem",
                backgroundColor: "#ff8c00",
                display: warning ? "" : "none",
              }}
            >
              <Typography sx={{ color: "black" }}>
                If you are MODIFYING this Entity after already adding it to a
                &apos;Modify Map Entity&apos; Event Action, keep in mind the
                Event Action will NOT have its copy of this Entity updated with
                the changes made here.
              </Typography>
            </Paper>

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
                {entityProp.buttonActions.map((item, index) => (
                  <div className="button-row" key={index}>
                    <TextField
                      label={"Button Text"}
                      variant="filled"
                      name="buttonText"
                      value={item.buttonText}
                      onKeyUp={onKeyUp}
                      onChange={(e) => changeButtonText(index, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      fullWidth
                    />
                    <TriggerSelectAdd
                      key={refresh}
                      initialGUID={
                        missionTriggers.find((x) => x.GUID === item.triggerGUID)
                          ?.GUID || emptyGUID
                      }
                      onItemChanged={(e) => onChangeTrigger(index, e)}
                    />

                    <EventSelectAdd
                      key={refresh + 1}
                      initialGUID={
                        missionEvents.find((x) => x.GUID === item.eventGUID)
                          ?.GUID || emptyGUID
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
    </>
  );
}
