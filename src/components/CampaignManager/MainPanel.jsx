import { useRef } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
//components
import MissionTranslationUI from "./MissionTranslationUI";
import SetNextMissionDialog from "../EventActionDialogs/SetNextMissionDialog";
//data
import { Tier, MissionType, RawTranslationData } from "./CampaignData";
//state
import { useCampaignState } from "./CampaignState";
import { useRawCampaignDataState } from "./RawCampaignDataState";

const MainPanel = ({ selectedSlotIndex, onSnackBar }) => {
  const fileInputRef = useRef(null); // Add this line
  //state
  const addImportedMission = useRawCampaignDataState(
    (state) => state.addImportedMission
  );
  const removeImportedMission = useRawCampaignDataState(
    (state) => state.removeImportedMission
  );
  const replaceImportedMission = useRawCampaignDataState(
    (state) => state.replaceImportedMission
  );
  const campaignSlots = useCampaignState((state) => state.campaignSlots);
  const resetCampaignSlot = useCampaignState(
    (state) => state.resetCampaignSlot
  );
  const updateSlotStructure = useCampaignState(
    (state) => state.updateSlotStructure
  );
  const updateSlotMissionItem = useCampaignState(
    (state) => state.updateSlotMissionItem
  );
  const removeTranslationDataBulk = useRawCampaignDataState(
    (state) => state.removeTranslationDataBulk
  );
  const updateImportedMissionNextEventAction = useRawCampaignDataState(
    (state) => state.updateImportedMissionNextEventAction
  );
  const missionGUIDs = useRawCampaignDataState((state) => state.missionGUIDs);
  const importedMissions = useRawCampaignDataState(
    (state) => state.importedMissions
  );

  const campaignSlot = campaignSlots[selectedSlotIndex] || null;

  const handleResetToPlayersChoice = () => {
    if (campaignSlot === null || campaignSlot === undefined) {
      return; // Invalid index, do nothing
    }

    //remove imported mission if it exists
    const missionGUID = campaignSlot.structure.missionID;
    if (missionGUID !== "00000000-0000-0000-0000-000000000000") {
      removeImportedMission(missionGUID);
    }

    //remove Mission translations for this slot
    removeTranslationDataBulk(campaignSlot.translationItems);

    // last, reset the selected mission to "Player's Choice"
    resetCampaignSlot(selectedSlotIndex);
  };

  const handleImportMission = (event) => {
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

          // Check if a Mission with the same missionGUID already exists in the imported mission pool, but only if it's not the same as the current campaign slot's mission
          if (
            campaignSlot.structure.missionID !== importedMission.missionGUID &&
            missionGUIDs.includes(importedMission.missionGUID)
          ) {
            throw new Error(
              `A Mission with the GUID ${importedMission.missionGUID} already exists.`
            );
          }

          //check if this campaign slot already has the same mission assigned, signifying that we are replacing it
          if (
            campaignSlot.structure.missionID === importedMission.missionGUID
          ) {
            // it exists, so we replace it
            replaceImportedMission(importedMission);
            onSnackBar("Imported Mission replaced successfully.", "success");
          } else {
            // it doesn't exist, so we add it
            const newRawData = new RawTranslationData(
              file.name,
              importedMission,
              "Mission"
            );
            addImportedMission(newRawData); //TODO: or add only the mission JSON
            onSnackBar("Imported Mission added successfully.", "success");
          }

          let hasCustomSetNextEventActions = false;
          //check if Mission has "Set Next Mission" Event Action
          if (
            importedMission.globalEvents &&
            importedMission.globalEvents.some((event) =>
              event.eventActions.some((action) => action.eventActionType === 27)
            )
          ) {
            hasCustomSetNextEventActions = true;
          }

          //lastly update the slot structure with the imported mission
          updateSlotStructure(selectedSlotIndex, {
            ...campaignSlot.structure,
            missionID: importedMission.missionGUID,
            customMissionIdentifier:
              importedMission.missionProperties.customMissionIdentifier,
            hasCustomSetNextEventActions: hasCustomSetNextEventActions,
            projectItem: {
              ...(campaignSlot.structure.projectItem || {}),
              Title: importedMission.missionProperties.missionName,
              missionGUID: importedMission.missionGUID,
            },
          });

          const newMissionItem = {
            GUID: importedMission.missionProperties.customMissionIdentifier,
            missionGUID: importedMission.missionGUID,
            customMissionIdentifier:
              importedMission.missionProperties.customMissionIdentifier,
            missionName: importedMission.missionProperties.missionName,
          };

          updateSlotMissionItem(selectedSlotIndex, newMissionItem);
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
  };

  const onTierChanged = (value) => {
    // Update the selected tier for the specific mission
    updateSlotStructure(selectedSlotIndex, {
      ...campaignSlot.structure,
      itemTier: value.split(", "),
    });
  };

  const handleCopyCustomMissionIdentifier = () => {
    if (campaignSlot === null || campaignSlot === undefined) {
      return; // Invalid index, do nothing
    }

    const identifier = campaignSlot.structure.customMissionIdentifier;

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

  const handleSetNextMissionEventAction = () => {
    if (campaignSlot === null || campaignSlot === undefined) {
      return; // Invalid index, do nothing
    }

    try {
      const slotMission = importedMissions.find(
        (raw) =>
          raw.translationData.missionGUID === campaignSlot.structure.missionID
      )?.translationData;
      // console.log(
      //   "❗ :: handleSetNextMissionEventAction :: slotMission::",
      //   slotMission
      // );

      if (slotMission) {
        const missionEvent = slotMission.globalEvents.find((event) =>
          event.eventActions.some((action) => action.eventActionType === 27)
        );
        // console.log(
        //   "❗ :: handleSetNextMissionEventAction :: missionEvent::",
        //   missionEvent
        // );

        if (missionEvent) {
          const missionEA = missionEvent.eventActions.find(
            (action) => action.eventActionType === 27
          );
          // console.log(
          //   "❗ :: handleSetNextMissionEventAction :: missionEA::",
          //   missionEA
          // );

          if (missionEA) {
            SetNextMissionDialog.ShowDialog(missionEA, (ea) => {
              // console.log("❗ :: handleSetNextMissionEventAction :: ea::", ea);
              updateImportedMissionNextEventAction(slotMission.missionGUID, ea);
              onSnackBar(
                "Set Next Mission Event Action updated successfully.",
                "success"
              );
            });
          }
        } else
          throw new Error(
            "No 'Set Next Mission' Event Action found in this Mission."
          );
      } else throw new Error("No Mission assigned to this slot");
    } catch (error) {
      onSnackBar(error, "success");
    }
  };

  return (
    <>
      <Paper
        sx={{
          backgroundColor: "#3c2a5b",
          padding: "1rem",
        }}
      >
        <div>
          {selectedSlotIndex === -1 ? (
            <div className="simple-row">
              {campaignSlots.length === 0 && (
                <p className="pink">Add Mission slots to begin.</p>
              )}
            </div>
          ) : (
            <>
              {/* ROW 1 */}
              {/* <Paper sx={{ backgroundColor: "#281b40", padding: "1rem" }}> */}
              <div className="simple-row center-items">
                <Typography>
                  {campaignSlot.structure.projectItem.Title}
                </Typography>
                {/* IMPORT MISSION */}
                <Tooltip title="Import Mission To This Slot" placement="top">
                  <IconButton
                    sx={{ color: "lime" }}
                    disabled={
                      campaignSlot === null || campaignSlot === undefined
                    }
                    component="label"
                    variant="contained"
                  >
                    <AddIcon />
                    <input
                      ref={fileInputRef}
                      hidden
                      accept="application/json"
                      type="file"
                      onChange={handleImportMission}
                    />
                  </IconButton>
                </Tooltip>

                {/* RESET TO PLAYER's CHOICE */}
                <Tooltip title="Reset To Player's Choice" placement="top">
                  <IconButton
                    sx={{ color: "orange" }}
                    disabled={
                      campaignSlot === null || campaignSlot === undefined
                    }
                    component="label"
                    variant="contained"
                    onClick={handleResetToPlayersChoice}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {/* </Paper> */}
              {/* ROW 2 */}
              <Paper
                sx={{
                  backgroundColor: "#281b40",
                  padding: "1rem",
                  marginTop: ".5rem",
                }}
              >
                <div className="flexible-row">
                  <div className="simple-row">
                    <FormControl>
                      <InputLabel id="tierSelect">Tier</InputLabel>
                      <Select
                        id="tierSelect"
                        name="tierSelect"
                        onChange={(e) => onTierChanged(e.target.value)}
                        value={campaignSlot.structure.itemTier.join(", ") || ""}
                        displayEmpty
                        sx={{ minWidth: "5rem" }}
                      >
                        {Object.keys(Tier).map((item, index) => (
                          <MenuItem key={index} value={Tier[item].join(", ")}>
                            {Tier[item].join(", ")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      label="Threat Level"
                      type="number"
                      minimum={0}
                      value={campaignSlot.structure.threatLevel}
                      onChange={(e) =>
                        updateSlotStructure(selectedSlotIndex, {
                          ...campaignSlot.structure,
                          threatLevel: Math.max(0, e.target.value),
                        })
                      }
                      sx={{ width: "7rem" }}
                    />
                  </div>
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isAgendaMission"
                          checked={campaignSlot.structure.isAgendaMission}
                          onChange={(e) =>
                            updateSlotStructure(selectedSlotIndex, {
                              ...campaignSlot.structure,
                              isAgendaMission: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Agenda Mission?"
                    />
                  </div>
                  <div>
                    <FormControl>
                      <InputLabel id="missiontype">Mission Type</InputLabel>
                      <Select
                        id="missiontype"
                        name="missiontype"
                        onChange={(e) =>
                          updateSlotStructure(selectedSlotIndex, {
                            ...campaignSlot.structure,
                            missionType: e.target.value,
                          })
                        }
                        value={campaignSlot.structure.missionType}
                        displayEmpty
                        sx={{ minWidth: "7rem" }}
                      >
                        {Object.keys(MissionType).map((item, index) => (
                          <MenuItem key={index} value={index}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Paper>
              {/* ROW 3 */}
              <div className="simple-row mt-1">
                <Accordion sx={{ width: "100%", backgroundColor: "#281b40" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Custom Mission Identifier</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      className="pink text-center"
                      sx={{ marginBottom: "1rem" }}
                    >
                      {campaignSlot.structure.customMissionIdentifier || "None"}
                    </Typography>

                    <Button
                      onClick={handleCopyCustomMissionIdentifier}
                      variant="contained"
                      disabled={!campaignSlot.structure.customMissionIdentifier}
                    >
                      Copy Custom Mission Identifier
                    </Button>

                    <hr style={{ width: "100%" }} />

                    <Button
                      onClick={handleSetNextMissionEventAction}
                      variant="contained"
                      disabled={
                        !campaignSlot.structure.hasCustomSetNextEventActions
                      }
                      sx={{ marginBottom: "1rem" }}
                    >
                      Edit &apos;Set Next Mission&apos; Event Action
                    </Button>

                    <Typography>
                      A Custom Mission Identifier is the ID that uniquely
                      identifies this Mission among all the others in the
                      Campaign. It is only used for setting the next Story
                      Mission in the &quot;Set Next Mission&quot; Event Action
                      within a Mission.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
              {/* ROW 4 */}
              <div className="simple-row mt-1">
                <Accordion sx={{ width: "100%", backgroundColor: "#281b40" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="event-container">
                      <Typography> Mission Translations </Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {campaignSlot.structure.missionID ===
                    "00000000-0000-0000-0000-000000000000" ? (
                      <div>
                        <Typography className="pink">
                          No Mission assigned to this slot.
                        </Typography>
                        <Typography>
                          Please assign a Mission to this slot to manage its
                          translations.
                        </Typography>
                      </div>
                    ) : (
                      <MissionTranslationUI
                        campaignSlot={campaignSlot}
                        slotIndex={selectedSlotIndex}
                        missionTitle={campaignSlot.structure.projectItem.Title}
                        onSnackBar={onSnackBar}
                      />
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </>
          )}
        </div>
      </Paper>

      <SetNextMissionDialog />
    </>
  );
};

export default MainPanel;

MainPanel.propTypes = {
  selectedSlotIndex: PropTypes.number.isRequired,
  onSnackBar: PropTypes.func.isRequired,
};
