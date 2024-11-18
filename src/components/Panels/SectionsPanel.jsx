import { useState } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//dialogs
import ConfirmSectionRemoveDialog from "../Dialogs/ConfirmSectionRemoveDialog";
//data
import { useMapSectionsStore } from "../../data/dataStore";

export default function SectionsPanel({ value, index }) {
  const mapSections = useMapSectionsStore((state) => state.mapSections);
  const modifySection = useMapSectionsStore((state) => state.modifySection);
  const removeSection = useMapSectionsStore((state) => state.removeSection);

  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [checked, setChecked] = useState(
    mapSections[0].invisibleUntilActivated
  );
  const [sectionName, setSectionName] = useState(mapSections[0].name);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onCheckInvisible(checked) {
    modifySection({
      GUID: mapSections[selectedSectionIndex].GUID,
      prop: "invisibleUntilActivated",
      value: checked,
    });
    setChecked(checked);
  }

  function onChangeName(name) {
    if (name.trim() !== "") {
      modifySection({
        GUID: mapSections[selectedSectionIndex].GUID,
        prop: "name",
        value: name,
      });
      setSectionName(name);
    } else setSectionName(mapSections[selectedSectionIndex].name);
  }

  function onRemoveSection() {
    ConfirmSectionRemoveDialog.ShowDialog(
      mapSections[selectedSectionIndex].name,
      () => {
        removeSection(mapSections[selectedSectionIndex].GUID);
        //reset to default data
        setSelectedSectionIndex(0);
        setChecked(mapSections[0].invisibleUntilActivated);
        setSectionName(mapSections[0].name);
      }
    );
  }

  function onChangeSelectedSection(index) {
    setSelectedSectionIndex(index);
    setChecked(mapSections[index].invisibleUntilActivated);
    setSectionName(mapSections[index].name);
  }

  return (
    <div>
      <div hidden={value !== index} id={`tabpanel-${index}`}>
        {value === index && (
          <div className="mission-panel">
            {/* LEFT SIDE */}
            <Paper sx={{ padding: "1rem" }}>
              <List>
                {mapSections.map((item, index) => (
                  <ListItem disablePadding key={index}>
                    <ListItemButton
                      selected={selectedSectionIndex === index}
                      onClick={() => onChangeSelectedSection(index)}
                    >
                      {item.name}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* RIGHT SIDE */}
            <Paper sx={{ padding: "1rem" }}>
              <Accordion
                defaultExpanded
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionSummary id="panel1-header">
                  Selected Map Section Properties
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label={"Map Section Name"}
                    variant="filled"
                    value={sectionName}
                    onBlur={(e) => onChangeName(e.target.value)}
                    onChange={(e) => setSectionName(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onKeyUp={onKeyUp}
                    fullWidth
                    sx={{ marginBottom: ".5rem" }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="factionImperial"
                        checked={checked}
                        onChange={(e) => onCheckInvisible(e.target.checked)}
                      />
                    }
                    label="Invisible Until Activated"
                  />
                  <div className="two-column-grid">
                    <Typography>Tile Count</Typography>
                    <Typography>1</Typography>
                  </div>
                  <div className="two-column-grid">
                    <Typography>Map Entity Count</Typography>
                    <Typography>1</Typography>
                  </div>
                  <hr />
                  <Button
                    variant="contained"
                    onClick={onRemoveSection}
                    color="error"
                    disabled={selectedSectionIndex === 0}
                    startIcon={<DeleteIcon />}
                  >
                    Remove Map Section...
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </div>
        )}
      </div>

      <ConfirmSectionRemoveDialog />
    </div>
  );
}

SectionsPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
