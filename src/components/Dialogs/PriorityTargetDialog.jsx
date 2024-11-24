import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//data
import { PriorityTraits } from "../../lib/core";

export default function PriorityTargetDialog() {
  const [open, setOpen] = useState(false);
  const [traits, setTraits] = useState({});
  const callbackFunc = useRef(null);
  const hideUseDefault = useRef(false);

  function modifyTraits(name, checked) {
    setTraits({ ...traits, [name]: checked });
  }

  function showDialog(groupTraits, callback, hideUseDef = false) {
    callbackFunc.current = callback;
    hideUseDefault.current = hideUseDef;
    setTraits(groupTraits);
    setOpen(true);
  }
  PriorityTargetDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(traits);
    setOpen(false);
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"md"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Change Priority Target Traits</DialogTitle>
          <DialogContent>
            <Paper
              sx={{
                backgroundColor: "#201531",
                padding: "1rem",
                marginBottom: ".5rem",
              }}
            >
              <Typography>
                Priority Target Traits affect which types of Rebel traits this
                group will prefer first when attacking.
              </Typography>
            </Paper>
            {!hideUseDefault.current && (
              <Paper
                sx={{
                  backgroundColor: "#201531",
                  padding: "1rem",
                  marginBottom: ".5rem",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      radioGroup="useDefault"
                      checked={traits && traits.useDefaultPriority}
                      onChange={(e) => {
                        modifyTraits("useDefaultPriority", e.target.checked);
                      }}
                    />
                  }
                  label="Use Group Default"
                />
              </Paper>
            )}
            <Paper
              sx={{
                backgroundColor: "#201531",
                padding: "1rem",
                marginBottom: ".5rem",
              }}
            >
              <div
                className="quad-column-grid"
                style={{
                  opacity: traits && traits.useDefaultPriority ? ".5" : "1",
                  pointerEvents:
                    traits && traits.useDefaultPriority ? "none" : "",
                }}
              >
                {PriorityTraits.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        radioGroup="useDefault"
                        checked={traits && traits[item.propName]}
                        onChange={(e) => {
                          modifyTraits(item.propName, e.target.checked);
                        }}
                      />
                    }
                    label={item.name}
                  />
                ))}
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
