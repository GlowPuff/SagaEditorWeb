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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//components
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";
import { emptyTrigger, TriggerModifier } from "../../data/Mission";

export default function ModifyVariableDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const [selectedTrigger, setSelectedTrigger] = useState(emptyTrigger);
  const callbackFunc = useRef(null);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function modifyTriggerList(command, { name, index, value }) {
    if (command === "add") {
      let trigMod = new TriggerModifier();
      trigMod.triggerName = selectedTrigger.name;
      trigMod.triggerGUID = selectedTrigger.GUID;
      setEAValue("triggerList", [...eventAction.triggerList, trigMod]);
    } else if (command === "remove") {
      setEAValue(
        "triggerList",
        eventAction.triggerList.filter(
          (x) => x.triggerGUID !== value.triggerGUID
        )
      );
    } else if (command === "edit") {
      let tlist = [...eventAction.triggerList];
      tlist = tlist.map((item, idx) => {
        if (idx === index) return { ...item, [name]: value };
        return item;
      });
      setEAValue("triggerList", tlist);
    }
  }

  function showDialog(ea, callback) {
    callbackFunc.current = callback;
    setEventAction(ea);
    setSelectedTrigger(emptyTrigger);
    setOpen(true);
  }
  ModifyVariableDialog.ShowDialog = showDialog;

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
          <DialogTitle>Modify Variables Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
              <TriggerSelectAdd onItemChanged={setSelectedTrigger} />
              <Button
                onClick={() => modifyTriggerList("add", {})}
                disabled={selectedTrigger === emptyTrigger}
                sx={{ marginTop: ".5rem" }}
                variant="contained"
              >
                add this trigger to the list
              </Button>

              <Typography sx={{ margin: ".5rem 0 .5rem 0", color: "#ee82e5" }}>
                To Set a value <b>absolutely</b>, enter a number greater than
                -1. Otherwise, the Trigger Variable will be <b>modified</b> by
                the +/- value, instead.
              </Typography>
            </Paper>

            <Paper
              sx={{
                padding: ".5rem",
                display: eventAction.triggerList.length ? "inherit" : "none",
              }}
            >
              <div className="mission-panel align-center">
                <Typography>Trigger Name</Typography>
                <div className="mod-var-grid">
                  <Typography className="center">Set</Typography>
                  <Typography className="center">+ / -</Typography>
                  <Typography>
                    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                  </Typography>
                </div>
              </div>

              {eventAction.triggerList.map((item, index) => (
                <div key={index} className="mission-panel align-center">
                  <Typography key={index}>{item.triggerName}</Typography>
                  <div className="mod-var-grid">
                    <TextField
                      name="setValue"
                      type="number"
                      value={item.setValue}
                      onChange={(ev) =>
                        modifyTriggerList("edit", {
                          name: ev.target.name,
                          index: index,
                          value: ev.target.value,
                        })
                      }
                    />
                    <TextField
                      name="modifyValue"
                      type="number"
                      value={item.modifyValue}
                      onChange={(ev) =>
                        modifyTriggerList("edit", {
                          name: ev.target.name,
                          index: index,
                          value: ev.target.value,
                        })
                      }
                    />
                    <Tooltip title="Remove Trigger">
                      <IconButton
                        onClick={() =>
                          modifyTriggerList("remove", { value: item })
                        }
                      >
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
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
