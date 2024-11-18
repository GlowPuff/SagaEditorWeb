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

export default function GenericTextDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [fPanelOpen, setFPanelOpen] = useState(false);
  const callbackFunc = useRef(null);

  function showDialog(dialogTitle, textValue, callback) {
    callbackFunc.current = callback;
    setText(textValue);
    setTitle(dialogTitle);
    setFPanelOpen(false);
    setOpen(true);
  }
  GenericTextDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(text ? text.trim() : "");
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
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <div className={fPanelOpen ? "mission-panel" : ""}>
              {/* LEFT */}
              <Paper sx={{ padding: ".5rem" }}>
                <TextField
                  label={"Text"}
                  variant="filled"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  fullWidth
                  multiline
                  sx={{ marginBottom: "1rem" }}
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
