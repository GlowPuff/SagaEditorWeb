import { useState, useRef } from "react";
import PropTypes from "prop-types";
//mui
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
//icons
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
//data
import {
  TranslationItem,
  RawTranslationData,
  TranslationType,
} from "./CampaignData";
//state
import { useRawCampaignDataState } from "./RawCampaignDataState";
import { useCampaignState } from "./CampaignState";

//campaignSlot is CampaignStructure
const MissionTranslationUI = ({
  campaignSlot,
  slotIndex,
  missionTitle,
  onSnackBar,
}) => {
  const fileInputRef = useRef(null); // Add this line
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  //state
  const addTranslationData = useRawCampaignDataState(
    (state) => state.addTranslationData
  );
  const removeTranslationData = useRawCampaignDataState(
    (state) => state.removeTranslationData
  );
  const translationIDs = useRawCampaignDataState(
    (state) => state.translationIDs
  );
  const addSlotTranslation = useCampaignState(
    (state) => state.addSlotTranslation
  );
  const removeSlotTranslation = useCampaignState(
    (state) => state.removeSlotTranslation
  );

  const handleImportTranslation = (event) => {
    if (event.target.files && event.target.files[0]) {
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
        const newTranslation = new TranslationItem();
        try {
          // Check if a translation with the same file name already exists
          if (translationIDs.includes(file.name)) {
            throw new Error(
              "A translation with this file name already exists."
            );
          }

          const importedData = JSON.parse(e.target.result);
          // Validate the imported data structure
          const expectedKeys = [
            "languageID",
            "missionProperties",
            "events",
            "mapEntities",
            "initialGroups",
          ];
          if (
            !importedData ||
            typeof importedData !== "object" ||
            !expectedKeys.every((key) =>
              Object.prototype.hasOwnProperty.call(importedData, key)
            )
          ) {
            throw new Error(
              "Invalid JSON format in the file. Make sure this is a Mission Translation."
            );
          }
          newTranslation.fileName = file.name;
          newTranslation.assignedMissionName = missionTitle;
          newTranslation.isInstruction = false;
          newTranslation.assignedMissionGUID = campaignSlot.structure.missionID;
          //newTranslation.languageID = importedData.languageID || "English (EN)";

          addSlotTranslation(slotIndex, newTranslation);
          setSelectedTranslation(newTranslation);

          const data = new RawTranslationData(
            file.name, // Use the file name as the identifier
            importedData, // The content of the file
            TranslationType.Mission // Set the type to Mission
          );
          addTranslationData(data);
        } catch (error) {
          // setAlertMessage(`Invalid JSON format in the file: ${error}`);
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

  const handleRemoveTranslation = () => {
    if (selectedTranslation) {
      removeSlotTranslation(slotIndex, selectedTranslation.fileName);
      removeTranslationData(selectedTranslation.fileName);
      setSelectedTranslation(null);
    }
  };

  return (
    <>
      <Typography>
        Make sure your Mission translations have the proper language set.
      </Typography>
      <div className="instructions-layout">
        {/* LEFT */}
        <List
          sx={{
            height: "100%",
            overflow: "auto",
            scrollbarColor: "#bc56ff #4c4561",
            scrollbarWidth: "thin",
            width: "min-fit",
          }}
        >
          {campaignSlot.translationItems.map((translation, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={() => setSelectedTranslation(translation)}
            >
              <ListItemButton
                selected={
                  selectedTranslation !== null &&
                  selectedTranslation?.fileName === translation?.fileName
                }
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography>{translation.fileName}</Typography>
                  <Typography variant="caption" className="pink">
                    {translation.assignedMissionName}
                  </Typography>
                  {/* <Typography variant="caption" className="pink">
                    {translation.languageID}
                  </Typography> */}
                </div>
              </ListItemButton>
            </ListItem>
          ))}
          {campaignSlot.translationItems.length === 0 && (
            <Typography className="pink" align="center">
              No translations added.
            </Typography>
          )}
        </List>

        {/* RIGHT */}
        <Paper
          sx={{
            backgroundColor: "#3c2a5b",
            padding: ".5rem",
            height: "100%",
          }}
        >
          <div className="structure-middle">
            {/* ADD */}
            <Tooltip title="Add Instructions Translation" placement="right">
              <IconButton component="label" variant="contained">
                <AddIcon />
                <input
                  ref={fileInputRef}
                  hidden
                  accept="application/json"
                  type="file"
                  onChange={handleImportTranslation}
                />
              </IconButton>
            </Tooltip>
            {/* REMOVE */}
            <Tooltip title="Remove Instructions Translation" placement="right">
              <IconButton
                disabled={selectedTranslation === null}
                sx={{ color: "red" }}
                component="label"
                variant="contained"
                onClick={handleRemoveTranslation}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default MissionTranslationUI;

MissionTranslationUI.propTypes = {
  campaignSlot: PropTypes.object.isRequired,
  slotIndex: PropTypes.number.isRequired,
  missionTitle: PropTypes.string.isRequired,
  onSnackBar: PropTypes.func.isRequired,
};
