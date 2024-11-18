import { useState, useRef } from "react";
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
import Typography from "@mui/material/Typography";

//components
import EventSelectAdd from "../SubComponents/EventSelectAdd";
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";

export default function EditInputPromptDialog() {
  const [open, setOpen] = useState(false);
  const [inputRange, setInputRange] = useState();
  const callbackFunc = useRef(null);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(ir, callback) {
    callbackFunc.current = callback;
    setInputRange(ir);
    setOpen(true);
  }
  EditInputPromptDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(inputRange);
    setOpen(false);
  }

  function editIR(name, value) {
    setInputRange({ ...inputRange, [name]: value });
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
          <DialogTitle>Edit Input Prompt</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem" }}>
              <TextField
                label={"Description"}
                name="theText"
                variant="filled"
                value={inputRange.theText}
                onChange={(e) => editIR(e.target.name, e.target.value)}
                onFocus={(e) => e.target.select()}
                fullWidth
                multiline
              />

              <Accordion
                defaultExpanded
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionDetails>
                  <div className="label-text">
                    <Typography>Input Range:</Typography>
                    <div
                      className="triple-column-grid align-center"
                      style={{ textAlign: "center" }}
                    >
                      <TextField
                        type="number"
                        onKeyUp={onKeyUp}
                        label={"From"}
                        name="fromValue"
                        variant="filled"
                        value={inputRange.fromValue}
                        onChange={(e) => editIR(e.target.name, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        fullWidth
                      />
                      <Typography>To</Typography>
                      <TextField
                        type="number"
                        onKeyUp={onKeyUp}
                        label={"To"}
                        name="toValue"
                        variant="filled"
                        value={inputRange.toValue}
                        onChange={(e) => editIR(e.target.name, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        fullWidth
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionDetails>
                  <div className="mission-panel mt-p5">
                    <Typography>Fire This Trigger...</Typography>
                    <Typography>Fire This Event...</Typography>
                  </div>
                  <div className="mission-panel">
                    <TriggerSelectAdd
                      initialGUID={inputRange.triggerGUID}
                      onItemChanged={(item) => editIR("triggerGUID", item.GUID)}
                    />
                    <EventSelectAdd
                      initialGUID={inputRange.eventGUID}
                      onItemChanged={(item) => editIR("eventGUID", item.GUID)}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </Paper>
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
