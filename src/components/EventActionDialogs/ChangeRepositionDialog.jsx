import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
//components
import GroupFilter from "../SubComponents/GroupFilter";
//dialog
import GenericTextDialog from "../Dialogs/GenericTextDialog";

export default function ChangeRepositionDialog() {
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
  ChangeRepositionDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function onAddGroup(group) {
    setEventAction({
      ...eventAction,
      useSpecific: true,
      repoGroups: [
        ...eventAction.repoGroups,
        { name: group.name, id: group.id },
      ],
    });
  }

  function onRemoveGroup(index) {
    let groups = eventAction.repoGroups.filter((x, idx) => idx !== index);
    if (groups.length === 0) {
      setEventAction({
        ...eventAction,
        useSpecific: false,
        repoGroups: [...groups],
      });
    } else {
      setEAValue("repoGroups", [...groups]);
    }
  }

  function editClick() {
    GenericTextDialog.ShowDialog(
      "Edit Instructions",
      eventAction.theText,
      (value) => {
        setEAValue("theText", value);
      }
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
          <DialogTitle>Change Reposition Instructions Event Action</DialogTitle>
          <DialogContent>
            <Accordion
              defaultExpanded
              sx={{
                backgroundColor: "#281b40",
              }}
            >
              <AccordionDetails>
                <Button
                  onClick={editClick}
                  variant="contained"
                  sx={{
                    marginTop: ".5rem",
                    outline: eventAction.theText.trim()
                      ? "2px solid lime"
                      : "2px solid red",
                  }}
                >
                  edit reposition instructions...
                </Button>
              </AccordionDetails>
            </Accordion>

            <Paper sx={{ padding: ".5rem" }}>
              <div
                className="two-column-grid align-center"
                style={{ justifyItems: "center" }}
              >
                <div>
                  <Typography>Affected Groups:</Typography>
                </div>
                <div>
                  <Typography
                    sx={{
                      color:
                        eventAction.repoGroups.length === 0 ? "lime" : "orange",
                    }}
                  >
                    {eventAction.repoGroups.length === 0
                      ? "All Groups"
                      : "Specific Groups"}
                  </Typography>
                </div>
              </div>
            </Paper>

            <Accordion
              defaultExpanded
              sx={{
                backgroundColor: "#281b40",
              }}
            >
              <AccordionDetails>
                <GroupFilter
                  title={"Enemy Groups"}
                  onAdd={(g) => onAddGroup(g)}
                  onRemove={(index) => onRemoveGroup(index)}
                  groupList={eventAction.repoGroups}
                />
              </AccordionDetails>
            </Accordion>
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

      <GenericTextDialog />
    </>
  );
}
