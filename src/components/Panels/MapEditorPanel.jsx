import { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Button from "@mui/material/Button";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import List from "@mui/material/List";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItem from "@mui/material/ListItem";
// import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
//icons
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import AddIcon from "@mui/icons-material/Add";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
//data
import { EntityType } from "../../lib/core";
import {
  MapSection,
  CrateEntity,
  TerminalEntity,
  DoorEntity,
  DeploymentPointEntity,
  TokenEntity,
  HighlightEntity,
} from "../../data/Mission";
import { useMapSectionsStore, useMapEntitiesStore } from "../../data/dataStore";
//components
import MapEditor from "../SubComponents/MapEditor";
//map components
// import CrateProps from "../MapComponents/CrateProps";
import MapActionsToolbar from "../MapComponents/MapActionsToolbar";
import MapPropsPanel from "../MapComponents/MapPropsPanel";


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

  const addDPEntity = useCallback(() => {
    let newEntity = new DeploymentPointEntity(activeMapSection.GUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSection, addMapEntity]);

  const addMarkerEntity = useCallback(() => {
    let newEntity = new TokenEntity(activeMapSection.GUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSection, addMapEntity]);

  const addHighlightEntity = useCallback(() => {
    let newEntity = new HighlightEntity(activeMapSection.GUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSection, addMapEntity]);

  const handleToolbarAction = useCallback(
    (action) => {
      switch (action) {
        case "addCrateEntity":
          addCrateEntity();
          break;
        case "addTerminalEntity":
          addTerminalEntity();
          break;
        case "addDoorEntity":
          addDoorEntity();
          break;
        case "addDPEntity":
          addDPEntity();
          break;
        case "addMarkerEntity":
          addMarkerEntity();
          break;
        case "addHighlightEntity":
          addHighlightEntity();
          break;
        case "centerMap":
          centerMap();
          break;
        case "centerEntity":
          centerEntity();
          break;
      }
    },
    [
      addCrateEntity,
      centerEntity,
      centerMap,
      addTerminalEntity,
      addDoorEntity,
      addDPEntity,
      addMarkerEntity,
      addHighlightEntity,
    ]
  );

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
      if (e.ctrlKey && e.key === "5") {
        e.preventDefault();
        isProcessingRef.current = true;
        addDPEntity();
      }
      if (e.ctrlKey && e.key === "6") {
        e.preventDefault();
        isProcessingRef.current = true;
        addMarkerEntity();
      }
      if (e.ctrlKey && e.key === "7") {
        e.preventDefault();
        isProcessingRef.current = true;
        addHighlightEntity();
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
    addDPEntity,
    addMarkerEntity,
    addHighlightEntity,
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
                onRotateEntity={() => rotateMapEntity(selectedEntity?.GUID, 1)}
              >
                {/* actions toolbar */}
                <MapActionsToolbar
                  toolbarAction={handleToolbarAction}
                  isEntitySelected={selectedEntity !== null}
                />

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
          <MapPropsPanel
            selectedEntity={selectedEntity}
            setActiveMapSection={setActiveMapSection}
            activeMapSection={activeMapSection}
            mapSections={mapSections}
            addMapSection={addMapSection}
            mapEntities={mapEntities}
						handleRemoveEntity={handleRemoveEntity}
						updateEntity={updateEntity}
						handleEntitySelect={handleEntitySelect}
          />
        </div>
      )}
    </div>
  );
}

MapEditorPanel.propTypes = {
  value: PropTypes.number,
  index: PropTypes.number,
};
