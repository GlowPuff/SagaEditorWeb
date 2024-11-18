import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
//store
import { useEventGroupStore } from "../../data/dataStore";

export default function ActivateEventGroupDialog() {
  //event group store
  const eventGroups = useEventGroupStore((state) => state.eventGroups);
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const [selectedGroup, setSelectedGroup] = useState("");
  const callbackFunc = useRef(null);

  function setEAValue(value) {
    setEventAction({ ...eventAction, eventGroupGUID: value.GUID });
  }

  function showDialog(ea, callback) {
    callbackFunc.current = callback;
    setSelectedGroup("");
    if (ea.eventGroupGUID) {
      let eg = eventGroups.find((x) => x.GUID === ea.eventGroupGUID);
      if (eg !== undefined) {
        setSelectedGroup(eg);
      } else if (ea.eventGroupGUID !== "") {
        setSelectedGroup("");
        console.log(
					`Event Action [${ea.displayName}]: Event Group [${ea.eventGroupGUID}] no longer exists`
        );
				ea.eventGroupGUID = "";
      }
    }
    setEventAction(ea);
    setOpen(true);
  }
  ActivateEventGroupDialog.ShowDialog = showDialog;

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
          <DialogTitle>Activate Event Group Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
              <div className="mission-panel align-center">
                <Typography
                >
                  Select an Event Group to activate.
                </Typography>
                <FormControl>
                  <InputLabel>Event Groups ({eventGroups.length} in Mission)</InputLabel>
                  <Select
                    value={selectedGroup}
                    onChange={(e) => {
                      setEAValue(e.target.value);
                      setSelectedGroup(e.target.value);
                    }}
                    displayEmpty
                  >
                    {eventGroups.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
