//utility class to build shapes based off of the shape store object
export default class ShapeBuilder {
  constructor(two, group) {
    this.two = two;
    this.mainGroup = group;
  }

  //build shape based off of the shape store object
  buildShape = (shape) => {
    switch (shape.type) {
      case "crate":
        this.buildCrate(shape);
        break;
      case "door":
        this.buildDoor(shape);
        break;
      case "enemy":
        this.buildEnemy(shape);
        break;
      case "objective":
        this.buildObjective(shape);
        break;
      case "token":
        this.buildToken(shape);
        break;
      case "waypoint":
        this.buildWaypoint(shape);
        break;
      default:
        break;
    }
  };

  //shape is from the entity shape store
  buildCrate = (shape) => {
    console.log("Building crate", shape);

    const crateGroup = new this.two.Group();

    const crate = new this.two.Rectangle(
      shape.position.x,
      shape.position.y,
      shape.dimensions.width,
      shape.dimensions.height
    );

    //set origin to upper left corner
    crate.origin = new this.two.Vector(
      -shape.dimensions.width / 2,
      -shape.dimensions.height / 2
    );

    crate.fill = shape.fill; // "#8855ff";
    crate.stroke = shape.stroke;
    crate.linewidth = 1;

    if (shape.isSelected) {
      crate.linewidth = 2;
      crate.stroke = "white";
    }

    //add the letter C text to the crate
    const text = new this.two.Text(
      "C",
      shape.position.x + shape.dimensions.width / 2,
      shape.position.y + 1 + shape.dimensions.height / 2
    );
    text.fill = "white";

    text.size = 10;
    text.family = "Arial";
    text.alignment = "center";
    text.baseline = "middle";

    crateGroup.add(crate);
    crateGroup.add(text);

    this.mainGroup.add(crateGroup);
  };
}
