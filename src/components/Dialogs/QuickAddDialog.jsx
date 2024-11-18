import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

export default function QuickAddDialog() {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [title, setTitle] = useState("");
  const [inputName, setInputName] = useState("");
  const callbackFunc = useRef(null);

  function showEventDialog(callback) {
    setTitle("Add Mission Event");
    callbackFunc.current = callback;
    setItemName("");
    setInputName("Event Name");
    setOpen(true);
  }
  QuickAddDialog.ShowEventDialog = showEventDialog;

  function showTriggerDialog(callback) {
    setTitle("Add Mission Trigger");
    callbackFunc.current = callback;
    setItemName("");
    setInputName("Trigger Name");
    setOpen(true);
  }
  QuickAddDialog.ShowTriggerDialog = showTriggerDialog;

  function onKeyUp(ev) {
    if ((ev.key === "Enter" || ev.keyCode === 13) && itemName) onOK();
  }

  function onOK() {
    callbackFunc.current(itemName);
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
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <TextField
              label={inputName}
              variant="filled"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onFocus={(e) => e.target.select()}
              fullWidth
              sx={{ marginBottom: "1rem" }}
              onKeyUp={onKeyUp}
            />
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button
              variant="contained"
              disabled={itemName ? false : true}
              onClick={() => onOK()}
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
