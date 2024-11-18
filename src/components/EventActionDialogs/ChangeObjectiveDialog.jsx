import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
//components
import Formatting from "../SubComponents/Formatting";

export default function ChangeObjectiveDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const [fPanelOpen, setFPanelOpen] = useState(false);
  const callbackFunc = useRef(null);

  function showDialog(ea, callback) {
    console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setFPanelOpen(false);
    setOpen(true);
  }
  ChangeObjectiveDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
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
          maxWidth={fPanelOpen ? "lg" : "sm"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Change Objective Event Action</DialogTitle>
          <DialogContent>
            <div className={fPanelOpen ? "mission-panel" : ""}>
              {/* LEFT */}
              <Paper sx={{ padding: ".5rem" }}>
                <TextField
                  required
                  name="theText"
                  label={"Short Objective Bar Text - REQUIRED"}
                  variant="filled"
                  value={eventAction.theText}
                  onChange={(e) => setEAValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  name="longText"
                  label={"Long Description of Objective - OPTIONAL"}
                  variant="filled"
                  value={eventAction.longText}
                  onChange={(e) => setEAValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  fullWidth
                  multiline
                />
              </Paper>

              {/* RIGHT */}
              <Formatting isOpen={fPanelOpen} />
            </div>
          </DialogContent>
          <DialogActions
            sx={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "1rem",
            }}
          >
            <Button
              variant="contained"
              sx={{ marginRight: "auto" }}
              color={fPanelOpen ? "success" : "primary"}
              onClick={() => setFPanelOpen(!fPanelOpen)}
            >
              text formatting
            </Button>

            <Button
              variant="contained"
              onClick={() => onOK()}
              disabled={eventAction.theText === ""}
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
    </>
  );
}
