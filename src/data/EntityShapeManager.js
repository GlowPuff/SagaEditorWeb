import Two from "two.js";
import { EntityType, DeploymentColorMap, Expansion } from "../lib/core";
import dimensions from "../data/dimensions";

class ShapeManager {
  constructor(two, zui, foregroundLayer, midgroundLayer, backgroundLayer) {
    this.two = two;
    this.foregroundLayer = foregroundLayer; //most entities
    this.midgroundLayer = midgroundLayer; //highlighted entity
    this.backgroundLayer = backgroundLayer; //tiles
    this.zui = zui;
    //TODO JUST STORE THE WHOLE ENTITY OBJECT!!!!!!!
    this.shapeGroups = new Map(); // entityGUID -> {group: Two.js shape, type, canRotate, rotation, expansion(number), tileID(number), entity, dimensions}
    this.selectedShape = null; // { guid: entityGUID, shape, twoID }, shape is usually a group
    this.isDraggingShape = false;
    this.dragOffset = { x: 0, y: 0 };
  }

  addEntity = (entity, callback) => {
    this.unselectAll();

    switch (entity.entityType) {
      case EntityType.Crate:
        this.addCrate(entity);
        break;
      case EntityType.Door:
        this.addDoor(entity);
        break;
      case EntityType.Console:
        this.addTerminal(entity);
        break;
      case EntityType.DeploymentPoint:
        this.addDeploymentPoint(entity);
        break;
      case EntityType.Token:
        this.addToken(entity);
        break;
      case EntityType.Highlight:
        this.addHightlight(entity);
        break;
      case EntityType.Tile:
        this.addTile(entity, callback);
        break;
      default:
        break;
    }
  };

  addCrate = (entity) => {
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(position.x, position.y);
    //main shape
    const shape = new Two.Rectangle(0, 0, 10, 10);
    //set origin to upper left corner
    shape.origin = new Two.Vector(-5, -5);
    shape.fill = DeploymentColorMap.get(entity.entityProperties.entityColor);
    shape.stroke = "black";
    shape.linewidth = 1;

    //add the letter C text to the crate
    const text = new Two.Text(
      "C",
      5, //half the width
      1 + 5
    );
    text.fill = "white";

    text.size = 10;
    text.family = "Arial";
    text.alignment = "center";

    parentGroup.add(shape);
    parentGroup.add(text);
    this.foregroundLayer.add(parentGroup);
    this.shapeGroups.set(entity.GUID, {
      group: parentGroup,
      type: EntityType.Crate,
      canRotate: false,
    });

    return shape;
  };

  addTerminal = (entity) => {
    console.log("🚀 ~ ShapeManager ~ entity:", entity);
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(position.x, position.y);
    //main shape
    const shape = new Two.Rectangle(0, 0, 10, 10);
    //set origin to upper left corner
    shape.origin = new Two.Vector(-5, -5);
    shape.fill = DeploymentColorMap.get(entity.entityProperties.entityColor);
    shape.stroke = "black";
    shape.linewidth = 1;

    //add the letter C text to the crate
    const text = new Two.Text(
      "T",
      5, //half the width
      1 + 5
    );
    text.fill = "white";

    text.size = 10;
    text.family = "Arial";
    text.alignment = "center";

    parentGroup.add(shape);
    parentGroup.add(text);
    this.foregroundLayer.add(parentGroup);
    this.shapeGroups.set(entity.GUID, {
      group: parentGroup,
      type: EntityType.Console,
      canRotate: false,
    });

    return shape;
  };

  addDoor = (entity) => {
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };
    const drawingPosition = this.calculateDrawingPosition(
      new Two.Vector(2, 2),
      position,
      entity.entityRotation
    );

    // console.log("🚀 ~ addTile ~ entity position:", position);
    // console.log("🚀 ~ addTile ~ drawingPosition:", {
    //   x: drawingPosition.x,
    //   y: drawingPosition.y,
    // });

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(drawingPosition.x, drawingPosition.y);
    //main shape
    const shape = new Two.Rectangle(0, 0, 20, 20);
    shape.fill = "transparent";
    shape.stroke = "transparent";
    shape.linewidth = 0;

