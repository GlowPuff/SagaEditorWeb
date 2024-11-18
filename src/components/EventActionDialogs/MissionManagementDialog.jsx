import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

export default function MissionManagementDialog() {
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
  MissionManagementDialog.ShowDialog = showDialog;

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
          maxWidth={"sm"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Mission Management Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                NOTICE: Ending the Mission will halt execution of all subsequent
                Event Actions in this Event, as well as any Events fired after
                this one. It&apos;s recommended to make &apos;End Mission&apos;
                the LAST Event Action in this Event&apos;s list.
              </Typography>
            </Paper>

            <Paper sx={{ padding: ".5rem" }}>
              <div className="two-column-grid">
                {/* ======== */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="incRoundCounter"
                      checked={eventAction.incRoundCounter}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.checked)
                      }
                    />
                  }
                  label="Increase Round Counter By 1"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="pauseThreat"
                      checked={eventAction.pauseThreat}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.checked)
                      }
                    />
                  }
                  label="Pause Threat Increase"
                />
                {/* ======== */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="pauseDeployment"
                      checked={eventAction.pauseDeployment}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.checked)
                      }
                    />
                  }
                  label="Pause Deployment"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="unpauseThreat"
                      checked={eventAction.unpauseThreat}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.checked)
                      }
                    />
                  }
                  label="UnPause Threat Increase"
                />
                {/* ======== */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="unpauseDeployment"
                      checked={eventAction.unpauseDeployment}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.checked)
                      }
                    />
                  }
                  label="UnPause Deployment"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="endMission"
                      checked={eventAction.endMission}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.checked)
                      }
                    />
                  }
                  label="End Mission"
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
