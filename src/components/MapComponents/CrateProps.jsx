// import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
//mui
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//data store
import { useMapSectionsStore } from "../../data/dataStore";

const CrateProps = ({ entity, onUpdateEntity }) => {
  const [entityName, setEntityName] = useState(entity.name);
  const [checked, setChecked] = useState(entity.entityProperties.isActive);
  const mapSections = useMapSectionsStore((state) => state.mapSections);

  // useEffect(() => {
  //   console.log("CrateProps ~ INIT", entity);
  // });

  function updateEntity(prop, value) {
    let updated = { ...entity };
    updated[prop] = value;
    console.log("🚀 ~ updateEntity ~ updated:", updated);
    onUpdateEntity(updated);
  }

  function updateEntityProperies(prop, value) {
    let updated = { ...entity };
    updated.entityProperties[prop] = value;
    onUpdateEntity(updated);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  return (
    <div className="entityProperties">
      <Typography variant="button">Crate Properties</Typography>
      <TextField
        required
        fullWidth
        label={"Entity Name"}
        value={entityName}
        variant="filled"
        onFocus={(e) => e.target.select()}
        onChange={(e) => setEntityName(e.target.value)}
        onKeyUp={onKeyUp}
        onBlur={(e) => updateEntity("name", e.target.value)}
      />
      <Typography sx={{ color: "#9ed9fe" }}>
        Current Map Section Owner:{" "}
        <span style={{ color: "#bc56ff" }}>
          {mapSections.find((x) => x.GUID === entity.ownerGUID)?.name || "None"}
        </span>
      </Typography>
      <Tooltip title="Change the Map Section that contains this Entity">
        <Button variant="contained">change owner</Button>
      </Tooltip>

      <FormControlLabel
        control={
          <Checkbox
            name="isActive"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              updateEntityProperies("isActive", e.target.checked);
            }}
          />
        }
        label="Is Active?"
      />
    </div>
  );
};

export default CrateProps;

//add prop types
CrateProps.propTypes = {
  entity: PropTypes.object.isRequired,
  onUpdateEntity: PropTypes.func.isRequired,
};
