import PropTypes from "prop-types";
//mui
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//components
import EditEntityProperties from "../EventActionDialogs/EditEntityProperties";

export default function EntityModifierItem({
  entityToModify,
  updateEntityModifier,
  removeEntityClick,
}) {
  const deploymentColors = [
    "Gray",
    "Purple",
    "Black",
    "Blue",
    "Green",
    "Red",
    "Yellow",
    "LightBlue",
  ];

  function setChecked(value) {
    let modifier = { ...entityToModify };
    modifier.entityProperties.isActive = value;
    updateEntityModifier(modifier);
  }

  function changeColor(value) {
    let modifier = { ...entityToModify };
    modifier.entityProperties.entityColor = value;
    updateEntityModifier(modifier);
  }

  function editEntityClick() {
    EditEntityProperties.ShowDialog(
      entityToModify.entityProperties,
      false,
      (enProps) => {
        let modifier = { ...entityToModify };
        modifier.entityProperties = enProps;
        updateEntityModifier(modifier);
      }
    );
  }

  return (
    <div
      className="quad-column-grid align-center"
      style={{
        width: "100%",
        // display: "flex",
        marginBottom: ".5rem",
        justifyContent: "space-between",
      }}
    >
      <Typography>{entityToModify.entityProperties.name}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={entityToModify.entityProperties.isActive}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label="Activated/Open"
      />
      <Select
        disabled={!entityToModify.hasColor}
        value={entityToModify.entityProperties.entityColor}
        onChange={(ev) => {
          changeColor(ev.target.value);
        }}
      >
        {deploymentColors.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <div className="two-column-grid align-center">
        <Tooltip title="Modify Entity">
          <IconButton onClick={() => editEntityClick()}>
            <EditIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Entity">
          <IconButton onClick={() => removeEntityClick()}>
            <DeleteIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </div>
      <EditEntityProperties />
    </div>
  );
}

EntityModifierItem.propTypes = {
  entityToModify: PropTypes.object,
  updateEntityModifier: PropTypes.func,
  removeEntityClick: PropTypes.func,
};
