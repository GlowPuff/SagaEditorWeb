import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//data
import { ThreatModifierType } from "../../lib/core";

export default function ModifyThreatDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    callbackFunc.current = callback;
    setEventAction(ea);
    setOpen(true);
  }
  ModifyThreatDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"sm"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Modify Threat Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                To add a value to the Mission&apos;s current Threat, enter a
                positive number, otherwise use a negative number to subtract
                from the current Threat in the Mission.
              </Typography>
              <div className="mission-panel align-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        eventAction.threatModifierType ===
                        ThreatModifierType.Fixed
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          setEAValue(
                            "threatModifierType",
                            ThreatModifierType.Fixed
                          );
                      }}
                    />
                  }
                  label="Modified By"
                  sx={{ display: "block" }}
                />
                <TextField
                  disabled={
                    eventAction.threatModifierType !== ThreatModifierType.Fixed
                  }
                  type="number"
                  name="fixedValue"
                  label={"Fixed Value Modifier"}
                  variant="filled"
                  value={eventAction.fixedValue}
                  onChange={(e) => setEAValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                />
              </div>
              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                Multiply the provided number by the Mission&apos;s Threat Level
                and add it to the current Threat. Use a negative number to
                subtract the amount instead.
              </Typography>
              <div className="mission-panel align-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        eventAction.threatModifierType ===
                        ThreatModifierType.Multiple
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          setEAValue(
                            "threatModifierType",
                            ThreatModifierType.Multiple
                          );
                      }}
                    />
                  }
                  label="Threat Level Multiplier"
                  sx={{ display: "block" }}
                />
                <TextField
                  disabled={
                    eventAction.threatModifierType !==
                    ThreatModifierType.Multiple
                  }
                  type="number"
                  name="threatValue"
                  label={"Multiply By Threat Level"}
                  variant="filled"
                  value={eventAction.threatValue}
                  onChange={(e) => setEAValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                />
              </div>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
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
