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
import SquareIcon from "@mui/icons-material/Square";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ComputerIcon from "@mui/icons-material/Computer";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TokenIcon from "@mui/icons-material/Token";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
//data
import { EntityType } from "../../lib/core";
import {
  MapSection,
  CrateEntity,
  TerminalEntity,
  DoorEntity,
} from "../../data/Mission";
import { useMapSectionsStore, useMapEntitiesStore } from "../../data/dataStore";
//components
import MapEditor from "../SubComponents/MapEditor";
import { Tooltip, Typography } from "@mui/material";
//map components
import CrateProps from "../MapComponents/CrateProps";

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
  const addMapEntity = useMapEntitiesStore((state) => state.addEntity);
  const updateMapEntityPosition = useMapEntitiesStore(
    (state) => state.updateEntityPosition
  );
  const rotateMapEntity = useMapEntitiesStore((state) => state.rotateEntity);
  const removeMapEntity = useMapEntitiesStore((state) => state.removeEntity);
  const updateMapEntity = useMapEntitiesStore((state) => state.updateEntity);
  //state
  const [selectedEntity, setSelectedEntity] = useState(null);
  //refs
  const mapRef = useRef(null);
  const isProcessingRef = useRef(false);

  //select the entity in the map on mount
  useEffect(() => {
    if (mapRef.current && selectedEntity) {
      mapRef.current.selectMapEntity(selectedEntity.GUID);
    }
  });

  //******** toolbar actions
  const centerMap = useCallback(() => {
    mapRef.current.centerMap();
  }, []);

  const centerEntity = useCallback(() => {
    if (selectedEntity !== null) {
      mapRef.current.centerEntity(selectedEntity);
    }
  }, [selectedEntity]);

  const addCrateEntity = useCallback(() => {
    let newEntity = new CrateEntity(activeMapSection.GUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSection, addMapEntity]);

  const addTerminalEntity = useCallback(() => {
    let newEntity = new TerminalEntity(activeMapSection.GUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSection, addMapEntity]);

  const addDoorEntity = useCallback(() => {
    let newEntity = new DoorEntity(activeMapSection.GUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSection, addMapEntity]);

  const handleEntitySelect = useCallback(
    (entityGUID) => {
      // console.log("🚀 ~ handleEntitySelect ~ entityGUID:", entityGUID);
      let selected = mapEntities.find((x) => x.GUID === entityGUID);
      // console.log("🚀 ~ MapEditorPanel ~ selected:", selected);
      if (selected) {
        setSelectedEntity(selected);
        //select it in the map
        mapRef.current.selectMapEntity(selected.GUID);
      } else setSelectedEntity(null);
    },
    [mapEntities]
  );

  //setup keyboard handler
  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      e.stopPropagation();

      if (isProcessingRef.current) {
        return;
      }

      // Handle the combos
      if (e.ctrlKey && e.key === "m") {
        isProcessingRef.current = true;
        console.log("🚀 ~ centerMap");
        centerMap();
      }
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        console.log("🚀 ~ centerEntity");
        isProcessingRef.current = true;
        centerEntity();
      }
      if (e.ctrlKey && e.key === "2") {
        e.preventDefault();
        isProcessingRef.current = true;
        addCrateEntity();
      }
      if (e.ctrlKey && e.key === "3") {
        e.preventDefault();
        isProcessingRef.current = true;
        addTerminalEntity();
      }
      if (e.ctrlKey && e.key === "4") {
        e.preventDefault();
        isProcessingRef.current = true;
        addDoorEntity();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        isProcessingRef.current = true;
        mapRef.current.removeMapEntity(selectedEntity.GUID);
        removeMapEntity(selectedEntity.GUID);
        handleEntitySelect(null);
      }
      if (e.key === "[" && selectedEntity) {
        if (selectedEntity.entityType === EntityType.Door)
          rotateMapEntity(selectedEntity.GUID, -1);
      }
      if (e.key === "]" && selectedEntity) {
        if (selectedEntity.entityType === EntityType.Door)
          rotateMapEntity(selectedEntity.GUID, 1);
      }
    };

    const handleKeyUp = () => {
      isProcessingRef.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    //cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    centerEntity,
    centerMap,
    addCrateEntity,
    addTerminalEntity,
    addDoorEntity,
    handleEntitySelect,
    rotateMapEntity,
    removeMapEntity,
    selectedEntity,
  ]);

  //called by the entity component to update the entity
  const updateEntity = useCallback(
    (entity) => {
      // console.log("🚀 ~ updateEntity ~ entity:", entity);
      updateMapEntity(entity);
      setSelectedEntity(entity);
    },
    [updateMapEntity]
  );

  const handleRemoveEntity = () => {
    // console.log("🚀 ~ handleRemoveEntity ~ mapRef.current:", mapRef.current);
    if (selectedEntity !== null) {
      // console.log("🚀 ~ handleRemoveEntity ~ selectedEntity:", selectedEntity);
      mapRef.current.removeMapEntity(selectedEntity.GUID);
      removeMapEntity(selectedEntity.GUID);
      handleEntitySelect(null);
    }
  };

  const handleUpdateEntityPosition = useCallback(
    (entityGUID, position) => {
      // console.log(
      //   "🚀 ~ handleUpdateEntityPosition ~ entityGUID, position",
      //   entityGUID,
      //   position
      // );
      updateMapEntityPosition(entityGUID, position);
    },
    [updateMapEntityPosition]
  );

  const entityPropsChooser = useCallback(() => {
    if (selectedEntity === null) {
      console.log("🚀 ~ entityPropsChooser ~ NOTHING SELECTED");
      return (
        <>
          <Typography>Select an entity to view its properties.</Typography>
        </>
      );
    }

    // console.log("🚀 ~ entityPropsChooser: ", selectedEntity.name);
    const EntityComponent = ENTITY_COMPONENTS[selectedEntity.entityType];

    if (!EntityComponent) {
      return null;
    }

    return (
      <EntityComponent
        key={selectedEntity.GUID}
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
                mapEntities={mapEntities}
                onSelectEntity={handleEntitySelect}
                addEntity={addMapEntity}
                onUpdateEntityPosition={handleUpdateEntityPosition}
              >
                {/* actions toolbar */}
                <div className="mapToolBar">
                  <Tooltip title="Add a Tile (Control + 1)" placement="right">
                    <IconButton>
                      <SquareIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add a Crate (Control + 2)" placement="right">
                    <IconButton onClick={addCrateEntity}>
                      <Inventory2Icon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Add a Terminal (Control + 3)"
                    placement="right"
                  >
                    <IconButton onClick={addTerminalEntity}>
                      <ComputerIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add a Door (Control + 4)" placement="right">
                    <IconButton onClick={addDoorEntity}>
                      <DoorSlidingIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Add a Deployment Point (Control + 5)"
                    placement="right"
                  >
                    <IconButton>
                      <PersonAddIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Add a Mission Marker (Control + 6)"
                    placement="right"
                  >
                    <IconButton>
                      <TokenIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Add a Space Highlight (Control + 7)"
                    placement="right"
                  >
                    <IconButton>
                      <PriorityHighIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>

                  <div className="mapToolBarDivider"></div>

                  <Tooltip title="Center Map (Control + M)" placement="right">
                    <IconButton onClick={centerMap}>
                      <GpsFixedIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Center Selected Entity (Control + E)"
                    placement="right"
                  >
                    <IconButton onClick={centerEntity}>
                      <ModeStandbyIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </div>

                {/* hotkey toolbar */}
                <div className="hotkeyToolBar">
                  <div className="hotkeyItem" style={{ marginLeft: "auto" }}>
                    <Typography variant="button">Ctrl + T</Typography>
                    <div className="hotkeyDefinition">Add Tile</div>
                  </div>

                  <FiberManualRecordIcon
                    sx={{ width: "10px", height: "10px", color: "#702da0" }}
                  />

                  <div className="hotkeyItem">
                    <Typography variant="button">Ctrl + Shift + D</Typography>
                    <div className="hotkeyDefinition">
                      Duplicate Selected Entity
                    </div>
                  </div>

                  <FiberManualRecordIcon
                    sx={{ width: "10px", height: "10px", color: "#702da0" }}
                  />

                  <div className="hotkeyItem" style={{ marginRight: "auto" }}>
                    <Typography variant="button">Ctrl + Shift + X</Typography>
                    <div className="hotkeyDefinition">
                      Delete Selected Entity
                    </div>
                  </div>
                </div>
              </MapEditor>
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
                            onClick={() => handleEntitySelect(entity.GUID)}
                            onDoubleClick={() =>
                              handleEntitySelect(entity.GUID)
                            }
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
