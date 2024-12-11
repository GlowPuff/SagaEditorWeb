import { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
//icons
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
//data
import { EntityType, createGUID } from "../../lib/core";
import {
  MapSection,
  CrateEntity,
  TerminalEntity,
  DoorEntity,
  DeploymentPointEntity,
  TokenEntity,
  HighlightEntity,
  MapTileEntity,
} from "../../data/Mission";
import { useMapSectionsStore, useMapEntitiesStore } from "../../data/dataStore";
//components
import MapEditor from "../SubComponents/MapEditor";
import EditEntityProperties from "../EventActionDialogs/EditEntityProperties";
import DeploymentGroupProperties from "../Dialogs/DeploymentGroupProperties";
//map components
import MapActionsToolbar from "../MapComponents/MapActionsToolbar";
import MapPropsPanel from "../MapComponents/MapPropsPanel";
import TileGallery from "../MapComponents/TileGallery";

export default function MapEditorPanel({ value, index }) {
  //map section store
  const mapSections = useMapSectionsStore((state) => state.mapSections);
  const setActiveMapSectionGUID = useMapSectionsStore(
    (state) => state.setActiveMapSectionGUID
  );
  const addExistingSection = useMapSectionsStore(
    (state) => state.addExistingSection
  );
  const activeMapSectionGUID = useMapSectionsStore(
    (state) => state.activeMapSectionGUID
  );
  const addTileToActiveSection = useMapSectionsStore(
    (state) => state.addTileToActiveSection
  );
  const updateTilePosition = useMapSectionsStore(
    (state) => state.updateTilePosition
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
  const mapContainerRef = useRef(null);
  const isProcessingRef = useRef(false);

  //select the entity in the map on mount, set the max size of the map container
  useEffect(() => {
    if (mapRef.current && selectedEntity) {
      mapRef.current.selectMapEntity(selectedEntity.GUID);
    }
    let lp = document.querySelector(".left-panel");
    let lpHeight = lp ? lp.offsetHeight : 0;
    let footer = document.querySelector(".footer").offsetHeight;
    mapContainerRef.current.style.maxHeight = `calc(${lpHeight}px - 1px - ${footer}px - 0.5rem)`;

    const handleResize = () => {
      let lp = document.querySelector(".left-panel");
      let lpHeight = lp ? lp.offsetHeight : 0;
      let footer = document.querySelector(".footer").offsetHeight;
      mapContainerRef.current.style.maxHeight = `calc(${lpHeight}px - 1px - ${footer}px - 0.5rem)`;
    };

    window.addEventListener("resize", handleResize);

    //cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedEntity]);

  //******** toolbar actions
  const centerMap = useCallback(() => {
    mapRef.current.centerMap();
  }, []);

  const centerEntity = useCallback(() => {
    if (selectedEntity !== null) {
      mapRef.current.centerEntity(selectedEntity);
    }
  }, [selectedEntity]);

  const addMapTileEntity = useCallback(
    (id, exp, side) => {
      let newEntity = new MapTileEntity(activeMapSectionGUID, id, exp, side);
      addTileToActiveSection(newEntity);
      mapRef.current.addMapEntity(newEntity);
      mapRef.current.selectMapEntity(newEntity.GUID);
      setSelectedEntity(newEntity);
    },
    [activeMapSectionGUID, addTileToActiveSection]
  );

  const openTileGallery = useCallback(() => {
    TileGallery.ShowDialog((tiles) => {
      if (tiles) {
        //{ expansion, tileNumber, src, side }
        tiles.forEach((tile) => {
          addMapTileEntity(tile.tileNumber, tile.expansion, tile.side);
        });
      }
    });
  }, [addMapTileEntity]);

  const addCrateEntity = useCallback(() => {
    let newEntity = new CrateEntity(activeMapSectionGUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSectionGUID, addMapEntity]);

  const addTerminalEntity = useCallback(() => {
    let newEntity = new TerminalEntity(activeMapSectionGUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSectionGUID, addMapEntity]);

  const addDoorEntity = useCallback(() => {
    let newEntity = new DoorEntity(activeMapSectionGUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSectionGUID, addMapEntity]);

  const addDPEntity = useCallback(() => {
    let newEntity = new DeploymentPointEntity(activeMapSectionGUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSectionGUID, addMapEntity]);

  const addMarkerEntity = useCallback(() => {
    let newEntity = new TokenEntity(activeMapSectionGUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSectionGUID, addMapEntity]);

  const addHighlightEntity = useCallback(() => {
    let newEntity = new HighlightEntity(activeMapSectionGUID);
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [activeMapSectionGUID, addMapEntity]);

  const handleToolbarAction = useCallback(
    (action) => {
      switch (action) {
        case "tileGallery":
          openTileGallery();
          break;
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
      openTileGallery,
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
      //if not an entity, check the map section tiles
      if (!selected) {
        selected = mapSections
          .map((x) => x.mapTiles)
          .flat()
          .find((x) => x.GUID === entityGUID);
      }
      // console.log("🚀 ~ MapEditorPanel ~ selected:", selected);
      if (selected) {
        setSelectedEntity(selected);
        //select it in the map
        mapRef.current.selectMapEntity(selected.GUID);
      } else setSelectedEntity(null);
    },
    [mapEntities, mapSections]
  );

  function onEditPropertiesClick() {
    if (selectedEntity.entityType === EntityType.Tile) return;

    let entityToModify = { ...selectedEntity };
    if (selectedEntity.entityType !== EntityType.DeploymentPoint) {
      EditEntityProperties.ShowDialog(
        selectedEntity.entityProperties,
        false,
        (enProps) => {
          let updated = { ...entityToModify };
          updated.entityProperties = enProps;
          updateMapEntity(updated);
          setSelectedEntity(updated);
        }
      );
    } else if (selectedEntity.entityType === EntityType.DeploymentPoint) {
      DeploymentGroupProperties.ShowDialog(
        selectedEntity.deploymentPointProps,
        (dpProps) => {
          let updated = { ...entityToModify };
          updated.deploymentPointProps = dpProps;
          updateMapEntity(updated);
          setSelectedEntity(updated);
        }
      );
    }
  }

  const handleDuplicateEntity = useCallback(() => {
    let newEntity = { ...selectedEntity };
    newEntity.GUID = createGUID();
    if (!newEntity.name.includes("Duplicate"))
      newEntity.name = `${selectedEntity.name} (Duplicate)`;
    newEntity.entityProperties.name = newEntity.name;
    //move the entity a bit
    const [x, y] = newEntity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };
    position.x += 10;
    position.y += 10;
    newEntity.entityPosition = `${position.x},${position.y}`;
    //add the entity
    addMapEntity(newEntity);
    mapRef.current.addMapEntity(newEntity);
    mapRef.current.selectMapEntity(newEntity.GUID);
    setSelectedEntity(newEntity);
  }, [selectedEntity, addMapEntity]);

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
        centerMap();
      }
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        isProcessingRef.current = true;
        centerEntity();
      }
      if (e.ctrlKey && e.key === "1") {
        e.preventDefault();
        isProcessingRef.current = true;
        openTileGallery();
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
      if (e.ctrlKey && e.key === "Delete") {
        e.preventDefault();
        if (!selectedEntity) return;
        isProcessingRef.current = true;
        mapRef.current.removeMapEntity(selectedEntity.GUID);
        removeMapEntity(selectedEntity.GUID);
        handleEntitySelect(null);
      }
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        if (!selectedEntity) return;
        if (selectedEntity.entityType === EntityType.Tile) return;

        isProcessingRef.current = true;
        handleDuplicateEntity();
      }
      if (e.key === "[") {
        e.preventDefault();
        if (!selectedEntity) return;

        if (
          selectedEntity.entityType === EntityType.Door ||
          selectedEntity.entityType === EntityType.Tile
        )
          mapRef.current.rotateEntityFromKeyCommand(-1);
      }
      if (e.key === "]") {
        e.preventDefault();
        if (!selectedEntity) return;

        if (
          selectedEntity.entityType === EntityType.Door ||
          selectedEntity.entityType === EntityType.Tile
        )
          mapRef.current.rotateEntityFromKeyCommand(1);
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
    openTileGallery,
    addCrateEntity,
    addTerminalEntity,
    addDoorEntity,
    addDPEntity,
    addMarkerEntity,
    addHighlightEntity,
    handleEntitySelect,
    handleDuplicateEntity,
    addMapEntity,
    rotateMapEntity,
    removeMapEntity,
    selectedEntity,
  ]);

  //called by the entity component to update the entity
  const updateEntity = useCallback(
    (entity) => {
      //console.log("🚀 ~ updateEntity ~ entity:", entity);
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
    //position is a string "x,y"
    (entityGUID, position) => {
      // console.log(
      //   "🚀 ~ handleUpdateEntityPosition ~ entityGUID, position",
      //   entityGUID,
      //   position
      // );
      if (mapEntities.find((x) => x.GUID === entityGUID)) {
        updateMapEntityPosition(entityGUID, position);
      } else {
        //otherwise, it's a map tile
        let tile = mapSections
          .map((x) => x.mapTiles)
          .flat()
          .find((x) => x.GUID === entityGUID);
        if (tile) updateTilePosition(tile.GUID, position);
      }
    },
    [updateMapEntityPosition, updateTilePosition, mapEntities, mapSections]
  );

  function addMapSection() {
    let newSection = new MapSection();
    newSection.name = "New Map Section";
    addExistingSection(newSection); //also sets active section
  }

  return (
    <div
      hidden={value !== index}
      id={`tabpanel-${index}`}
      style={{ height: "100%" }}
    >
      {value === index && (
        <div className="map-panel" ref={mapContainerRef}>
          {/* LEFT */}
          <Paper
            sx={{
              padding: "1rem",
              height: "100%",
              width: "100%",
            }}
          >
            <div className="canvas">
              <MapEditor
                ref={mapRef}
                mapEntities={mapEntities.concat(
                  mapSections.map((x) => x.mapTiles).flat()
                )}
                onSelectEntity={handleEntitySelect}
                onUpdateEntityPosition={handleUpdateEntityPosition}
                onRotateEntity={(drawPosition, direction = 1) =>
                  rotateMapEntity(selectedEntity?.GUID, direction, drawPosition)
                }
                onDoubleClick={onEditPropertiesClick}
              >
                {/* actions toolbar */}
                <MapActionsToolbar
                  toolbarAction={handleToolbarAction}
                  isEntitySelected={selectedEntity !== null}
                />

                {/* hotkey toolbar */}
                <div className="hotkeyToolBar">
                  {/* <div className="hotkeyItem" style={{ marginLeft: "auto" }}>
                    <Typography variant="button">Ctrl + T</Typography>
                    <div className="hotkeyDefinition">Add Tile</div>
                  </div> */}

                  {/* <FiberManualRecordIcon
                    sx={{ width: "10px", height: "10px", color: "#702da0" }}
                  /> */}

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
                    <Typography variant="button">Ctrl + Delete</Typography>
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
            setActiveMapSectionGUID={setActiveMapSectionGUID}
            activeMapSectionGUID={activeMapSectionGUID}
            mapSections={mapSections}
            addMapSection={addMapSection}
            mapEntities={mapEntities.concat(
              mapSections.map((x) => x.mapTiles).flat()
            )}
            handleRemoveEntity={handleRemoveEntity}
            updateEntity={updateEntity}
            handleEntitySelect={handleEntitySelect}
            onEditPropertiesClick={onEditPropertiesClick}
            onDuplicateEntity={handleDuplicateEntity}
          />
        </div>
      )}

      <EditEntityProperties />
      <DeploymentGroupProperties />
      <TileGallery />
    </div>
  );
}

MapEditorPanel.propTypes = {
  value: PropTypes.number,
  index: PropTypes.number,
};
