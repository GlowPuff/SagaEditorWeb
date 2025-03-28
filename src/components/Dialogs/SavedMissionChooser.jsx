import { useEffect, useState } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
//icons
import DeleteIcon from "@mui/icons-material/Delete";

export default function SavedMissionChooser({ open, onClose }) {
  const [missionList, setMissionList] = useState([]);
  const [selectedMissionGUID, setSelectedMissionGUID] = useState(null); //missionGUID

  // Reset state when dialog opens
  useEffect(() => {
    //collect list of Missions stored in the local storage
    const savedMissions =
      JSON.parse(localStorage.getItem("savedMissions")) || [];
    setMissionList(savedMissions);
    setSelectedMissionGUID(null); // Reset selected mission when dialog opens
    // console.log("🚀 ~ useEffect ~ savedMissions:", savedMissions);
  }, [open]);

  function onOK(isOK) {
    onClose({
      isOK,
      missionGUID: selectedMissionGUID,
    });
  }

  function onRemoveMission(GUID) {
    // Remove the mission from the list and local storage
    const updatedMissions = missionList.filter(
      (mission) => mission.missionGUID !== GUID
    );
    setMissionList(updatedMissions);

    localStorage.setItem("savedMissions", JSON.stringify(updatedMissions));
  }

  function removeAllMissions() {
    // Remove all missions from the list and local storage
    setMissionList([]);
    localStorage.removeItem("savedMissions");
  }

  function handleMissionSelect(mission) {
    setSelectedMissionGUID(mission.missionGUID); // Set selected mission GUID
  }

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={() => onOK(false)}
      maxWidth={"sm"}
      fullWidth={true}
      scroll={"paper"}
    >
      <DialogTitle>Choose a Saved Mission to Load</DialogTitle>
      <DialogContent>
        <Paper sx={{ padding: "1rem" }}>
          <Typography gutterBottom>
            Missions that have been Quick Saved to the browser&apos;s local storage will be listed
            below. Select a Mission to load it.
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontStyle: "italic", color: "red" }}
          >
            Note: Loading a mission will overwrite any unsaved changes to the
            current mission.
          </Typography>
        </Paper>
        <Accordion defaultExpanded={true}>
          {/* <AccordionSummary>Saved Missions</AccordionSummary> */}
          <AccordionDetails>
            <List>
              {missionList.map((item, index) => (
                <ListItem
                  disablePadding
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveMission(item.missionGUID)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => handleMissionSelect(item)}
                    selected={selectedMissionGUID === item.missionGUID}
                  >
                    {item.missionProperties.missionName}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
        <Button
          onClick={removeAllMissions}
          variant="contained"
          sx={{
            marginRight: "auto",
            marginLeft: "1rem",
            backgroundColor: "red",
          }}
        >
          Delete All Saved Missions
        </Button>
        <Button onClick={() => onOK(false)} variant="contained">
          Close
        </Button>
        <Button
          onClick={() => onOK(true)}
          variant="contained"
          disabled={!selectedMissionGUID}
        >
          Load Selected Mission
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SavedMissionChooser.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
