import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
//components
import GroupFilter from "../SubComponents/GroupFilter";

export default function ChangeGroupStatusDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setOpen(true);
  }
  ChangeGroupStatusDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function onAddGroup(group, prop) {
    setEAValue(prop, [
      ...eventAction[prop],
      { name: group.name, id: group.id },
    ]);
  }

  function onRemoveGroup(index, prop) {
    setEAValue(
      prop,
      eventAction[prop].filter((x, idx) => idx !== index)
    );
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
          <DialogTitle>Ready/Exhaust Group Event Action</DialogTitle>
          <DialogContent>
            <div className="two-column-grid">
              <Paper
                sx={{
                  backgroundColor: "#201531",
                  padding: "1rem",
                }}
              >
                <Accordion
                  defaultExpanded
                  sx={{
                    backgroundColor: "#281b40",
                  }}
                >
                  <AccordionSummary>Ready These Groups</AccordionSummary>
                  <AccordionDetails>
                    <GroupFilter
                      title={"Enemy Groups"}
                      onAdd={(g) => onAddGroup(g, "readyGroups")}
                      onRemove={(index) => onRemoveGroup(index, "readyGroups")}
                      groupList={eventAction.readyGroups}
                    />
                  </AccordionDetails>
                </Accordion>
              </Paper>

              <Paper
                sx={{
                  backgroundColor: "#201531",
                  padding: "1rem",
                }}
              >
                <Accordion
                  defaultExpanded
                  sx={{
                    backgroundColor: "#281b40",
                  }}
                >
                  <AccordionSummary>Exhaust These Groups</AccordionSummary>
                  <AccordionDetails>
                    <GroupFilter
                      title={"Enemy Groups"}
                      onAdd={(g) => onAddGroup(g, "exhaustGroups")}
                      onRemove={(index) =>
                        onRemoveGroup(index, "exhaustGroups")
                      }
                      groupList={eventAction.exhaustGroups}
                    />
                  </AccordionDetails>
                </Accordion>
              </Paper>
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
