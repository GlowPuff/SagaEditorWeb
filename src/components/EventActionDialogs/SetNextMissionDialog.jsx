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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
//data
import { missionData } from "../../data/carddata";

export default function SetNextMissionDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [selectedMission, setSelectedMission] = useState("core1");

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    callbackFunc.current = callback;
    setEventAction(ea);
    setSelectedMission(missionData.find((item) => item.id === ea.missionID));
    setOpen(true);
  }
  SetNextMissionDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function changeMission(value) {
    setEAValue("missionID", value.id);
    setSelectedMission(value);
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
          <DialogTitle>Set Next Story Mission Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: "1rem" }}>
              <Select
                value={selectedMission}
                onChange={(e) => changeMission(e.target.value)}
                displayEmpty
              >
                {missionData.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item.id !== "Custom"
                      ? "(" + item.id.toUpperCase() + ") "
                      : "Custom"}
                    {item.name}
                  </MenuItem>
                ))}
              </Select>

              <Typography sx={{ color: "#ee82e5", marginTop: ".5rem" }}>
                This Mission will be set as the next Story Mission in the
                Campaign. Choose &apos;Custom&apos; if you&apos;re setting a
                Custom Mission inside a Custom Campaign.
              </Typography>

              <Paper
                sx={{
                  padding: "1rem",
                  marginTop: ".5rem",
                  backgroundColor: "#312949",
                  display: eventAction.missionID !== "Custom" ? "none" : "",
                }}
              >
                <TextField
                  value={eventAction.customMissionID}
                  onChange={(e) =>
                    setEAValue("customMissionID", e.target.value)
                  }
                  label={"Enter Your Custom Mission's Identifier"}
                  variant="filled"
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                />

                <Typography sx={{ marginTop: ".5rem" }}>
                  Copy the Custom Mission Identifier from the Mission Properties
                  panel of the Custom Mission you want to set as the next
                  Mission (not this Mission), and paste it here. The Custom
                  Mission Identifier for this Event Action can also be set later
                  from within the Custom Campaign Packager.
                </Typography>
                <Typography sx={{ color: "red", marginTop: ".5rem" }}>
                  The Custom Mission must be part of a Custom Campaign Package.
                </Typography>
              </Paper>
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
