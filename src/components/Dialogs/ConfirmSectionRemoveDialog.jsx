import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function ConfirmSectionRemoveDialog() {
  const [open, setOpen] = useState(false);
  const [sectionName, setSectionName] = useState();
  const [checked, setChecked] = useState(false);
  const callbackFunc = useRef(null);

  function showDialog(name, callback) {
    callbackFunc.current = callback;
    setSectionName(name);
    setChecked(false);
    setOpen(true);
  }
  ConfirmSectionRemoveDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(checked);
    setOpen(false);
  }

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      maxWidth={"sm"}
      fullWidth={true}
      scroll={"paper"}
    >
      <DialogTitle>Confirm Map Section Removal</DialogTitle>
      <DialogContent>
        <Typography>Remove the following Map Section?</Typography>
        <Typography color="error">{sectionName}</Typography>
        <hr />
        <FormControlLabel
          control={
            <Checkbox
              name="factionImperial"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          }
          label="Also remove Tiles and Entities this Map Section Owns"
        />
      </DialogContent>
      <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
        <Button variant="contained" onClick={() => onOK()} color="error">
          remove
        </Button>
        <Button variant="contained" onClick={() => setOpen(false)}>
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
