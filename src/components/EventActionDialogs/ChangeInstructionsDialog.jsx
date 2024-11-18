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
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//dialog
import GenericTextDialog from "../Dialogs/GenericTextDialog";
//components
import GroupFilter from "../SubComponents/GroupFilter";
//data
import { CustomInstructionType } from "../../lib/core";

export default function ChangeInstructionsDialog() {
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
  ChangeInstructionsDialog.ShowDialog = showDialog;

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
          <DialogTitle>Change Group Instructions Event Action</DialogTitle>
          <DialogContent>
            <Accordion
              defaultExpanded
              sx={{
                backgroundColor: "#281b40",
              }}
            >
              <AccordionDetails>
                <Typography
                  sx={{
                    color: "#ee82e5",
                  }}
                >
                  Changing Group Instructions will apply to All Groups by
                  default, unless one or more Specific Groups are added.
                </Typography>

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
                  edit instructions...
                </Button>
              </AccordionDetails>
            </Accordion>
            <Accordion
              defaultExpanded
              sx={{
                backgroundColor: "#281b40",
              }}
            >
              <AccordionSummary>Instruction Placement</AccordionSummary>
              <AccordionDetails>
                <div className="label-text align-center">
                  <Typography>Placement:</Typography>
                  <div
                    className="triple-column-grd"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="dp"
                          name="instructionType"
                          checked={
                            eventAction.instructionType ===
                            CustomInstructionType.Top
                          }
                          onChange={(e) => {
                            if (e.target.checked)
                              setEAValue(
                                e.target.name,
                                CustomInstructionType.Top
                              );
                          }}
                        />
                      }
                      label="Top"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="dp"
                          name="instructionType"
                          checked={
                            eventAction.instructionType ===
                            CustomInstructionType.Bottom
                          }
                          onChange={(e) => {
                            if (e.target.checked)
                              setEAValue(
                                e.target.name,
                                CustomInstructionType.Bottom
                              );
                          }}
                        />
                      }
                      label="Bottom"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="dp"
                          name="instructionType"
                          checked={
                            eventAction.instructionType ===
                            CustomInstructionType.Replace
                          }
                          onChange={(e) => {
                            if (e.target.checked)
                              setEAValue(
                                e.target.name,
                                CustomInstructionType.Replace
                              );
                          }}
                        />
                      }
                      label="Replace"
                    />
                  </div>
                </div>
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
                        eventAction.groupsToAdd.length === 0
                          ? "lime"
                          : "orange",
                    }}
                  >
                    {eventAction.groupsToAdd.length === 0
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
                  groupList={eventAction.groupsToAdd}
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
