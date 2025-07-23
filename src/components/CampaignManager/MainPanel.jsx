import { useState } from "react";
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
import Menu from "@mui/material/Menu";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
//components
import SetNextMissionDialog from "../EventActionDialogs/SetNextMissionDialog";
import NextMissionEAChooserDialog from "./NextMissionEAChooserDialog";
//data
import { Tier, MissionType } from "./CampaignData";
//state
import { useCampaignState } from "./CampaignState";
import { useRawCampaignDataState } from "./RawCampaignDataState";

const MainPanel = ({ selectedSlotIndex, onSnackBar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const popupOpen = Boolean(anchorEl);
  //state
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
  const updateImportedMissionNextEventAction = useRawCampaignDataState(
    (state) => state.updateImportedMissionNextEventAction
  );
  //state data arrays
  const importedMissions = useRawCampaignDataState(
    (state) => state.importedMissions
  );

  const campaignSlot = campaignSlots[selectedSlotIndex] || null;

  const handleResetToPlayersChoice = () => {
    if (campaignSlot === null || campaignSlot === undefined) {
      return; // Invalid index, do nothing
    }

    //reset the selected mission to "Player's Choice"
    resetCampaignSlot(selectedSlotIndex);
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
        (raw) => raw.missionGUID === campaignSlot.structure.missionID
      );

      if (slotMission) {
        const eventsWithEA27 = slotMission.globalEvents.filter((event) =>
          event.eventActions.some((action) => action.eventActionType === 27)
        );

        if (eventsWithEA27.length > 0) {
          NextMissionEAChooserDialog.ShowDialog(
            eventsWithEA27,
            (updateBlock) => {
              SetNextMissionDialog.ShowDialog(
                updateBlock.eventAction,
                (updatedEA) => {
                  // console.log("❗ :: updated EA :: ea::", updatedEA);
                  updateImportedMissionNextEventAction(
                    slotMission.missionGUID,
                    updateBlock.eventGUID,
                    updatedEA
                  );
                  onSnackBar(
                    "Set Next Mission Event Action updated successfully.",
                    "success"
                  );
                }
              );
            }
          );
        } else
          throw new Error(
            "No 'Set Next Mission' Event Action found in this Mission."
          );
      } else throw new Error("No Mission attached to this Campaign Slot.");
    } catch (error) {
      onSnackBar(`Error: ${error}`, "error");
    }
  };

  const handleAddMission = (mission) => {
    handlePopupClose();

    let hasCustomSetNextEventActions = false;
    //check if Mission has "Set Next Mission" Event Action
    if (
      mission.globalEvents &&
      mission.globalEvents.some((event) =>
        event.eventActions.some((action) => action.eventActionType === 27)
      )
    ) {
      hasCustomSetNextEventActions = true;
    }

    updateSlotStructure(selectedSlotIndex, {
      ...campaignSlot.structure,
      missionID: mission.missionGUID,
      customMissionIdentifier:
        mission.missionProperties.customMissionIdentifier,
      hasCustomSetNextEventActions: hasCustomSetNextEventActions,
      projectItem: {
        ...(campaignSlot.structure.projectItem || {}),
        Title: mission.missionProperties.missionName,
        missionGUID: mission.missionGUID,
      },
    });
    // Add the selected mission to the campaign slot
    updateSlotMissionItem(selectedSlotIndex, {
      GUID: mission.missionGUID,
      missionGUID: mission.missionGUID,
      customMissionIdentifier:
        mission.missionProperties.customMissionIdentifier,
      missionName: mission.missionProperties.missionName,
    });
  };

  const handlePopupClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopupClose = () => {
    setAnchorEl(null);
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
                <Typography>Add Mission slots to begin.</Typography>
              )}
            </div>
          ) : (
            <>
              {/* ROW 1 */}
              {campaignSlot && (
                <>
                  <div className="simple-row center-items">
                    <Typography>
                      {campaignSlot.structure.projectItem.Title ||
                        "No Mission Assigned"}
                    </Typography>
                    {/* IMPORT MISSION */}
                    <Tooltip title="Add A Mission To This Slot" placement="top">
                      <div>
                        <IconButton
                          sx={{ color: "lime" }}
                          disabled={
                            campaignSlot === null ||
                            campaignSlot === undefined ||
                            importedMissions.length === 0
                          }
                          component="label"
                          variant="contained"
                          onClick={handlePopupClick}
                        >
                          <AddIcon />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          anchorEl={anchorEl}
                          open={popupOpen}
                          onClose={handlePopupClose}
                          slotProps={{
                            paper: {
                              style: {
                                maxHeight: 300,
                                scrollbarColor: "#9ed9fe #4c4561",
                                scrollbarWidth: "thin",
                              },
                            },
                          }}
                        >
                          {importedMissions.map((mission) => (
                            <MenuItem
                              key={mission.missionGUID}
                              onClick={() => handleAddMission(mission)}
                            >
                              {mission.missionProperties.missionName}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
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
                </>
              )}

              {/* ROW 2 */}
              {campaignSlot && (
                <>
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
                            value={
                              campaignSlot.structure.itemTier.join(", ") || ""
                            }
                            displayEmpty
                            sx={{ minWidth: "5rem" }}
                          >
                            {Object.keys(Tier).map((item, index) => (
                              <MenuItem
                                key={index}
                                value={Tier[item].join(", ")}
                              >
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
                </>
              )}

              {/* ROW 3 */}
              {campaignSlot && (
                <>
                  <div className="simple-row mt-1">
                    <Accordion
                      sx={{ width: "100%", backgroundColor: "#281b40" }}
                    >
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
                          {campaignSlot.structure.customMissionIdentifier ||
                            "None"}
                        </Typography>

                        <Button
                          onClick={handleCopyCustomMissionIdentifier}
                          variant="contained"
                          disabled={
                            !campaignSlot.structure.customMissionIdentifier
                          }
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
                          Mission in the &quot;Set Next Mission&quot; Event
                          Action within a Mission.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Paper>

      <SetNextMissionDialog />
      <NextMissionEAChooserDialog />
    </>
  );
};

export default MainPanel;

MainPanel.propTypes = {
  selectedSlotIndex: PropTypes.number.isRequired,
  onSnackBar: PropTypes.func.isRequired,
};
