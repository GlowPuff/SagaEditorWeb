import { useState, useRef } from "react";
//mui
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
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

export default function InstructionTranslationDialog() {
  const [open, setOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState(null); //TranslationItem
  const callbackFunc = useRef(null);
  const fileInputRef = useRef(null); // Add this line
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
  const addInstructionTranslation = useCampaignState(
    (state) => state.addInstructionTranslation
  );
  const removeInstructionTranslation = useCampaignState(
    (state) => state.removeInstructionTranslation
  );
  const translations = useCampaignState(
    (state) => state.instructionTranslations
  );

  const onSnackBar = useRef(null);

  function showDialog(snackbarFunc, callback) {
    callbackFunc.current = callback;
    onSnackBar.current = snackbarFunc;
    setSelectedTranslation(null);
    setOpen(true);
  }
  InstructionTranslationDialog.ShowDialog = showDialog;

  function onOK() {
    if (typeof callbackFunc.current === "function") callbackFunc.current();
    setOpen(false);
  }

  function handleImportTranslation(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.match("text/plain")) {
        onSnackBar.current("Only TXT files are allowed.", "error");
        // Reset the input even when there's an error
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // Check if a translation with the same file name already exists
        if (translationIDs.includes(file.name)) {
          onSnackBar.current(
            `A translation with the file name ${file.name} already exists.`,
            "error"
          );
          // Reset the input even when there's an error
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }

        const data = new RawTranslationData(
          file.name, // Use the file name as the identifier
          e.target.result, // The content of the file
          TranslationType.Instruction // Set the type to Instruction
        );
        addTranslationData(data);

        const newTranslation = new TranslationItem();
        newTranslation.fileName = file.name;

        addInstructionTranslation(newTranslation);
        setSelectedTranslation(newTranslation);
      };
      fileReader.readAsText(file);

      // Reset the input after processing
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleRemoveTranslation = () => {
    if (selectedTranslation === null) {
      return;
    }

    removeInstructionTranslation(selectedTranslation.fileName);
    removeTranslationData(selectedTranslation.fileName);
    setSelectedTranslation(null);
  };

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
          <DialogTitle>Campaign Instruction Translations</DialogTitle>
          <DialogContent>
            <Typography>
              Translated Campaign Instructions are simple text files (.txt). Use
              the following naming convention:
            </Typography>
            <Typography className="pink">
              <strong>instructions_[LANGUAGE-ID].txt</strong>
            </Typography>
            <p className="mt-1">
              For example, a German translation would be named:
              <br />
              <strong className="pink">instructions_DE.txt</strong>
            </p>

            <Paper
              sx={{
                backgroundColor: "#281b40",
                padding: "1rem",
              }}
            >
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
                  {translations.map((translation, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      onClick={() => setSelectedTranslation(translation)}
                    >
                      <ListItemButton
                        selected={
                          selectedTranslation !== null &&
                          selectedTranslation?.fileName ===
                            translation?.fileName
                        }
                      >
                        {translation.fileName}
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {translations.length === 0 && (
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
                    <Tooltip
                      title="Add Instructions Translation"
                      placement="right"
                    >
                      <IconButton component="label" variant="contained">
                        <AddIcon />
                        <input
                          ref={fileInputRef}
                          hidden
                          accept="text/plain"
                          type="file"
                          onChange={handleImportTranslation}
                        />
                      </IconButton>
                    </Tooltip>
                    {/* REMOVE */}
                    <Tooltip
                      title="Remove Instructions Translation"
                      placement="right"
                    >
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
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={onOK} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
