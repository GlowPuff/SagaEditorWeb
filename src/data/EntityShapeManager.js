import Two from "two.js";
import { EntityType, DeploymentColorMap } from "../lib/core";

class ShapeManager {
  constructor(two, drawingGroup, zui) {
    this.two = two;
    this.drawingGroup = drawingGroup;
    this.zui = zui;
    this.shapeGroups = new Map(); // entityGUID -> Two.js shape
    this.shapeProps = new Map(); // entityGUID -> {type, canRotate}
    this.selectedShape = null; // { entityGUID, shape, twoID }, shape is usually a group
    this.isDraggingShape = false;
    this.dragOffset = { x: 0, y: 0 };
  }

  addEntity = (entity) => {
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
    this.drawingGroup.add(parentGroup);
    this.shapeGroups.set(entity.GUID, parentGroup);
    this.shapeProps.set(entity.GUID, {
      type: EntityType.Crate,
      canRotate: false,
    });

    return shape;
  };

  addTerminal = (entity) => {
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
    this.drawingGroup.add(parentGroup);
    this.shapeGroups.set(entity.GUID, parentGroup);
    this.shapeProps.set(entity.GUID, {
      type: EntityType.Crate,
      canRotate: false,
    });

    return shape;
  };

  addDoor = (entity) => {
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };

    const parentGroup = new Two.Group();
    parentGroup.position = new Two.Vector(position.x, position.y);
    //main shape
    const shape = new Two.Rectangle(0, 0, 20, 20);
    //set origin to upper left corner
    shape.origin = new Two.Vector(-10, -10);
    shape.fill = "transparent";
    shape.stroke = "transparent";
    shape.linewidth = 0;

    const textGroup = new Two.Group();
    textGroup.position = new Two.Vector(10, 10);
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

    this.drawingGroup.add(parentGroup);
    this.shapeGroups.set(entity.GUID, parentGroup);
    this.shapeProps.set(entity.GUID, {
      type: EntityType.Door,
      canRotate: true,
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
    this.drawingGroup.add(parentGroup);
    this.shapeGroups.set(entity.GUID, parentGroup);
    this.shapeProps.set(entity.GUID, {
      type: EntityType.Crate,
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
    this.drawingGroup.add(parentGroup);
    this.shapeGroups.set(entity.GUID, parentGroup);
    this.shapeProps.set(entity.GUID, {
      type: EntityType.Crate,
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
    this.drawingGroup.add(parentGroup);
    this.shapeGroups.set(entity.GUID, parentGroup);
    this.shapeProps.set(entity.GUID, {
      type: EntityType.Crate,
      canRotate: false,
    });

    return shape;
  };

  //mouse position are in surface coordinates
  //returns true if a shape was selected
  onMouseDown = ({ mouseX, mouseY, checkDblClick }) => {
    for (let i = this.drawingGroup.children.length - 1; i >= 0; i--) {
      const group = this.drawingGroup.children[i];
      //first item is the shape, second is the text or other decorations
      let shape = group.children[0];
      //get the guid based on the id of the shapeGroups map entries
      let guid = null;
      for (const [key, value] of this.shapeGroups.entries()) {
        if (value.id === group.id) {
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

        this.selectedShape = { guid, shape: group, twoID: group.id };
        // console.log("🚀 ~ selectedShape:", this.selectedShape);
        if (!checkDblClick) {
          this.isDraggingShape = true;
          this.dragOffset.x = mouseX - group.position.x;
          this.dragOffset.y = mouseY - group.position.y;
        }

        this.drawingGroup.children.splice(i, 1);
        this.drawingGroup.add(group);

        return { selected: true, guid: guid, shapeGroup: group };
      }
    }
    return { selected: false, guid: null };
  };

  onMouseUp = () => {
    let isShapeSelected = false;
    let newPosition = null;

    if (this.selectedShape) {
      this.snapToGrid(this.selectedShape.shape);
      isShapeSelected = true;
      newPosition = `${this.selectedShape.shape.position.x},${this.selectedShape.shape.position.y}`;
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
    return this.shapeGroups.get(entityGUID);
  };

  //explicitly select a shape
  selectShape = (entityGUID) => {
    this.unselectAll();
    if (!entityGUID) return;

    //console.log("🚀 ~ ShapeManager ~ finding guid:", guid);

    let group = this.shapeGroups.get(entityGUID);
    if (group) {
      //console.log("🚀 ~ ShapeManager ~ select shape:", group);
      //move selectd shape to the top of the drawing group
      const idx = this.drawingGroup.children.indexOf(group);
      this.drawingGroup.children.splice(idx, 1);
      this.drawingGroup.add(group);

      let shape = group.children[0];
      shape.linewidth = 1.25;
      shape.stroke = "white";
    }
  };

  unselectAll = () => {
    for (const [guid, group] of this.shapeGroups) {
      let shape = group.children[0];
      shape.linewidth = 1;
      shape.stroke = "black";
      const { type } = this.shapeProps.get(guid);
      if (type === EntityType.Door) {
        shape.linewidth = 0;
        shape.stroke = "transparent";
      }
    }
  };

  cleanup = () => {
    // console.log("🚀 ~ ShapeManager cleanup");
    this.shapeGroups.forEach((shape) => {
      if (shape && shape.parent) {
        // console.log("🚀 ~ cleanup ~ shape:", shape);
        shape.parent.remove(shape);
      }
    });
  };

  removeShape = (entityGUID) => {
    const shape = this.shapeGroups.get(entityGUID);
    if (shape) {
      // console.log("🚀 ~ ShapeManager ~ REMOVING:", shape);
      this.shapeGroups.delete(entityGUID);
      this.shapeProps.delete(entityGUID);
      this.drawingGroup.remove(shape);
      this.two.release(shape);
    }
    this.two.update();
  };

  snapToGrid = (shape) => {
    //gridsize is 10
    let sX = Math.round(shape.position.x / 10) * 10;
    let sY = Math.round(shape.position.y / 10) * 10;
    shape.position = new Two.Vector(sX, sY);
  };
}

export default ShapeManager;