    const textGroup = new Two.Group();
    textGroup.position = new Two.Vector(0, 0);
    const innerShape = new Two.Rectangle(0, 0, 20, 6);
    innerShape.fill = "#01b5ff";
    innerShape.stroke = "black";
    innerShape.linewidth = 1;

    //add DOOR text to the door
    const text = new Two.Text("DOOR", 0, 0 + 0.5);
    text.fill = "black";

    text.size = 5;
    text.family = "Arial";
    text.alignment = "center";

    textGroup.add(innerShape);
    textGroup.add(text);
    textGroup.rotation = (entity.entityRotation * Math.PI) / 180;

    parentGroup.add(shape);
    parentGroup.add(textGroup);

    this.foregroundLayer.add(parentGroup);
    this.shapeGroups.set(entity.GUID, {
      group: parentGroup,
      type: EntityType.Door,
      canRotate: true,
      rotation: entity.entityRotation,
      entity: entity,
      dimensions: { x: 2, y: 2 },
    });

    return shape;
  };

  addDeploymentPoint = (entity) => {
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(position.x, position.y);
    //main shape
    const shape = new Two.Circle(5, 5, 5, 10);
    //set origin to upper left corner
    shape.fill = DeploymentColorMap.get(entity.entityProperties.entityColor);
    shape.stroke = "black";
    shape.linewidth = 1;

    //add the letter C text to the crate
    const text = new Two.Text(
      "DP",
      5, //half the width
      5 + 0.5
    );
    text.fill = "white";

    text.size = 5;
    text.family = "Arial";
    text.alignment = "center";

    parentGroup.add(shape);
    parentGroup.add(text);
    this.foregroundLayer.add(parentGroup);
    this.shapeGroups.set(entity.GUID, {
      group: parentGroup,
      type: EntityType.DeploymentPoint,
      canRotate: false,
    });

    return shape;
  };

  addToken = (entity) => {
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(position.x, position.y);
    //main shape
    const shape = new Two.Circle(5, 5, 5, 10);
    //set origin to upper left corner
    shape.fill = DeploymentColorMap.get(entity.entityProperties.entityColor);
    shape.stroke = "black";
    shape.linewidth = 1;

    parentGroup.add(shape);
    this.foregroundLayer.add(parentGroup);
    this.shapeGroups.set(entity.GUID, {
      group: parentGroup,
      type: EntityType.Token,
      canRotate: false,
    });

    return shape;
  };

  addHightlight = (entity) => {
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(position.x, position.y);
    //main shape
    const shape = new Two.Rectangle(
      0,
      0,
      10 * entity.Width,
      10 * entity.Height
    );
    //set origin to upper left corner
    shape.origin = new Two.Vector(-5 * entity.Width, -5 * entity.Height);
    shape.fill = DeploymentColorMap.get(entity.entityProperties.entityColor);
    shape.stroke = "transparent";
    shape.linewidth = 0;
    shape.opacity = 0.5;

    //solid outline, otherwise it's transparent
    const outlineShape = new Two.Rectangle(
      0,
      0,
      10 * entity.Width,
      10 * entity.Height
    );
    outlineShape.origin = new Two.Vector(-5 * entity.Width, -5 * entity.Height);
    outlineShape.fill = "transparent";
    outlineShape.stroke = "black";
    outlineShape.linewidth = 1;

    parentGroup.add(outlineShape);
    parentGroup.add(shape);
    this.midgroundLayer.add(parentGroup);
    this.shapeGroups.set(entity.GUID, {
      group: parentGroup,
      type: EntityType.Highlight,
      canRotate: false,
    });

    return shape;
  };

  addTile = (entity, callback) => {
    // console.log("🚀 ~ ShapeManager ~ ADD TILE:", entity);
    const [x, y] = entity.entityPosition.split(",");
    const expansion = Object.keys(Expansion)[entity.expansion];
    const position = { x: parseFloat(x), y: parseFloat(y) };
    const tileDimensions = dimensions.find(
      (x) => x.expansion === expansion && x.id == entity.tileID
    );
    const drawingPosition = this.calculateDrawingPosition(
      {
        x: tileDimensions.width,
        y: tileDimensions.height,
      },
      position,
      entity.entityRotation
    );

    // console.log("🚀 ~ ShapeManager ~ expansion:", expansion)
    // console.log("🚀 ~ ShapeManager ~ tileDimensions:", tileDimensions)
    // console.log("🚀 ~ addTile ~ entity position:", position);
    // console.log("🚀 ~ addTile ~ drawingPosition:", drawingPosition);

    const source = "./Tiles/" + expansion + "/" + entity.textureName + ".webp";

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(drawingPosition.x, drawingPosition.y);
    //texture
    const texture = new Two.Texture(source, callback);
    texture.scale =
      Math.max(tileDimensions.width * 10, tileDimensions.height * 10) / 256;
    texture.offset = new Two.Vector(0, 0);
    //main shape
    const shape = new Two.Rectangle(
      0,
      0,
      10 * tileDimensions.width,
      10 * tileDimensions.height
    );
    shape.fill = "rgba(128, 0, 128, 0.5)";
    shape.stroke = "black";
    shape.linewidth = 2;
    shape.rotation = (entity.entityRotation * Math.PI) / 180;

    const textureContainer = new Two.Rectangle(
      0,
      0,
      10 * tileDimensions.width,
      10 * tileDimensions.height
    );
    textureContainer.origin = new Two.Vector(0, 0);
    textureContainer.fill = texture;
    textureContainer.stroke = "transparent";
    textureContainer.linewidth = 0;
    textureContainer.rotation = (entity.entityRotation * Math.PI) / 180;

    parentGroup.add(shape);
    parentGroup.add(textureContainer);

    this.backgroundLayer.add(parentGroup);
    this.shapeGroups.set(entity.GUID, {
      group: parentGroup,
      type: EntityType.Tile,
      canRotate: true,
      rotation: entity.entityRotation,
      expansion: entity.expansion,
      tileID: entity.tileID,
      entity: entity,
      dimensions: { x: tileDimensions.width, y: tileDimensions.height },
    });

    return shape;
  };

  //handles visual selection, sets selectedShape, returns { selected, guid, drawPosition }
  checkEntityClicked = (layer, mouseX, mouseY, checkDblClick) => {
    for (let i = layer.children.length - 1; i >= 0; i--) {
      const group = layer.children[i];
      //first item is the shape, second is the text or other decorations
      let shape = group.children[0];
      //get the guid based on the id of the shapeGroups map entries
      let guid = null;
      let canRotate = false;
      for (const [key, value] of this.shapeGroups.entries()) {
        if (value.group.id === group.id) {
          if (
            value.type === EntityType.Door ||
            value.type === EntityType.Tile
          ) {
            canRotate = true;
          }
          guid = key;
          break;
        }
      }

      if (!guid) throw new Error("GUID not found for shape group: " + group.id);

      const { left, top, right, bottom } = shape.getBoundingClientRect();
      let xy = this.zui.clientToSurface(left, top);
      let rightbottom = this.zui.clientToSurface(right, bottom);

      if (
        mouseX >= xy.x &&
        mouseX <= rightbottom.x &&
        mouseY >= xy.y &&
        mouseY <= rightbottom.y
      ) {
        this.unselectAll();
        shape.linewidth = 1.25;
        shape.stroke = "white";

        this.selectedShape = {
          guid,
          shape: group,
          twoID: group.id,
        };
        // console.log("🚀 ~ selectedShape:", this.selectedShape);
        if (!checkDblClick) {
          this.isDraggingShape = true;
          this.dragOffset.x = mouseX - group.position.x;
          this.dragOffset.y = mouseY - group.position.y;
        }

        layer.children.splice(i, 1);
        layer.add(group);

        return {
          selected: true,
          guid: guid,
          drawPosition: group.position,
          canRotate,
        };
      }
    }

    //nothing selected
    return { selected: false, guid: null };
  };

  //mouse position is in surface coordinates, returns { selected, newPosition, canRotate }
  onMouseDown = ({ mouseX, mouseY, checkDblClick }) => {
    let selected = { selected: false, guid: null };

    //check foreground first
    selected = this.checkEntityClicked(
      this.foregroundLayer,
      mouseX,
      mouseY,
      checkDblClick
    );
    // console.log("🚀 ~ ShapeManager ~ foregroundLayer selected:", selected);
    if (selected.selected) return selected;

    //check midground second
    selected = this.checkEntityClicked(
      this.midgroundLayer,
      mouseX,
      mouseY,
      checkDblClick
    );
    // console.log("🚀 ~ ShapeManager ~ midgroundLayer selected:", selected);
    if (selected.selected) return selected;

    //check background last
    selected = this.checkEntityClicked(
      this.backgroundLayer,
      mouseX,
      mouseY,
      checkDblClick
    );
    // console.log("🚀 ~ ShapeManager ~ backgroundLayer selected:", selected);
    if (selected.selected) return selected;

    //nothing selected
    return selected;
  };

  onMouseUp = () => {
    let isShapeSelected = false;
    let newPosition = null; //formatted string for entityPosition
    let snappedEntityPosition = null; //the snapped entityPosition and shape position (top left corner)
    let shapeGroup = null;

    if (this.selectedShape) {
      isShapeSelected = true;
      shapeGroup = this.shapeGroups.get(this.selectedShape.guid);

      //snap shape to grid (top left corner)
      snappedEntityPosition = this.snapToGrid(this.selectedShape.shape);
      // console.log("🚀 ~ onMouseUp ~ snapToGrid:", snappedEntityPosition);
      if (shapeGroup.canRotate)
        snappedEntityPosition = this.calculateEntityPosition(shapeGroup);

      newPosition = `${snappedEntityPosition.x},${snappedEntityPosition.y}`;
    }

    this.isDraggingShape = false;

    return {
      selected: isShapeSelected,
      newPosition,
    };
  };

  onMouseMove = ({ mouseX, mouseY }) => {
    if (this.selectedShape && this.isDraggingShape) {
      let shape = this.selectedShape.shape;
      shape.position = new Two.Vector(
        mouseX - this.dragOffset.x,
        mouseY - this.dragOffset.y
      );
    }
  };

  getShapeFromGUID = (entityGUID) => {
    return this.shapeGroups.get(entityGUID).group;
  };

  //calculate the drawing position based on entity position and rotation
  calculateDrawingPosition = (dims, entityPosition, entityRotation) => {
    // console.log(
    //   "🚀 ~ calculateDrawingPosition ~ entityPosition:",
    //   entityPosition
    // );
    // console.log("🚀 ~ calculateDrawingPosition ~ dims:", dims);

    if (entityRotation === 0) {
      return new Two.Vector(
        entityPosition.x + (dims.x * 10) / 2,
        entityPosition.y + (dims.y * 10) / 2
      );
    } else if (entityRotation === 90) {
      return new Two.Vector(
        entityPosition.x - (dims.y * 10) / 2,
        entityPosition.y + (dims.x * 10) / 2
      );
    } else if (entityRotation === 180) {
      return new Two.Vector(
        entityPosition.x - (dims.x * 10) / 2,
        entityPosition.y - (dims.y * 10) / 2
      );
    } else if (entityRotation === 270) {
      return new Two.Vector(
        entityPosition.x + (dims.y * 10) / 2,
        entityPosition.y - (dims.x * 10) / 2
      );
    }
  };

  //calculate the entity position based on drawing position and rotation
  calculateEntityPosition(shapeGroup) {
    let dims = { x: 2, y: 2 }; //door default
    const drawingPosition = {
      x: shapeGroup.group.position.x,
      y: shapeGroup.group.position.y,
    };

    if (shapeGroup.type === EntityType.Tile) {
      const expansion = Object.keys(Expansion)[shapeGroup.expansion];
      dims = dimensions.find(
        (x) => x.expansion === expansion && x.id == shapeGroup.tileID
      );
      dims = { x: dims.width, y: dims.height };
    }

    if (shapeGroup.rotation === 0) {
      return {
        x: drawingPosition.x - (dims.x * 10) / 2,
        y: drawingPosition.y - (dims.y * 10) / 2,
      };
    } else if (shapeGroup.rotation === 90) {
      return {
        x: drawingPosition.x + (dims.y * 10) / 2,
        y: drawingPosition.y - (dims.x * 10) / 2,
      };
    } else if (shapeGroup.rotation === 180) {
      return {
        x: drawingPosition.x + (dims.x * 10) / 2,
        y: drawingPosition.y + (dims.y * 10) / 2,
      };
    } else if (shapeGroup.rotation === 270) {
      return {
        x: drawingPosition.x - (dims.y * 10) / 2,
        y: drawingPosition.y + (dims.x * 10) / 2,
      };
    }
  }

  //explicitly select a shape
  selectShape = (entityGUID) => {
    this.unselectAll();
    if (!entityGUID) return;

    //console.log("🚀 ~ ShapeManager ~ finding guid:", guid);

    let shapeGroup = this.shapeGroups.get(entityGUID);
    if (shapeGroup === undefined) return;

    let group = shapeGroup.group;
    if (group) {
      //console.log("🚀 ~ ShapeManager ~ select shape:", group);
      //move selected shape to the top of the drawing group
      let layer;
      const type = shapeGroup.type;
      if (type === EntityType.Highlight) {
        layer = this.midgroundLayer;
        // console.log("MID");
      } else if (type !== EntityType.Tile) {
        layer = this.foregroundLayer;
        // console.log("FORE");
      } else {
        layer = this.backgroundLayer; //tile
        // console.log("BACK");
      }

      const idx = layer.children.indexOf(group);
      layer.children.splice(idx, 1);
      layer.add(group);

      let shape = group.children[0];
      shape.linewidth = 1.25;
      shape.stroke = "white";
    }
  };

  unselectAll = () => {
    for (const [, shapeGroup] of this.shapeGroups) {
      let shape = shapeGroup.group.children[0];
      shape.linewidth = 1;
      shape.stroke = "black";
      if (shapeGroup.type === EntityType.Door) {
        shape.linewidth = 0;
        shape.stroke = "transparent";
      }
    }
  };

  cleanup = () => {
    // console.log("🚀 ~ ShapeManager cleanup");
    this.shapeGroups.forEach((shapeGroup) => {
      if (shapeGroup.group && shapeGroup.group.parent) {
        // console.log("🚀 ~ cleanup ~ shape:", shapeGroup.group);
        shapeGroup.group.parent.remove(shapeGroup.group);
      }
    });
  };

  removeShape = (entityGUID) => {
    const shapeGroup = this.shapeGroups.get(entityGUID);
    if (shapeGroup.group) {
      if (shapeGroup.type === EntityType.Highlight) {
        this.midgroundLayer.remove(shapeGroup.group);
        // console.log("🚀 ~ ShapeManager ~ REMOVED MID LAYER");
      } else if (shapeGroup.type !== EntityType.Tile) {
        this.foregroundLayer.remove(shapeGroup.group);
        // console.log("🚀 ~ ShapeManager ~ REMOVED FORE LAYER");
      } else {
        this.backgroundLayer.remove(shapeGroup.group); //tile
        // console.log("🚀 ~ ShapeManager ~ REMOVED BACK LAYER");
      }

      this.two.release(shapeGroup.group);
      this.shapeGroups.delete(entityGUID);
    }
    this.two.update();
  };

  //snaps the shape to the grid and returns the new shape position
  snapToGrid = (shape) => {
    //gridsize is 10
    //round to shape position, which is same as entity position (top left corner)
    let sX = Math.round(shape.position.x / 10) * 10;
    let sY = Math.round(shape.position.y / 10) * 10;
    shape.position = new Two.Vector(sX, sY);
    return { x: sX, y: sY };
  };
}

export default ShapeManager;
