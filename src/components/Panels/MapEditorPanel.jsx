import { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
//data
import { EntityType } from "../../lib/core";
import { MapSection } from "../../data/Mission";
import { useMapSectionsStore, useMapEntitiesStore } from "../../data/dataStore";
//components
import MapEditor from "../SubComponents/MapEditor";
import { Tooltip, Typography } from "@mui/material";
//map components
import CrateProps from "../MapComponents/CrateProps";

//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!
//*****************TODO move entity store here instead of in the map editor!!!!!!!!!!!!

// Define components map outside the component to avoid recreating it on each render
const ENTITY_COMPONENTS = {
  [EntityType.Crate]: CrateProps,
};

export default function MapEditorPanel({ value, index }) {
  //map section store
  const mapSections = useMapSectionsStore((state) => state.mapSections);
  const setActiveMapSection = useMapSectionsStore(
    (state) => state.setActiveMapSection
  );
  const addSection = useMapSectionsStore((state) => state.addExistingSection);
  const activeMapSection = useMapSectionsStore(
    (state) => state.activeMapSection
  );
  //map entity store
  const mapEntities = useMapEntitiesStore((state) => state.mapEntities);

  const [selectedEntity, setSelectedEntity] = useState(null);
  const mapRef = useRef(null);
  // const [refresh, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (mapRef.current && selectedEntity) {
      mapRef.current.selectMapEntity(selectedEntity.GUID);
    }
  });

  //called by the entity component to update the entity
  const updateEntity = useCallback((entity) => {
    console.log("🚀 ~ updateEntity ~ entity:", entity);
    // setSelectedEntity(entity);
    mapRef.current.updateMapEntity(entity);
    // forceUpdate();
  }, []);

  const handleEntitySelect = useCallback((entity) => {
    console.log("🚀 ~ handleEntitySelect ~ entity:", entity);
    let selected = mapEntities.find((x) => x.GUID === entity.GUID);
    if (selected) {
      setSelectedEntity(selected);
    } else setSelectedEntity(null);
  }, [ mapEntities ]);

  const handleRemoveEntity = () => {
    // console.log("🚀 ~ handleRemoveEntity ~ mapRef.current:", mapRef.current);
    if (selectedEntity !== null) {
      // console.log("🚀 ~ handleRemoveEntity ~ selectedEntity:", selectedEntity);
      mapRef.current.removeMapEntity(selectedEntity);
      setSelectedEntity(null);
    }
  };

  const entityPropsChooser = useCallback(() => {
    console.log("🚀 ~ entityPropsChooser ~ entityPropsChooser", selectedEntity);
    if (selectedEntity === null) {
      return (
        <>
          <Typography>Select an entity to view its properties.</Typography>
        </>
      );
    }

    const EntityComponent = ENTITY_COMPONENTS[selectedEntity.entityType];

    if (!EntityComponent) {
      return null;
    }

    return (
      <EntityComponent
        // key={refresh}
        entity={selectedEntity}
        onUpdateEntity={updateEntity}
      />
    );
  }, [selectedEntity, updateEntity]);

  function addMapSection() {
    let newSection = new MapSection();
    newSection.name = "New Map Section";
    addSection(newSection);
    setActiveMapSection(newSection);
  }

  return (
    <div
      hidden={value !== index}
      id={`tabpanel-${index}`}
      style={{ height: "100%" }}
    >
      {value === index && (
        <div className="map-panel">
          {/* LEFT */}
          <Paper sx={{ padding: "1rem", height: "100%" }}>
            <div
              style={{
                height: "100%",
                width: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <MapEditor
                ref={mapRef}
                onSelectEntity={handleEntitySelect}
                //onUpdateEntityPosition={handleUpdateEntityPosition}
              />
            </div>
          </Paper>

          {/* RIGHT */}
          {/* TODO make right side a component */}
          <div className="map-props">
            <Paper
              sx={{
                padding: ".5rem",
                overflow: "auto",
                height: "100%",
                scrollbarColor: "#bc56ff #4c4561",
                scrollbarWidth: "thin",
              }}
            >
              <Accordion
                defaultExpanded
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1-header"
                >
                  Entity Actions
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: ".5rem",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ width: "100%" }}
                      disabled={selectedEntity === null}
                    >
                      Add Duplicate
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ color: "red", width: "100%" }}
                      disabled={selectedEntity === null}
                      onClick={handleRemoveEntity}
                    >
                      remove selected
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1-header"
                >
                  Map Sections
                </AccordionSummary>
                <AccordionDetails>
                  <div className="simple-column">
                    <div className="event-container">
                      <FormControl>
                        <InputLabel>Set Active Map Section</InputLabel>
                        <Select
                          name="mapSections"
                          value={activeMapSection || ""}
                          displayEmpty
                          sx={{ width: "100%" }}
                          onChange={(e) => setActiveMapSection(e.target.value)}
                        >
                          {mapSections.map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Tooltip title="Add New Map Section">
                        <IconButton onClick={addMapSection}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </div>

                    <Tooltip title="Change The Active Map Section To The Selected Entity's Map Section Owner">
                      <span>
                        <Button
                          variant="contained"
                          sx={{ width: "100%" }}
                          disabled={selectedEntity === null}
                        >
                          change active map section
                        </Button>
                      </span>
                    </Tooltip>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1-header"
                >
                  Tiles
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
              </Accordion>

              <Accordion
                defaultExpanded
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1-header"
                >
                  Entities
                </AccordionSummary>
                <AccordionDetails>
                  <div className="simple-column .scrollbar">
                    <List
                      sx={{
                        maxHeight: "15rem",
                        overflow: "hidden auto",
                        scrollbarColor: "#bc56ff #4c4561",
                        scrollbarWidth: "thin",
                        padding: "0",
                      }}
                    >
                      {mapEntities.map((entity, index) => (
                        <ListItem disablePadding key={index}>
                          <ListItemButton
                            selected={selectedEntity?.GUID === entity.GUID}
                            onClick={() => handleEntitySelect(entity)}
                            onDoubleClick={() => handleEntitySelect(entity)}
                          >
                            {entity.name}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                defaultExpanded
                sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1-header"
                >
                  Selected Entity Properties
                </AccordionSummary>
                <AccordionDetails>{entityPropsChooser()}</AccordionDetails>
              </Accordion>
            </Paper>
          </div>
        </div>
      )}
    </div>
  );
}

MapEditorPanel.propTypes = {
  value: PropTypes.number,
  index: PropTypes.number,
};
