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

export default function ModifyCreditsDialog() {
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
  ModifyCreditsDialog.ShowDialog = showDialog;

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
          <DialogTitle>Modify Credits Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: "1rem", marginBottom: ".5rem" }}>
              <Typography sx={{ color: "#ee82e5" }}>
                Campaign Credits are modified and saved into the Campaign state
                as soon as this Event Action is fired. It&apos;s recommended to
                use this Event Action after a Mission has ended.
              </Typography>
            </Paper>

            <Paper sx={{ padding: ".5rem" }}>
              <div className="two-column-grid center-items justify-items-center">
                <TextField
                  type="number"
                  name="creditsToModify"
                  label={"Amount of Credits to modify"}
                  variant="filled"
                  value={eventAction.creditsToModify}
                  onChange={(e) => setEAValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                />

                <Typography>
                  Positive values add Credits, negative values remove Credits.
                </Typography>
              </div>

              <FormControlLabel
                control={
                  <Checkbox
                    name="multiplyByHeroCount"
                    checked={eventAction.multiplyByHeroCount}
                    onChange={(e) =>
                      setEAValue(e.target.name, e.target.checked)
                    }
                  />
                }
                label="Multiply By Number of Heroes"
              />
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
