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
import Typography from "@mui/material/Typography";
//components
import GroupFilter from "../SubComponents/GroupFilter";

export default function RemoveGroupDialog() {
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
  RemoveGroupDialog.ShowDialog = showDialog;

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
          <DialogTitle>Remove Groups Event Action</DialogTitle>
          <DialogContent>
            <Paper
              sx={{
                backgroundColor: "#201531",
                padding: "1rem",
              }}
            >
              <Typography
                sx={{
                  color: "#ee82e5",
                  marginBottom: ".5rem",
                }}
              >
                Note the following about Removed Groups:
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                • The Group becomes available for manual deployment unless the
                group has the Cannot Redeploy flag set
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                • Non-villains are returned to the hand unless the group has the
                Cannot Redeploy flag set
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                • Earned Villains are added back to the manual deployment list
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                • The Group will Reset if the &apos;Reset on Redeployment&apos;
                flag is set
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                • &apos;On Defeated&apos; Events and Triggers do not fire
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                • Adaptive Difficulty options do not apply (no Fame or Imperial
                Reimbursement)
              </Typography>
            </Paper>

            <div className="two-column-grid mt-p5">
              {/* LEFT */}
              <Paper
                sx={{
                  backgroundColor: "#201531",
                  padding: "1rem",
                }}
              >
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary>Remove Enemy Groups</AccordionSummary>
                  <AccordionDetails>
                    <GroupFilter
                      groupList={eventAction.groupsToRemove}
                      onAdd={(g) => onAddGroup(g, "groupsToRemove")}
                      onRemove={(index) =>
                        onRemoveGroup(index, "groupsToRemove")
                      }
                    />
                  </AccordionDetails>
                </Accordion>
              </Paper>

              {/* RIGHT */}
              <Paper
                sx={{
                  backgroundColor: "#201531",
                  padding: "1rem",
                }}
              >
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary>Remove Ally/Rebel Groups</AccordionSummary>
                  <AccordionDetails>
                    <GroupFilter
                      groupList={eventAction.allyGroupsToRemove}
                      onAdd={(g) => onAddGroup(g, "allyGroupsToRemove")}
                      onRemove={(index) =>
                        onRemoveGroup(index, "allyGroupsToRemove")
                      }
                      dataType="allyrebel"
                      title="Ally Groups"
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
