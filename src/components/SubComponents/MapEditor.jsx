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
//data
import ShapeManager from "../../data/EntityShapeManager";

//mapEntities is an array of simplified entities {color,position,GUID}
const MapEditor = forwardRef(
  ({ mapEntities, onSelectEntity, onUpdateEntityPosition, children }, ref) => {
    //console.log("EDITOR INSTANCE CREATED");
    const containerRef = useRef(null);
    const twoRef = useRef(null);
    const zuiRef = useRef(null);
    const drawingGroupRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const zoomLevelRef = useRef(null);
    const shapeManagerRef = useRef(null);
    const selectedShapeGUIDRef = useRef(null); //entity GUID
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

    const centerEntity = useCallback(() => {
      if (!selectedShapeGUIDRef.current) return;

      const two = twoRef.current;
      const zui = zuiRef.current;
      const shape = shapeManagerRef.current.getShapeFromGUID(
        selectedShapeGUIDRef.current
      );
      console.log("🚀 ~ centerEntity ~ shape:", shape.position);
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
      console.log("🚀 ~ useEffect ~ INIT TWO/ZUI");

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

      //cleanup
      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        two.clear();
        two.release();
      };
    }, []);

		//setup shape manager
    useEffect(() => {
      console.log("🚀 ~ useEffect ~ INIT SHAPE MANAGER");
      if (!twoRef.current || !drawingGroupRef.current || !zuiRef.current)
        return;
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

      twoRef.current.update();

      return () => {
        if (shapeManagerRef.current) {
          shapeManagerRef.current.cleanup();
          shapeManagerRef.current = null;
        }
      };
    }, [mapEntities]);

    //setup mouse handlers
    useEffect(() => {
      let isPanning = false;
      let lastPosition = { x: 0, y: 0 };
      let hasPanned = false;
      const container = containerRef.current;

      const handleMouseDown = (e) => {
        if (e.target === containerRef.current.querySelector("canvas")) {
          const { x: mouseX, y: mouseY } = mouse2Surface(e);
          let { selected, guid } = shapeManagerRef.current.onMouseDown({
            mouseX,
            mouseY,
          });

          if (!selected) {
            lastPosition = { x: e.clientX, y: e.clientY };
            isPanning = true;
          } else {
            selectedShapeGUIDRef.current = guid;
            onSelectEntity(selectedShapeGUIDRef.current);
          }

          twoRef.current.update();
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
        if (selected) {
          onUpdateEntityPosition(selectedShapeGUIDRef.current, newPosition);
        }

        isPanning = false;
        hasPanned = false;

        //save zui state
        zuiStateRef.current.translation = {
          x: zuiRef.current.surfaceMatrix.elements[2],
          y: zuiRef.current.surfaceMatrix.elements[5],
        };
        zuiStateRef.current.zoom = zuiRef.current.scale;

        twoRef.current.update();
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

          twoRef.current.update();

          return;
        }

        if (!isPanning) return;

        hasPanned = true;

        let mouse = new Two.Vector();
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        const dx = e.clientX - lastPosition.x;
        const dy = e.clientY - lastPosition.y;

        zuiRef.current.translateSurface(dx, dy);

        lastPosition = { x: e.clientX, y: e.clientY };
        twoRef.current.update();
      };

      // Zoom event handling
      const handleWheel = (e) => {
        e.preventDefault();

        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        var dy = (e.wheelDeltaY || -e.deltaY) / 1000;
        zuiRef.current.zoomBy(dy, relativeX, relativeY);

        //save the zui zoom state
        zuiStateRef.current.translation = {
          x: zuiRef.current.surfaceMatrix.elements[2],
          y: zuiRef.current.surfaceMatrix.elements[5],
        };
        zuiStateRef.current.zoom = zuiRef.current.scale;

        zoomLevelRef.current.value = `Zoom: ${zuiRef.current.scale.toFixed(2)}`;

        twoRef.current.update();
      };

      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("wheel", handleWheel);

      //cleanup
      return () => {
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("wheel", handleWheel);
      };
    });

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
      addMapEntity: (entity) => {
        if (shapeManagerRef.current) shapeManagerRef.current.addEntity(entity);
      },
      removeMapEntity: (entityGUID) => {
        if (shapeManagerRef.current)
          shapeManagerRef.current.removeShape(entityGUID);
      },
      selectMapEntity: (entityGUID) => {//highlight the selected entity
        // console.log(
        //   "🚀 ~ useImperativeHandle::selectMapEntity ~ guid:",
        //   entityGUID
        // );
        selectedShapeGUIDRef.current = entityGUID;
        if (shapeManagerRef.current)
          shapeManagerRef.current.selectShape(entityGUID);
        twoRef.current.update();
      },
      updateMapEntity(entity) {
        console.log("🚀 ~ updateMapEntity ~ entity:", entity);
      },
      centerMap: centerMap,
      centerEntity: centerEntity,
    }));

    return (
      <div ref={containerRef} className="canvas">
        {children}
      </div>
    );
  }
);

MapEditor.displayName = "MapEditor";

export default MapEditor;

MapEditor.propTypes = {
  onSelectEntity: PropTypes.func,
  mapEntities: PropTypes.array,
  addEntity: PropTypes.func,
  onUpdateEntityPosition: PropTypes.func,

  children: PropTypes.node,
};
