import { useState, useRef } from "react";
//mui
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export default function NextMissionEAChooserDialog() {
  const [open, setOpen] = useState(false);
  const callbackFunc = useRef(null);

  //list of all event actions across all passed in Events that are 'Set Next Mission'
  //{eventName, eventGUID, eventAction}
  const [nextEventActionList, setNextEventActionList] = useState([]);

  //eas is an array of events with a 'Set Next Mission' action
  function showDialog(events, callback) {
    callbackFunc.current = callback;
    setOpen(true);
    //list of all event actions across all passed in Events that have a 'Set Next Mission' action
    setNextEventActionList([]); // Reset the list before populating it

    let data = events
      .map((event) => {
        //all EAs of type 'Set Next Mission'
        const nextMissionEAs = event.eventActions.filter(
          (action) => action.eventActionType === 27
        );
        return nextMissionEAs.map((ea) => ({
          eventName: event.name,
          eventGUID: event.GUID,
          eventAction: ea,
        }));
      })
      .flat();
    // console.log("❗ :: data :: data::", data);
    setNextEventActionList(data);
  }
  NextMissionEAChooserDialog.ShowDialog = showDialog;

  function onEditEA(eventBlock) {
    if (typeof callbackFunc.current === "function")
      callbackFunc.current(eventBlock);
    setOpen(false);
  }

  function onCancel() {
    setOpen(false);
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth="sm"
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>&apos;Set Next Mission&apos; Event Actions</DialogTitle>
          <DialogContent>
            <Typography>
              The following &apos;Set Next Mission&apos; Event Actions were
              found.
            </Typography>

            <Paper
              sx={{
                backgroundColor: "#281b40",
                marginTop: ".5rem",
              }}
            >
              <div>
                <List
                  sx={{
                    height: "100%",
                    width: "min-fit",
                  }}
                >
                  {nextEventActionList.map((eventItem, index) => (
                    <ListItem key={index}>
                      <div
                        style={{
                          display: "grid",
                          width: "100%",
                          gridTemplateColumns: "1fr auto",
                        }}
                      >
                        <div>
                          <Typography>{eventItem.eventName}</Typography>
                          <Typography className="pink">
                            {eventItem.eventAction.missionID === "Custom"
                              ? eventItem.eventAction.customMissionID
                              : eventItem.eventAction.missionID.toUpperCase()}
                          </Typography>
                        </div>
                        <IconButton
                          variant="contained"
                          onClick={() => onEditEA(eventItem)}
                          size="large"
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </div>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} variant="contained">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
