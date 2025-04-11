// import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
//data store
import { useMapSectionsStore } from "../../data/dataStore";
//data
import { DeploymentColors, EntityType } from "../../lib/core";
import { MarkerType } from "../../lib/core";

const entityNames = [
  "Tile",
  "Terminal",
  "Crate",
  "Deployment Point",
  "Token",
  "Highlight",
  "Door",
];

const EntityProps = ({
  entity,
  onUpdateEntity,
  activeMapSectionGUID,
  onEditPropertiesClick,
}) => {
  const [entityName, setEntityName] = useState(entity.name);
  const [checked, setChecked] = useState(entity.entityProperties.isActive);
  const mapSections = useMapSectionsStore((state) => state.mapSections);

  function updateEntityProperies(prop, value) {
    let updated = { ...entity };
    updated.entityProperties[prop] = value;
    onUpdateEntity(updated);
  }

  function updateName(value) {
    let updated = { ...entity };
    updated.name = value;
    updated.entityProperties.entityName = value;
    onUpdateEntity(updated);
  }

  function updateColor(value) {
    let updated = { ...entity };
    updated.entityProperties.entityColor = value;
    updated.deploymentColor = value;
    // console.log("🚀 ~ updateColor ~ updated:", updated);
    onUpdateEntity(updated);
  }

  function updateOwner() {
    let updated = { ...entity };
    updated.mapSectionOwner = activeMapSectionGUID;
    onUpdateEntity(updated);
  }

  function updateDuration(value) {
    let updated = { ...entity };
    updated.Duration = value;
    onUpdateEntity(updated);
  }

  function updateSize(w, h) {
    let updated = { ...entity };
    updated.Width = w;
    updated.Height = h;
    onUpdateEntity(updated);
  }

  function setTileSide(value) {
    let updated = { ...entity };
    updated.tileSide = value;
    //update the texture name
    updated.textureName =
      updated.textureName.substring(0, updated.textureName.length - 1) + value;
    onUpdateEntity(updated);
  }

  function updaterMarkerType(value) {
    let updated = { ...entity };
    updated.markerType = value;
    onUpdateEntity(updated);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  return (
    <div className="entityProperties">
      {/* <Typography variant="button">{entityNames[entity.entityType]}</Typography> */}
      <TextField
        required
        fullWidth
        label={"Entity Name"}
        value={entityName}
        variant="filled"
        onFocus={(e) => e.target.select()}
        onChange={(e) => setEntityName(e.target.value)}
        onKeyUp={onKeyUp}
        onBlur={(e) => updateName(e.target.value)}
      />

      {entity.entityType !== EntityType.Tile && (
        <Button variant="contained" onClick={onEditPropertiesClick}>
          {entityNames[entity.entityType]} properties...
        </Button>
      )}

      {/* OWNER */}
      <Paper
        sx={{
          padding: ".5rem",
          backgroundColor: "#472c61",
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        <Typography sx={{ color: "#9ed9fe" }}>
          Current Map Section Owner:
        </Typography>
        <Typography>
          <span style={{ color: "#bc56ff" }}>
            {mapSections.find((x) => x.GUID === entity.mapSectionOwner)?.name ||
              "None"}
          </span>
        </Typography>

        <Tooltip title="Change the Map Section that contains this Entity">
          <Button onClick={updateOwner} variant="contained">
            change owner
          </Button>
        </Tooltip>

        <Typography sx={{ color: "#ee82e5" }}>
          Changes the Map Section owner to the Active Map Section.
        </Typography>
      </Paper>

      {/* TILE SIDE */}
      {entity.entityType === EntityType.Tile && (
        <Paper sx={{ padding: ".5rem", backgroundColor: "#472c61" }}>
          <div className="simple-column" style={{ justifySelf: "center" }}>
            <Typography>Tile Side</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={entity.tileSide === "A"}
                  onChange={(e) => {
                    setTileSide(e.target.checked ? "A" : "B");
                  }}
                />
              }
              label={`Side ${entity.tileSide}`}
            />
          </div>
        </Paper>
      )}

      {/* IS ACTIVE */}
      <Paper sx={{ padding: ".5rem", backgroundColor: "#472c61" }}>
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
          label={
            entity.entityType !== EntityType.Door ? "Is Active" : "Door Status"
          }
        />
        {entity.entityType !== EntityType.Door && (
          <Typography sx={{ color: checked ? "lime" : "red" }}>
            Entity is {checked ? "" : " not "} Active
          </Typography>
        )}
        {entity.entityType === EntityType.Door && (
          <Typography sx={{ color: checked ? "lime" : "red" }}>
            Door is {checked ? "" : " not "} Open
          </Typography>
        )}
      </Paper>

      {/* COLOR */}
      {entity.entityType !== EntityType.Door &&
        entity.entityType !== EntityType.Tile && (
          <Paper sx={{ padding: ".5rem", backgroundColor: "#472c61" }}>
            <FormControl sx={{ marginTop: ".5rem", width: "100%" }}>
              <InputLabel>Entity Color</InputLabel>
              <Select
                name="mapSections"
                value={entity.entityProperties.entityColor || ""}
                displayEmpty
                sx={{ width: "100%" }}
                onChange={(e) => updateColor(e.target.value)}
              >
                {DeploymentColors.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}

      {/* MARKER */}
      {entity.entityType === EntityType.Token && (
        <Paper sx={{ padding: ".5rem", backgroundColor: "#472c61" }}>
          <Typography>Marker Type</Typography>
          <Select
            fullWidth
            value={entity.markerType }
            displayEmpty
            sx={{ width: "100%" }}
            onChange={(e) => updaterMarkerType(e.target.value)}
          >
            <MenuItem value={MarkerType.Neutral}>Neutral</MenuItem>
            <MenuItem value={MarkerType.Rebel}>Rebel</MenuItem>
            <MenuItem value={MarkerType.Imperial}>Imperial</MenuItem>
          </Select>
        </Paper>
      )}

      {/* HIGHLIGHT */}
      {entity.entityType === EntityType.Highlight && (
        <Paper sx={{ padding: ".5rem", backgroundColor: "#472c61" }}>
          <Typography>Duration in Rounds</Typography>
          <Typography className="pink">0 = Infinite</Typography>
          <TextField
            type="number"
            value={entity.Duration || 0}
            onChange={(e) => updateDuration(parseInt(e.target.value))}
            onKeyUp={onKeyUp}
          />
        </Paper>
      )}

      {entity.entityType === EntityType.Highlight && (
        <Paper sx={{ padding: ".5rem", backgroundColor: "#472c61" }}>
          <Typography>Highlight Size</Typography>
          <TextField
            label="Width"
            type="number"
            value={entity.Width || 0}
            onChange={(e) =>
              updateSize(parseInt(e.target.value), entity.Height)
            }
            onKeyUp={onKeyUp}
          />
          <TextField
            style={{ marginTop: "1rem" }}
            label="Height"
            type="number"
            value={entity.Height || 0}
            onChange={(e) => updateSize(entity.Width, parseInt(e.target.value))}
            onKeyUp={onKeyUp}
          />
        </Paper>
      )}
    </div>
  );
};

export default EntityProps;

//add prop types
EntityProps.propTypes = {
  entity: PropTypes.object,
  onUpdateEntity: PropTypes.func.isRequired,
  activeMapSectionGUID: PropTypes.string,
  onEditPropertiesClick: PropTypes.func,
};
