import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
//components
import GroupFilter from "../SubComponents/GroupFilter";

export default function ResetGroupDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    // console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setOpen(true);
  }
  ResetGroupDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function onAddGroup(group) {
    setEAValue("groupsToAdd", [
      ...eventAction.groupsToAdd,
      { name: group.name, id: group.id },
    ]);
  }

  function onRemoveGroup(index) {
    setEAValue(
      "groupsToAdd",
      eventAction.groupsToAdd.filter((x, idx) => idx !== index)
    );
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
          <DialogTitle>Reset Group Defaults Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem" }}>
              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                Custom Enemy Deployments are not affected by this Event Action.
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    name="resetAll"
                    checked={eventAction.resetAll}
                    onChange={(e) =>
                      setEAValue(e.target.name, e.target.checked)
                    }
                  />
                }
                label="Reset All Groups"
              />
            </Paper>

            <div className={"mt-1 " + (eventAction.resetAll ? "disabled" : "")}>
              <Accordion
                defaultExpanded
                sx={{
                  backgroundColor: "#281b40",
                }}
              >
                <AccordionSummary>Reset Specific Groups</AccordionSummary>
                <AccordionDetails>
                  <GroupFilter
                    title={"Enemy Groups"}
                    onAdd={(g) => onAddGroup(g)}
                    onRemove={(index) => onRemoveGroup(index)}
                    groupList={eventAction.groupsToAdd}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
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
