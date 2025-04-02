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
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";
import EventSelectAdd from "../SubComponents/EventSelectAdd";
import GroupFilter from "../SubComponents/GroupFilter";

export default function QueryGroupDialog() {
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
  QueryGroupDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function onAddGroup(group, prop) {
    setEAValue(prop, { name: group.name, id: group.id });
  }

  function onRemoveGroup(index, prop) {
    setEAValue(prop, null);
  }

  function changeItem(name, guid) {
    setEAValue(name, guid);
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
          <DialogTitle>Query Group Event Action</DialogTitle>
          <DialogContent>
            <Paper
              sx={{
                backgroundColor: "#201531",
                padding: "1rem",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                }}
              >
                Query whether a Group is currently in the Mission or not, and
                fire a Trigger or Event if it is.
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                Heroes/Allies/Rebels are only considered in the game if they are
                not Withdrawn at the time this Event Action activates.
              </Typography>
              <Typography
                sx={{
                  color: "white",
                }}
              >
                Enemy Groups are only considered in the game if they are either
                deployed or in the Imperial Hand at the time this Event Action
                activates.
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
                  <AccordionSummary>Query Enemy Group</AccordionSummary>
                  <AccordionDetails>
                    <GroupFilter
                      groupList={
                        eventAction.groupEnemyToQuery
                          ? [eventAction.groupEnemyToQuery]
                          : []
                      }
                      onAdd={(g) => onAddGroup(g, "groupEnemyToQuery")}
                      onRemove={(index) =>
                        onRemoveGroup(index, "groupEnemyToQuery")
                      }
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                  <AccordionSummary>
                    If Group Is In The Mission, Fire This Trigger:
                  </AccordionSummary>
                  <AccordionDetails>
                    <TriggerSelectAdd
                      initialGUID={eventAction.foundTrigger}
                      onItemChanged={(ev) =>
                        changeItem("foundTrigger", ev.GUID)
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
                  <AccordionSummary>
                    Query Hero/Ally/Rebel Group
                  </AccordionSummary>
                  <AccordionDetails>
                    <GroupFilter
                      groupList={
                        eventAction.groupRebelToQuery
                          ? [eventAction.groupRebelToQuery]
                          : []
                      }
                      onAdd={(g) => onAddGroup(g, "groupRebelToQuery")}
                      onRemove={(index) =>
                        onRemoveGroup(index, "groupRebelToQuery")
                      }
                      dataType="heroallyrebel"
                      title="Hero/Ally/Rebel Groups"
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                  <AccordionSummary>
                    If Group Is In The Mission, Fire This Event:
                  </AccordionSummary>
                  <AccordionDetails>
                    <EventSelectAdd
                      initialGUID={eventAction.foundEvent}
                      onItemChanged={(ev) => changeItem("foundEvent", ev.GUID)}
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
