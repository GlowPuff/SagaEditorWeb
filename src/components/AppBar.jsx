// import { useState, useEffect } from "react";
import { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
//icons
import MenuIcon from "@mui/icons-material/Menu";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveIcon from "@mui/icons-material/Save";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import Delete from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";
//dialogs
import NewTriggerDialog from "./Dialogs/NewTriggerDialog";
import NewEventDialog from "./Dialogs/NewEventDialog";
import SavedMissionChooser from "./Dialogs/SavedMissionChooser";
//data
import { createGUID } from "../lib/core";
import { MissionEvent, MissionTrigger } from "../data/Mission";
import {
  useRootMissionPropsStore,
  useMissionPropertiesStore,
  useInitialGroupsStore,
  useReservedGroupsStore,
  useEventGroupStore,
  useEntityGroupStore,
  useMapSectionsStore,
  useEventsStore,
  useTriggerStore,
  useMapEntitiesStore,
  useToonsStore,
} from "../data/dataStore";
import useMissionImporter from "../hooks/useMissionImporter";
import useMissionExporter from "../hooks/useMissionExporter";

export default function AppBar({ languageID, onClearMap }) {
  const [chooserOpen, setChooserOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const addEvent = useEventsStore((state) => state.addEvent);
  const addTrigger = useTriggerStore((state) => state.addTrigger);
  const addMapSection = useMapSectionsStore((state) => state.addSection);
  const [open, setOpen] = useState(false);
  // const rootMissionGUID = useRootMissionPropsStore(
  //   (state) => state.missionProps.missionGUID
  // );
  //set state methods
  const updateRootMissionProp = useRootMissionPropsStore(
    (state) => state.updateMissionProp
  );
  const importMissionProps = useMissionPropertiesStore(
    (state) => state.importMission
  );
  const importInitialGroups = useInitialGroupsStore(
    (state) => state.importMission
  );
  const importReservedGroups = useReservedGroupsStore(
    (state) => state.importMission
  );
  const importEventGroups = useEventGroupStore((state) => state.importMission);
  const importEntityGroups = useEntityGroupStore(
    (state) => state.importMission
  );
  const importMapSections = useMapSectionsStore((state) => state.importMission);
  const importEvents = useEventsStore((state) => state.importMission);
  const importTriggers = useTriggerStore((state) => state.importMission);
  const importMapEntities = useMapEntitiesStore((state) => state.importMission);
  const importCustomToons = useToonsStore((state) => state.importMission);
  const [emptyMissionRaw, setEmptyMissionRaw] = useState(null);

  useEffect(() => {
    fetch("/data/emptymission.json")
      .then((response) => response.text())
      .then((data) => {
        setEmptyMissionRaw(data);
      });
  }, []);

  const importMission = useMissionImporter(clearData);
  const exportMission = useMissionExporter(languageID);

  const menuOpen = Boolean(anchorEl);

  function onNewMission() {
    setOpen(true);
  }

  function onNewTrigger() {
    NewTriggerDialog.ShowDialog(new MissionTrigger(), (value) => {
      addTrigger(value);
    });
  }

  function onNewEvent() {
    NewEventDialog.ShowDialog(new MissionEvent(), (value) => {
      addEvent(value);
    });
  }

  function onNewSection() {
    addMapSection("New Map Section");
  }

  function handleClose(bContinue) {
    setOpen(false);
    if (bContinue && emptyMissionRaw) {
      const emptyMission = JSON.parse(emptyMissionRaw);
      //generate new GUIDs
      emptyMission.missionProperties.customMissionIdentifier = createGUID();
      const newGUID = createGUID();
      emptyMission.missionGUID = newGUID;
      updateRootMissionProp("missionGUID", newGUID);
      console.log("🚀 ~ handleClose ~ emptyMission:", emptyMission);

      onClearMap();

      importMissionProps(emptyMission);
      importInitialGroups(emptyMission);
      importReservedGroups(emptyMission);
      importEventGroups(emptyMission);
      importEntityGroups(emptyMission);
      importMapSections(emptyMission);
      importEvents(emptyMission);
      importTriggers(emptyMission);
      importMapEntities(emptyMission);
      importCustomToons(emptyMission);

      //send a global event to notify that the mission has been loaded
      const event = new CustomEvent("missionLoaded");
      window.dispatchEvent(event);
    }
  }

  function clearData() {
    onClearMap();
  }

  function handleClickMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleNewMission() {
    handleCloseMenu();
    onNewMission();
  }

  function handleImportMission() {
    handleCloseMenu();
    importMission.loadMission();
  }
  function handleExportMission() {
    handleCloseMenu();
    exportMission.saveMission();
  }

  function handleQuickSave() {
    handleCloseMenu();
    exportMission.saveMissionToLocalStorage("quickSaveMission");
  }

  function handleQuickLoad() {
    handleCloseMenu();
    const success =
      importMission.loadMissionFromLocalStorage("quickSaveMission");
    if (success) {
      // console.log("Mission loaded from local storage successfully");
    } else {
      console.error("Failed to load mission from local storage");
    }
  }

  function clearLocalStorage() {
    handleCloseMenu();
		localStorage.removeItem("quickSaveMission");
  }

  function showChooser() {
    handleCloseMenu();
    setChooserOpen(true);
  }

  //data = {isOK: bool, missionGUID: GUID}
  function closeChooser(data) {
    setChooserOpen(false);
    if (data.isOK) {
      //clear the map and load the selected mission
      onClearMap();
      const success = importMission.loadMissionFromLocalStorageArray(
        data.missionGUID
      );
      if (success) {
        console.log("Mission loaded successfully");
      } else {
        console.error("Failed to load mission");
      }
    }
  }

  return (
    <div className="menu">
      <Paper>
        <div className="menubar">
          <IconButton
            variant="contained"
            onClick={handleClickMenu}
            size="large"
            style={{ color: "purple" }}
          >
            <MenuIcon fontSize="inherit" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
          >
            <Tooltip title="Create a new Mission" placement="right">
              <MenuItem onClick={handleNewMission}>
                <ListItemIcon>
                  <AddBoxIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>New Mission</ListItemText>
              </MenuItem>
            </Tooltip>

            <Divider />

            {/* IMPORT */}
            <Tooltip
              title="Import a Mission from your filesystem"
              placement="right"
            >
              <MenuItem onClick={handleImportMission}>
                <ListItemIcon>
                  <FileOpenIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Import...</ListItemText>
              </MenuItem>
            </Tooltip>

            {/* EXPORT */}
            <Tooltip
              title="Export a Mission to your filesystem"
              placement="right"
            >
              <MenuItem onClick={handleExportMission}>
                <ListItemIcon>
                  <SaveAltIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export...</ListItemText>
              </MenuItem>
            </Tooltip>

            <Divider />

            {/* QUICK SAVE */}
            <Tooltip
              title="Quickly save work in progress to your browser's local stoarage"
              placement="right"
            >
              <MenuItem onClick={handleQuickSave}>
                <ListItemIcon>
                  <SaveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Quick Save</ListItemText>
              </MenuItem>
            </Tooltip>

            {/* QUICK LOAD */}
            <Tooltip
              title="Quickly load a Quick Save Mission from your browser's local stoarage"
              placement="right"
            >
              <MenuItem
                onClick={handleQuickLoad}
                disabled={!localStorage.getItem("quickSaveMission")}
              >
                <ListItemIcon>
                  <DriveFolderUploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Quick Load</ListItemText>
              </MenuItem>
            </Tooltip>

            {/* CLEAR DATA */}
            <Tooltip
              title="Clear the Quick Save Mission from your browser's local storage"
              placement="right"
            >
              <MenuItem
                onClick={clearLocalStorage}
                disabled={!localStorage.getItem("quickSaveMission")}
              >
                <ListItemIcon>
                  <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete Quick Save</ListItemText>
              </MenuItem>
            </Tooltip>

            <Divider />

            <Tooltip title="Open the Saved Mission Chooser" placement="right">
              <MenuItem onClick={showChooser}>
                <ListItemIcon>
                  <ListAltIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Saved Mission Chooser...</ListItemText>
              </MenuItem>
            </Tooltip>
          </Menu>

          <Typography variant="h6">ICE Mission Editor</Typography>

          <Tooltip title="Add a new Trigger">
            <Button
              sx={{ marginLeft: "auto" }}
              variant="contained"
              onClick={onNewTrigger}
              startIcon={<ToggleOnIcon />}
            >
              Add Trigger...
            </Button>
          </Tooltip>

          <Tooltip title="Add a new Event">
            <Button
              variant="contained"
              onClick={onNewEvent}
              startIcon={<DynamicFormIcon />}
            >
              Add Event...
            </Button>
          </Tooltip>

          <Tooltip title="Add a new Map Section">
            <Button
              variant="contained"
              onClick={onNewSection}
              startIcon={<LibraryAddIcon />}
            >
              Add Map Section
            </Button>
          </Tooltip>

          {/* <FiberManualRecordIcon sx={{ transform: "scale(.5)" }} /> */}

          {/* <Typography>Active Section</Typography> */}

          {/* <Select
            value={selectedSection}
            onChange={(e) => changeSection(e.target.value)}
            displayEmpty
          >
            {mapSections &&
              mapSections.map((item, index) => (
                <MenuItem key={index} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
          </Select> */}
        </div>
      </Paper>

      <NewTriggerDialog />
      <NewEventDialog />
      <SavedMissionChooser open={chooserOpen} onClose={closeChooser} />

      {/* Dialog for creating a new mission */}
      <Fragment>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            {"Create a new Mission?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Creating a new Mission will clear the current Mission and you will
              lose any unsaved changes. Do you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{ color: "pink" }}
              onClick={() => handleClose(true)}
            >
              Create New Mission
            </Button>
            <Button
              variant="contained"
              onClick={() => handleClose(false)}
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </div>
  );
}

AppBar.propTypes = {
  mapSections: PropTypes.array,
  onChangeSelectedSection: PropTypes.func,
  languageID: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
  onClearMap: PropTypes.func,
};
