import { useState, useEffect } from "react";
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
import { useMapSectionsStore, useMapEntitiesStore } from "../../data/dataStore";

export default function SectionsPanel({ value, index }) {
  //map section store
  const mapSections = useMapSectionsStore((state) => state.mapSections);
  const addSection = useMapSectionsStore((state) => state.addSection);
  const modifySection = useMapSectionsStore((state) => state.modifySection);
  const removeSection = useMapSectionsStore((state) => state.removeSection);
  const setActiveMapSectionGUID = useMapSectionsStore(
    (state) => state.setActiveMapSectionGUID
  );
  const activeMapSectionGUID = useMapSectionsStore(
    (state) => state.activeMapSectionGUID
  );
  //entities store
  const mapEntities = useMapEntitiesStore((state) => state.mapEntities);
  const updateEntity = useMapEntitiesStore((state) => state.updateEntity);

  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [checked, setChecked] = useState(
    mapSections[0].invisibleUntilActivated
  );
  const [sectionName, setSectionName] = useState(mapSections[0].name);

  useEffect(() => {
    if (mapSections.length === 1) {
      setSelectedSectionIndex(0);
      setChecked(mapSections[0].invisibleUntilActivated);
      setSectionName(mapSections[0].name);
      setActiveMapSectionGUID(mapSections[0].GUID);
    }
  }, [mapSections, setActiveMapSectionGUID]);

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

  function onAddSection() {
    addSection("New Map Section");
    setSelectedSectionIndex(mapSections.length);
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
        //if active section is being removed, set active section to start section
        if (mapSections[selectedSectionIndex].GUID === activeMapSectionGUID) {
          // console.log("🚀 ~ onRemoveSection ~ UPDATING ACTIVE SECTION");
          setActiveMapSectionGUID(mapSections[0].GUID);
        }
        //if any map entities are in the removed section, set their owner to the start section
        mapEntities.forEach((entity) => {
          if (
            entity.mapSectionOwner === mapSections[selectedSectionIndex].GUID
          ) {
            let updated = { ...entity };
            updated.mapSectionOwner = mapSections[0].GUID;
            // console.log("🚀 ~ mapEntities.forEach ~ updated:", updated)
            updateEntity(updated);
          }
        });
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
              <Button
                variant="contained"
                onClick={() => onAddSection()}
                fullWidth
                sx={{
                  marginBottom: ".5rem",
                }}
              >
                add map section
              </Button>

              <Accordion
                defaultExpanded
                sx={{
                  marginBottom: ".5rem",
                  backgroundColor: "#281b40",
                }}
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
                    <Typography>
                      {mapSections[selectedSectionIndex]?.mapTiles.length}
                    </Typography>
                  </div>
                  <div className="two-column-grid">
                    <Typography>Map Entity Count</Typography>
                    <Typography>
                      {
                        mapEntities.filter(
                          (x) =>
                            x.mapSectionOwner ===
                            mapSections[selectedSectionIndex].GUID
                        ).length
                      }
                    </Typography>
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
