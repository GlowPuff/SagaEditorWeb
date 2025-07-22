import PropTypes from "prop-types";
//mui
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
//icons
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//components
import MainPanel from "./MainPanel";
//state
import { useCampaignState } from "./CampaignState";
// import { useRawCampaignDataState } from "./RawCampaignDataState";
//data
import { MissionType } from "./CampaignData";

const StructureLayout = ({
  onSnackBar,
  selectedMissionIndex,
  setSelectedMissionIndex,
}) => {
  //state
  const campaignSlots = useCampaignState((state) => state.campaignSlots);
  const addCampaignSlot = useCampaignState((state) => state.addCampaignSlot);
  const removeCampaignSlot = useCampaignState(
    (state) => state.removeCampaignSlot
  );
  const moveSlotUp = useCampaignState((state) => state.moveSlotUp);
  const moveSlotDown = useCampaignState((state) => state.moveSlotDown);

  const handleAddSlot = () => {
    addCampaignSlot();
    setSelectedMissionIndex(campaignSlots.length);
  };

  const handleRemoveSlot = () => {
    if (
      selectedMissionIndex < 0 ||
      selectedMissionIndex >= campaignSlots.length
    ) {
      return; // Invalid index, do nothing
    }

    //remove the campaign slot
    removeCampaignSlot(selectedMissionIndex);

    if (selectedMissionIndex === 0 && campaignSlots.length - 1 > 0) {
      // If the first slot is removed and there are more slots, select the next one
      setSelectedMissionIndex(0);
    } else if (selectedMissionIndex === campaignSlots.length - 1) {
      // If the last slot is removed, select the previous one if it exists
      setSelectedMissionIndex(selectedMissionIndex - 1);
    } else {
      // If a middle slot is removed, keep the current selection
      setSelectedMissionIndex(selectedMissionIndex);
    }
  };

  const handleMoveSlotUp = () => {
    if (
      selectedMissionIndex <= 0 ||
      selectedMissionIndex >= campaignSlots.length
    ) {
      return; // Invalid index, do nothing
    }

    moveSlotUp(selectedMissionIndex);
    setSelectedMissionIndex(selectedMissionIndex - 1);
  };

  const handleMoveSlotDown = () => {
    if (
      selectedMissionIndex < 0 ||
      selectedMissionIndex >= campaignSlots.length - 1
    ) {
      return; // Invalid index, do nothing
    }

    moveSlotDown(selectedMissionIndex);
    setSelectedMissionIndex(selectedMissionIndex + 1);
  };

  return (
    <div
      style={{
        // overflow: "hidden",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Paper
        sx={{
          backgroundColor: "#281b40",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "1rem",
        }}
      >
        <Typography sx={{ paddingBottom: "1rem" }}>
          Campaign Structure
        </Typography>
        <div
          style={{
            overflow: "hidden",
          }}
        >
          <div className="structure-layout">
            {/* LEFT */}
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
                {campaignSlots.map((slot, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    onClick={() => setSelectedMissionIndex(index)}
                  >
                    <ListItemButton
                      selected={selectedMissionIndex === index}
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
                          <Typography>
                            [
                            <span className="pink">
                              {
                                Object.keys(MissionType)[
                                  slot.structure.missionType
                                ]
                              }
                            </span>
                            ]
                          </Typography>
                          <Typography>
                            {slot.structure.projectItem.Title}
                          </Typography>
                        </div>
                        <div className="structure-item-row">
                          <Typography variant="subtitle2">
                            Tier: {slot.structure.itemTier.join(", ")}
                          </Typography>
                          <Typography className="red" variant="subtitle2">
                            Threat: {slot.structure.threatLevel}
                          </Typography>
                          <Typography variant="subtitle2">
                            Agenda Mission:
                            <span
                              style={{
                                color: slot.structure.isAgendaMission
                                  ? "lime"
                                  : "red",
                              }}
                            >
                              {slot.structure.isAgendaMission ? " Yes" : " No"}
                            </span>
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
                <Tooltip title="Add Mission Slot" placement="right">
                  <IconButton
                    component="label"
                    variant="contained"
                    onClick={handleAddSlot}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>

                {/* REMOVE SLOT */}
                <Tooltip title="Remove Mission Slot" placement="right">
                  <IconButton
                    sx={{ color: "red" }}
                    disabled={selectedMissionIndex === -1}
                    component="label"
                    variant="contained"
                    onClick={handleRemoveSlot}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>

                {/* MOVE UP */}
                <Tooltip title="Move Mission Slot Up" placement="right">
                  <IconButton
                    sx={{ color: "yellow" }}
                    disabled={selectedMissionIndex === -1}
                    component="label"
                    variant="contained"
                    onClick={handleMoveSlotUp}
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                </Tooltip>

                {/* MOVE DOWN */}
                <Tooltip title="Move Mission Slot Down" placement="right">
                  <IconButton
                    sx={{ color: "yellow" }}
                    disabled={selectedMissionIndex === -1}
                    component="label"
                    variant="contained"
                    onClick={handleMoveSlotDown}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>

            {/* RIGHT */}
            <MainPanel
              selectedSlotIndex={selectedMissionIndex}
              onSnackBar={onSnackBar}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default StructureLayout;

StructureLayout.propTypes = {
  onSnackBar: PropTypes.func.isRequired,
  selectedMissionIndex: PropTypes.number.isRequired,
  setSelectedMissionIndex: PropTypes.func.isRequired,
};
