import Two from "two.js";
import { EntityType } from "../lib/core";

class ShapeManager {
  constructor(two, drawingGroup, zui) {
    this.two = two;
    this.drawingGroup = drawingGroup;
    this.zui = zui;
    this.shapeGroups = new Map(); // GUID -> Two.js shape
    this.selectedShape = null; // { guid, shape, twoID }, shape is usually a group
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
        this.addConsole(entity);
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

    // console.log("🚀 ~ ShapeManager ~ addCrate ~");
    const crateGroup = new Two.Group();
    const shape = new Two.Rectangle(0, 0, 10, 10);
    crateGroup.position = new Two.Vector(position.x, position.y);

    //set origin to upper left corner
    shape.origin = new Two.Vector(-5, -5);

    shape.fill = entity.entityProperties.entityColor;
    shape.stroke = "black";
    shape.linewidth = 1;

    //add the letter C text to the crate
    const text = new Two.Text(
      "C",
      5, //half the width of the crate
      1 + 5
    );
    text.fill = "white";

    text.size = 10;
    text.family = "Arial";
    text.alignment = "center";
    text.baseline = "middle";

    crateGroup.add(shape);
    crateGroup.add(text);
    this.drawingGroup.add(crateGroup);
    this.shapeGroups.set(entity.GUID, crateGroup);

    return shape;
  };

  addDoor = (entity) => {
    const [x, y] = entity.entityPosition.split(",");
    const position = { x: parseFloat(x), y: parseFloat(y) };
  };

  //mouse position are in surface coordinates
  //returns true if a shape was selected
  onMouseDown = ({ mouseX, mouseY }) => {
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
        this.isDraggingShape = true;
        this.dragOffset.x = mouseX - group.position.x;
        this.dragOffset.y = mouseY - group.position.y;

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

    // return isShapeSelected;
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

  getShapeFromGUID = (guid) => {
    return this.shapeGroups.get(guid);
  };

  //explicitly select a shape
  selectShape = (guid) => {
    this.unselectAll();
    if (!guid) return;

    //console.log("🚀 ~ ShapeManager ~ finding guid:", guid);

    let group = this.shapeGroups.get(guid);
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
    for (const [, group] of this.shapeGroups) {
      let shape = group.children[0];
      shape.linewidth = 1;
      shape.stroke = "black";
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

  // updateShape(entity) {
  //   const shape = this.shapes.get(entity.GUID);
  //   if (shape) {
  //     shape.translation.set(entity.position.x, entity.position.y);
  //     shape.rotation = entity.rotation || 0;
  //   }
  //   this.two.update();
  // }

  removeShape = (guid) => {
    const shape = this.shapeGroups.get(guid);
    if (shape) {
      console.log("🚀 ~ ShapeManager ~ REMOVING:", shape);
      this.shapeGroups.delete(guid);
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
