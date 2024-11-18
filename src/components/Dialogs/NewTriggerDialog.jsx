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
//my components
import EventSelectAdd from "../SubComponents/EventSelectAdd";

export default function NewTriggerDialog() {
  const [open, setOpen] = useState(false);
  const [missionTrigger, setMissionTrigger] = useState();
  const callbackFunc = useRef(null);

  function modifyTrigger(name, value) {
    setMissionTrigger({ ...missionTrigger, [name]: value });
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(trigger, callback) {
    callbackFunc.current = callback;
    setMissionTrigger(trigger);
    setOpen(true);
  }
  NewTriggerDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(missionTrigger);
    setOpen(false);
  }

  return (
    <div>
      {missionTrigger && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"sm"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Add New Trigger Variable</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
              <TextField
                required
                label={"Trigger Name"}
                variant="filled"
                value={missionTrigger.name}
                onChange={(e) => modifyTrigger("name", e.target.value)}
                onFocus={(e) => e.target.select()}
                fullWidth
                onKeyUp={onKeyUp}
                sx={{ marginBottom: ".5rem" }}
              />
            </Paper>

            <Paper sx={{ padding: ".5rem" }}>
              <div className="two-column-grid center-items">
                <TextField
                  label={"Initial Value"}
                  variant="filled"
                  type="number"
                  value={missionTrigger.initialValue}
                  onChange={(e) =>
                    modifyTrigger(
                      "initialValue",
                      Number.parseInt(e.target.value)
                    )
                  }
                  onFocus={(e) => e.target.select()}
                  fullWidth
                  onKeyUp={onKeyUp}
                  sx={{ marginBottom: "1rem" }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={missionTrigger.useReset}
                      onChange={(e) => {
                        modifyTrigger("useReset", e.target.checked);
                      }}
                    />
                  }
                  label="Reset to 0 Upon Triggering"
                  sx={{ display: "block" }}
                />

                <TextField
                  label={"Maximum Value"}
                  type="number"
                  variant="filled"
                  value={missionTrigger.maxValue}
                  onChange={(e) =>
                    modifyTrigger("maxValue", Number.parseInt(e.target.value))
                  }
                  onFocus={(e) => e.target.select()}
                  fullWidth
                  onKeyUp={onKeyUp}
                  sx={{ marginBottom: "1rem" }}
                />
                <Typography sx={{ color: "#ee82e5" }}>
                  -1 = No Maximum
                </Typography>
              </div>

              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionSummary id="panel1-header">
                  Fire Event Upon Triggering
                </AccordionSummary>
                <AccordionDetails>
                  <EventSelectAdd
                    initialGUID={missionTrigger.eventGUID}
                    onItemChanged={(ev) => modifyTrigger("eventGUID", ev.GUID)}
                  />
                </AccordionDetails>
              </Accordion>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button
              variant="contained"
              onClick={() => onOK()}
              disabled={missionTrigger.name.trim() === ""}
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
    </div>
  );
}
