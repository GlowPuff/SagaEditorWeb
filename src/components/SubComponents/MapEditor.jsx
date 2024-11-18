//scaffold this component
import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import Two from "two.js";
import { ZUI } from "two.js/extras/jsm/zui.js";
//mui
import { IconButton, Tooltip, Typography } from "@mui/material";
//icons
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
import { CrateEntity } from "../../data/Mission";
import { useMapEntitiesStore } from "../../data/dataStore";
import ShapeManager from "../../data/EntityShapeManager";

//mapEntities is an array of simplified entities {color,position,GUID}
const MapEditor = forwardRef(({ mapEntities, onSelectEntity, addEntity }, ref) => {
  //console.log("EDITOR INSTANCE CREATED");
  const containerRef = useRef(null);
  const twoRef = useRef(null);
  const zuiRef = useRef(null);
  const drawingGroupRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const zoomLevelRef = useRef(null);
  const shapeManagerRef = useRef(null);
  const selectedShapeGUIDRef = useRef(null); //entity GUID
  const isProcessingRef = useRef(false);
  const zuiStateRef = useRef(
    (() => {
      const savedState = document.cookie
        .split("; ")
        .find((row) => row.startsWith("mapEditorZuiState="))
        ?.split("=")[1];
      return savedState
        ? JSON.parse(savedState)
        : {
            translation: { x: -1, y: -1 },
            zoom: 3.5,
          };
    })()
  );

  //state stores
  // const mapEntities = useMapEntitiesStore((store) => store.mapEntities);
  // const addEntity = useMapEntitiesStore((store) => store.addEntity);
  // const updateEntity = useMapEntitiesStore((store) => store.updateEntity);
  const removeEntity = useMapEntitiesStore((store) => store.removeEntity);
  const updateEntityPosition = useMapEntitiesStore(
    (store) => store.updateEntityPosition
  );

  const centerEntity = useCallback(() => {
    if (!selectedShapeGUIDRef.current) return;

    const two = twoRef.current;
    const zui = zuiRef.current;
    const shape = shapeManagerRef.current.getShapeFromGUID(
      selectedShapeGUIDRef.current
    );
    //or retain the current zoom level
    const gridExtent = 2000;
    const zoom = 3.5; //zui.scale;
    const newCenter = {
      x: two.width / 2 - (zoom * gridExtent) / 2,
      y: two.height / 2 - (zoom * gridExtent) / 2,
    };

    zui.reset();
    zui.translateSurface(newCenter.x, newCenter.y);
    zui.zoomSet(zoom, newCenter.x, newCenter.y);
    zui.translateSurface(
      (1000 - shape.position.x) * zoom,
      (1000 - shape.position.y) * zoom
    );
    zuiStateRef.current.translation = {
      x: newCenter.x + (1000 - shape.position.x) * zoom,
      y: newCenter.y + (1000 - shape.position.y) * zoom,
    };
    zuiStateRef.current.zoom = zoom;

    two.update();
  }, []);

  const addCrateEntity = useCallback(() => {
    let crate = new CrateEntity("12345");
    addEntity(crate);
    if (shapeManagerRef.current) shapeManagerRef.current.addCrate(crate);
    selectedShapeGUIDRef.current = crate.GUID;
    onSelectEntity(crate);
    twoRef.current.update();
  }, [addEntity, onSelectEntity]);

  // save state before unloading
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        document.cookie = `mapEditorZuiState=${JSON.stringify(
          zuiStateRef.current
        )}; path=/; max-age=2592000`;
      } catch (error) {
        console.error("Failed to save map editor state:", error);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //setup the grid, event handlers, two.js, and zui
  useEffect(() => {
    // console.log("🚀 ~ useEffect ~ INIT TWO/ZUI");

    // Clean up any existing canvas elements
    const container = containerRef.current;
    const existingCanvas = container.querySelector("canvas");
    if (existingCanvas) {
      container.removeChild(existingCanvas);
    }

    const rect = container.getBoundingClientRect();

    const params = {
      width: rect.width,
      height: rect.height,
      type: Two.Types.canvas,
    };

    //setup Two.js
    const two = new Two(params);
    //double the rendering resolution
    two.renderer.resolution = 2;
    two.appendTo(container);
    two.renderer.domElement.style.position = "absolute";
    twoRef.current = two;

    // Create main group for panning/zooming
    const mainGroup = two.makeGroup();
    //create a group for drawing shapes
    const drawingGroup = two.makeGroup();
    drawingGroupRef.current = drawingGroup;

    //setup ZUI
    const zui = new ZUI(mainGroup);
    zuiRef.current = zui;
    zui.addLimits(1, 8);
    zui.zoomSet(zuiStateRef.current.zoom, 0, 0);
    if (
      zuiStateRef.current.translation.x !== -1 &&
      zuiStateRef.current.translation.y !== -1
    ) {
      zui.translateSurface(
        zuiStateRef.current.translation.x,
        zuiStateRef.current.translation.y
      );
    } else {
      //default to middle of the map
      zui.translateSurface(two.width / 2, two.height / 2);
    }

    //zoom text display
    const text = two.makeText(
      `Zoom: ${zui.scale.toFixed(2)}`,
      two.width - 50,
      10
    );
    text.fill = "white";
    text.opacity = 0.5;
    zoomLevelRef.current = text;

    let isPanning = false;
    let lastPosition = { x: 0, y: 0 };
    let hasPanned = false;
    let gridSize = 10;
    let gridExtent = 2000;

    // Draw grid
    const drawGrid = () => {
      const gridGroup = twoRef.current.makeGroup();

      for (let x = 0; x <= gridExtent; x += gridSize) {
        const line = twoRef.current.makeLine(x, 0, x, gridExtent);
        line.stroke = x === 1000 ? "white" : "#6b6576";
        line.linewidth = 1;
        line.opacity = 0.25;
        gridGroup.add(line);
      }

      for (let y = 0; y <= gridExtent; y += gridSize) {
        const line = twoRef.current.makeLine(0, y, gridExtent, y);
        line.stroke = y === 1000 ? "white" : "#6b6576";
        line.linewidth = 1;
        line.opacity = 0.25;
        gridGroup.add(line);
      }

      mainGroup.add(gridGroup);
      mainGroup.add(drawingGroup);
    };

    drawGrid();

    two.update();

    const handleMouseDown = (e) => {
      if (e.target === container.querySelector("canvas")) {
        const { x: mouseX, y: mouseY } = mouse2Surface(e);
        let { selected, guid } = shapeManagerRef.current.onMouseDown({
          mouseX,
          mouseY,
        });

        if (selected) {
          onSelectEntity(mapEntities.find((x) => x.GUID === guid));
          // console.log("🚀 ~ handleMouseDown ~ selected:", guid);
        }

        if (!selected) {
          lastPosition = { x: e.clientX, y: e.clientY };
          isPanning = true;
        } else selectedShapeGUIDRef.current = guid;

        two.update();
      }
    };

    const handleMouseUp = () => {
      //unset the selected shape
      if (!hasPanned && isPanning) {
        selectedShapeGUIDRef.current = null;
        shapeManagerRef.current.unselectAll();
        onSelectEntity(null);
      }

      //if just finished dragging a shape, update the entity position
      const { selected, newPosition } = shapeManagerRef.current.onMouseUp();
      // if (shapeManagerRef.current.onMouseUp()) {
      if (selected) {
        updateEntityPosition(selectedShapeGUIDRef.current, newPosition);
        // onUpdateEntityPosition(selectedShapeGUIDRef.current);
      }

      isPanning = false;
      hasPanned = false;

      //save zui state
      zuiStateRef.current.translation = {
        x: zui.surfaceMatrix.elements[2],
        y: zui.surfaceMatrix.elements[5],
      };
      zuiStateRef.current.zoom = zui.scale;

      two.update();
    };

    const handleMouseMove = (e) => {
      //handle shape movement
      if (!isPanning && selectedShapeGUIDRef.current) {
        const { x: mouseX, y: mouseY } = mouse2Surface(e);
        shapeManagerRef.current.onMouseMove({
          // guid: selectedShapeGUIDRef.current,
          mouseX,
          mouseY,
        });

        two.update();

        return;
      }

      if (!isPanning) return;

      hasPanned = true;

      let mouse = new Two.Vector();
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = e.clientX - lastPosition.x;
      const dy = e.clientY - lastPosition.y;

      zui.translateSurface(dx, dy);

      lastPosition = { x: e.clientX, y: e.clientY };
      two.update();
    };

    // Zoom event handling
    const handleWheel = (e) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      var dy = (e.wheelDeltaY || -e.deltaY) / 1000;
      zui.zoomBy(dy, relativeX, relativeY);

      //save the zui zoom state
      zuiStateRef.current.translation = {
        x: zui.surfaceMatrix.elements[2],
        y: zui.surfaceMatrix.elements[5],
      };
      zuiStateRef.current.zoom = zui.scale;

      zoomLevelRef.current.value = `Zoom: ${zui.scale.toFixed(2)}`;

      two.update();
    };

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
        console.log("🚀 ~ addCrateEntity");
        addCrateEntity();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        isProcessingRef.current = true;
        if (selectedShapeGUIDRef.current && shapeManagerRef.current) {
          shapeManagerRef.current.removeShape(selectedShapeGUIDRef.current);
          removeEntity(selectedShapeGUIDRef.current);
          onSelectEntity(null);
          selectedShapeGUIDRef.current = null;
        }
      }
    };

    const handleKeyUp = () => {
      isProcessingRef.current = false;
    };

    // Set up ResizeObserver
    resizeObserverRef.current = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        const element = entry.target;

        if (element === containerRef.current && twoRef.current) {
          const two = twoRef.current;

          zoomLevelRef.current.translation.set(two.width - 50, 10);

          if (two.width !== width || two.height !== height) {
            two.width = width;
            two.height = height;
            two.update();
          }
        }
      });
    });

    resizeObserverRef.current.observe(containerRef.current);

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("wheel", handleWheel);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    //cleanup
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      two.clear();
      two.release();
    };
  }, [
    addCrateEntity,
    centerEntity,
    removeEntity,
    mapEntities,
    onSelectEntity,
    updateEntityPosition,
  ]);

  useEffect(() => {
    // console.log("🚀 ~ useEffect ~ INIT SHAPE MANAGER");
    if (!twoRef.current || !drawingGroupRef.current || !zuiRef.current) return;
    if (!shapeManagerRef.current)
      shapeManagerRef.current = new ShapeManager(
        twoRef.current,
        drawingGroupRef.current,
        zuiRef.current
      );

    //add the shapes from existing map Entities
    mapEntities.forEach((entity) => {
      // console.log("🚀 ~ adding shape from entity:", entity.name);
      shapeManagerRef.current.addEntity(entity);
    });

    //select the selected shape, if any
    if (selectedShapeGUIDRef.current)
      shapeManagerRef.current.selectShape(selectedShapeGUIDRef.current);

    // console.log(
    //   "🚀 ~ adding entity shapes to canvas, mapEntities found: ",
    //   mapEntities.length
    // );
    // console.log(
    //   "🚀 ~ shape manager count:",
    //   shapeManagerRef.current.shapeGroups
    // );
    // console.log(
    //   "🚀 ~ useEffect ~ drawing surface shape count:",
    //   drawingGroupRef.current.children.length
    // );
    // console.log(
    //   "🚀 ~ scene shape count:",
    //   twoRef.current.scene.children[0].children[1].children.length
    // );

    twoRef.current.update();

    return () => {
      if (shapeManagerRef.current) {
        shapeManagerRef.current.cleanup();
        shapeManagerRef.current = null;
      }
    };
  }, [mapEntities]);

  function centerMap() {
    const two = twoRef.current;
    const zui = zuiRef.current;
    //3500 is the desired zoom level (3.5) * 1000 (half the map extent)
    const newCenter = { x: two.width / 2 - 3500, y: two.height / 2 - 3500 };

    zui.reset();
    zuiStateRef.current.translation = {
      x: newCenter.x,
      y: newCenter.y,
    };
    zuiStateRef.current.zoom = 3.5;
    zoomLevelRef.current.value = `Zoom: 3.50`;
    zui.translateSurface(newCenter.x, newCenter.y);
    zui.zoomSet(3.5, newCenter.x, newCenter.y);

    two.update();
  }

  //returns {x,y} coordinates on the surface
  function mouse2Surface(e) {
    const rect = containerRef.current.getBoundingClientRect();
    return zuiRef.current.clientToSurface(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  }

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    removeMapEntity: (entity) => {
      if (shapeManagerRef.current)
        shapeManagerRef.current.removeShape(entity.GUID);
      removeEntity(selectedShapeGUIDRef.current);
    },
    selectMapEntity: (guid) => {
      // console.log("🚀 ~ useImperativeHandle ~ guid:", guid);
      selectedShapeGUIDRef.current = guid;
      if (shapeManagerRef.current) shapeManagerRef.current.selectShape(guid);
      twoRef.current.update();
    },
    updateMapEntity(entity) {
      console.log("🚀 ~ updateMapEntity ~ entity:", entity);
      //update the store
      // updateEntity(entity);
    },
  }));

  return (
    <div ref={containerRef} className="canvas">
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
        <Tooltip title="Add a Terminal (Control + 3)" placement="right">
          <IconButton>
            <ComputerIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add a Door (Control + 4)" placement="right">
          <IconButton>
            <DoorSlidingIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add a Deployment Point (Control + 5)" placement="right">
          <IconButton>
            <PersonAddIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add a Mission Marker (Control + 6)" placement="right">
          <IconButton>
            <TokenIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add a Space Highlight (Control + 7)" placement="right">
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
        <Tooltip title="Center Selected Entity (Control + E)" placement="right">
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
          <div className="hotkeyDefinition">Duplicate Selected Entity</div>
        </div>

        <FiberManualRecordIcon
          sx={{ width: "10px", height: "10px", color: "#702da0" }}
        />

        <div className="hotkeyItem" style={{ marginRight: "auto" }}>
          <Typography variant="button">Ctrl + Shift + X</Typography>
          <div className="hotkeyDefinition">Delete Selected Entity</div>
        </div>
      </div>
    </div>
  );
});

MapEditor.displayName = "MapEditor";

export default MapEditor;

MapEditor.propTypes = {
  onSelectEntity: PropTypes.func,
	mapEntities: PropTypes.array,
	addEntity: PropTypes.func,
};
