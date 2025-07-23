import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import PropTypes from "prop-types";
//mui
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
//data
import { MissionPoolItem } from "./CampaignData";
//components
import MissionTranslationUI from "./MissionTranslationUI";
//state
import { useRawCampaignDataState } from "./RawCampaignDataState";
import { useCampaignState } from "./CampaignState";

const MissionPool = forwardRef(({ onSnackBar }, ref) => {
  const fileInputRef = useRef(null); // Add this line
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(-1);
  // RawCampaignDataState
  const importedMissions = useRawCampaignDataState(
    (state) => state.importedMissions
  );
  console.log("❗ :: MissionPool :: importedMissions::", importedMissions);
  const addImportedMission = useRawCampaignDataState(
    (state) => state.addImportedMission
  );
  const removeImportedMission = useRawCampaignDataState(
    (state) => state.removeImportedMission
  );
  const replaceImportedMission = useRawCampaignDataState(
    (state) => state.replaceImportedMission
  );
  const missionGUIDs = useRawCampaignDataState((state) => state.missionGUIDs);
  // CampaignState
  const missionPool = useCampaignState((state) => state.missionPool);
  console.log("❗ :: MissionPool :: missionPool::", missionPool);
  const campaignSlots = useCampaignState((state) => state.campaignSlots);
  const addMissionPoolItem = useCampaignState(
    (state) => state.addMissionPoolItem
  );
  const removeMissionPoolItem = useCampaignState(
    (state) => state.removeMissionPoolItem
  );
  const updateMissionPoolItem = useCampaignState(
    (state) => state.updateMissionPoolItem
  );
  const resetCampaignSlotsBulk = useCampaignState(
    (state) => state.resetCampaignSlotsBulk
  );
  const updateSlotMissionItem = useCampaignState(
    (state) => state.updateSlotMissionItem
  );
  const updateSlotStructure = useCampaignState(
    (state) => state.updateSlotStructure
  );

  function handleAddMission(event) {
    if (
      event.target.files &&
      event.target.files.length === 1 &&
      event.target.files[0]
    ) {
      const file = event.target.files[0];
      if (!file.type.match("application/json")) {
        onSnackBar("Only JSON files are allowed.", "error");
        // Reset the input even when there's an error
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        try {
          const importedMission = JSON.parse(e.target.result);
          //validate the imported mission
          const expectedKeys = [
            "missionGUID",
            "fileName",
            "fileVersion",
            "saveDate",
            "timeTicks",
            "languageID",
            "missionProperties",
            "mapSections",
            "globalTriggers",
            "globalEvents",
            "mapEntities",
            "initialDeploymentGroups",
            "reservedDeploymentGroups",
            "eventGroups",
            "entityGroups",
            "customCharacters",
          ];

          if (
            !importedMission ||
            typeof importedMission !== "object" ||
            !expectedKeys.every((key) =>
              Object.prototype.hasOwnProperty.call(importedMission, key)
            )
          ) {
            throw new Error(
              "Invalid JSON format in the file. Make sure this file is a Mission."
            );
          }

          // Check if a Mission with the same missionGUID already exists in the imported mission pool
          if (missionGUIDs.includes(importedMission.missionGUID)) {
            // it exists, so we replace it
            replaceImportedMission(importedMission);

            let newIndex = selectedMissionIndex;
            if (selectedMissionIndex === -1) {
              //figure out the index of the mission in the mission pool
              newIndex = missionPool.findIndex(
                (item) =>
                  item.missionItem.missionGUID === importedMission.missionGUID
              );
              setSelectedMissionIndex(newIndex);
            }
            console.log("❗ :: handleAddMission :: missionPool::", missionPool);
            console.log("❗ :: handleAddMission :: newIndex::", newIndex);

            // Update the mission pool item
            let poolItem = missionPool[newIndex];
            poolItem.fileName = file.name;
            poolItem.missionItem.missionName =
              importedMission.missionProperties.missionName;
            poolItem.missionItem.customMissionIdentifier =
              importedMission.missionProperties.customMissionIdentifier;
            let hasCustomSetNextEventActions =
              importedMission.globalEvents.filter((event) =>
                event.eventActions.some(
                  (action) => action.eventActionType === 27
                )
              ).length > 0;
            updateMissionPoolItem(newIndex, poolItem);
            //update any slots that use this mission
            campaignSlots.forEach((slot, index) => {
              if (
                slot.structure.missionID === poolItem.missionItem.missionGUID
              ) {
                updateSlotMissionItem(index, poolItem.missionItem);
                updateSlotStructure(index, {
                  ...slot.structure,
                  hasCustomSetNextEventActions: hasCustomSetNextEventActions,
                });
              }
            });

            onSnackBar("Replaced Mission successfully.", "success");
          } else {
            // it doesn't exist, so we add it
            addImportedMission(importedMission);

            const newMissionPoolItem = new MissionPoolItem(
              importedMission.missionGUID,
              importedMission.missionProperties.missionName,
              importedMission.missionProperties.customMissionIdentifier
            );
            newMissionPoolItem.fileName = file.name;

            addMissionPoolItem(newMissionPoolItem);
            setSelectedMissionIndex(importedMissions.length); // Select the newly added mission
            onSnackBar("Imported Mission added successfully.", "success");
          }
        } catch (error) {
          onSnackBar(error.toString(), "error");
        } finally {
          // Reset the input even when there's an error
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };

      fileReader.readAsText(file);
    }
  }

  function handleRemoveMission() {
    if (
      selectedMissionIndex < 0 ||
      selectedMissionIndex >= importedMissions.length
    ) {
      return; // Invalid index, do nothing
    }
    //reset any campaign slot that is using this mission
    const missionGUID =
      missionPool[selectedMissionIndex].missionItem.missionGUID;
    // Find all campaign slots that use this mission and reset them
    const slotsToRemove = campaignSlots
      .map((slot, index) =>
        slot.structure.missionID === missionGUID ? index : -1
      )
      .filter((index) => index !== -1);
    resetCampaignSlotsBulk(slotsToRemove);

    //remove the mission from the mission pool
    removeImportedMission(
      missionPool[selectedMissionIndex].missionItem.missionGUID
    );
    removeMissionPoolItem(
      missionPool[selectedMissionIndex].missionItem.missionGUID
    );
    setSelectedMissionIndex(-1);
  }

  const handleCopyCustomMissionIdentifier = () => {
    if (selectedMissionIndex === -1) {
      return; // Invalid index, do nothing
    }

    const identifier =
      missionPool[selectedMissionIndex].missionItem.customMissionIdentifier;
    // importedMissions[selectedMissionIndex].missionProperties
    //   .customMissionIdentifier;

    if (identifier) {
      navigator.clipboard
        .writeText(identifier)
        .then(() => {
          onSnackBar(`Copied: ${identifier}`, "success");
        })
        .catch(() => {
          onSnackBar("Failed to copy identifier.", "error");
        });
    }
  };

  useImperativeHandle(ref, () => ({
    onReset: () => {
      setSelectedMissionIndex(-1);
    },
  }));

  //event listener
  useEffect(() => {
    const handleReset = (event) => {
      if (event.type === "campaign-reset") {
        setSelectedMissionIndex(-1);
      }
    };

    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("campaign-reset", handleReset, { signal });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div style={{ marginTop: "1rem" }}>
      <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Mission Pool
        </AccordionSummary>
        <AccordionDetails>
          <div className="structure-layout">
            {/* LEFT PANEL */}
            <Paper
              sx={{
                backgroundColor: "#3c2a5b",
                padding: ".5rem .5rem",
                overflow: "hidden",
              }}
            >
              <List
                sx={{
                  height: "100%",
                  overflow: "auto",
                  scrollbarColor: "#bc56ff #4c4561",
                  scrollbarWidth: "thin",
                }}
              >
                {missionPool.map((mission, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      selected={selectedMissionIndex === index}
                      onClick={() => setSelectedMissionIndex(index)}
                      sx={{
                        backgroundColor:
                          selectedMissionIndex === index
                            ? "#bc56ff"
                            : "inherit",
                        color:
                          selectedMissionIndex === index ? "white" : "inherit",
                      }}
                    >
                      <div className="structure-item">
                        <div className="structure-item-row">
                          {mission.missionItem.missionName}
                        </div>
                        <div className="structure-item-row">
                          <Typography variant="subtitle2" className={"pink"}>
                            {mission.fileName}
                          </Typography>
                        </div>
                      </div>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* MIDDLE */}
            <Paper
              sx={{
                backgroundColor: "#3c2a5b",
                padding: ".5rem",
                height: "100%",
              }}
            >
              <div className="structure-middle">
                {/* ADD SLOT */}
                <Tooltip title="Add Or Replace Mission" placement="right">
                  <IconButton component="label" variant="contained">
                    <AddIcon />
                    <input
                      ref={fileInputRef}
                      hidden
                      accept="application/json"
                      type="file"
                      onChange={handleAddMission}
                    />
                  </IconButton>
                </Tooltip>
                {/* REMOVE SLOT */}
                <Tooltip title="Remove Mission" placement="right">
                  <IconButton
                    sx={{ color: "red" }}
                    disabled={selectedMissionIndex === -1}
                    component="label"
                    variant="contained"
                    onClick={handleRemoveMission}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>

            {/* RIGHT PANEL */}
            <Paper
              sx={{
                backgroundColor: "#3c2a5b",
                padding: "1rem",
              }}
            >
              {selectedMissionIndex === -1 || missionPool.length === 0 ? (
                <Typography>
                  Add all the custom Missions you want to include in your
                  Campaign here. Assign them to slots in the Campaign Structure
                  below.
                </Typography>
              ) : (
                <>
                  <Typography>
                    {missionPool[selectedMissionIndex].missionItem.missionName}
                  </Typography>
                  <Paper
                    sx={{
                      backgroundColor: "#281b40",
                      padding: "1rem",
                      marginTop: ".5rem",
                    }}
                  >
                    <div
                      className="two-column-grid"
                      style={{ alignItems: "center" }}
                    >
                      <div>
                        <Typography>Custom Mission Identifier:</Typography>
                        <Typography variant="subtitle2" className="pink">
                          {
                            missionPool[selectedMissionIndex].missionItem
                              .customMissionIdentifier
                          }
                        </Typography>
                      </div>
                      <div>
                        <Button
                          onClick={handleCopyCustomMissionIdentifier}
                          variant="contained"
                          disabled={
                            missionPool[selectedMissionIndex].missionItem
                              .customMissionIdentifier === ""
                          }
                        >
                          Copy Custom Mission Identifier
                        </Button>
                      </div>
                    </div>
                  </Paper>

                  <div className="simple-row mt-p5">
                    <Accordion
                      sx={{ width: "100%", backgroundColor: "#281b40" }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <div className="event-container">
                          <Typography>Mission Translations</Typography>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <MissionTranslationUI
                          key={
                            missionPool[selectedMissionIndex].missionItem
                              .missionGUID
                          }
                          missionPoolItem={missionPool[selectedMissionIndex]}
                          missionPoolIndex={selectedMissionIndex}
                          missionTitle={
                            missionPool[selectedMissionIndex].missionItem
                              .missionName
                          }
                          onSnackBar={onSnackBar}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </>
              )}
            </Paper>
          </div>
        </AccordionDetails>
      </Accordion>
      {/* </Paper> */}
    </div>
  );
});

export default MissionPool;
MissionPool.displayName = "MissionPool";

MissionPool.propTypes = {
  onSnackBar: PropTypes.func,
};
