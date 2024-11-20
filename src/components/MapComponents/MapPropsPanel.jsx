import { useCallback } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
//data
import { EntityType } from "../../lib/core";
//map components
import CrateProps from "./CrateProps";

// Define components map outside the component to avoid recreating it on each render
const ENTITY_COMPONENTS = {
  [EntityType.Crate]: CrateProps,
};

const MapPropsPanel = ({
  selectedEntity,
  setActiveMapSection,
  activeMapSection,
  mapSections,
  addMapSection,
  mapEntities,
  handleRemoveEntity,
  updateEntity,
  handleEntitySelect,
}) => {
  const entityPropsChooser = useCallback(() => {
    if (selectedEntity === null) {
      console.log("🚀 ~ entityPropsChooser ~ NOTHING SELECTED");
      return (
        <>
          <Typography>Select an entity to view its properties.</Typography>
        </>
      );
    }

    // console.log("🚀 ~ entityPropsChooser: ", selectedEntity.name);
    const EntityComponent = ENTITY_COMPONENTS[selectedEntity.entityType];

    if (!EntityComponent) {
      return null;
    }

    return (
      <EntityComponent
        key={selectedEntity.GUID}
        entity={selectedEntity}
        onUpdateEntity={updateEntity}
      />
    );
  }, [selectedEntity, updateEntity]);

  return (
    <div className="map-props">
      <Paper
        sx={{
          padding: ".5rem",
          overflow: "auto",
          height: "100%",
          scrollbarColor: "#bc56ff #4c4561",
          scrollbarWidth: "thin",
        }}
      >
        <Accordion
          defaultExpanded
          sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
            Entity Actions
          </AccordionSummary>
          <AccordionDetails>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
              }}
            >
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                disabled={selectedEntity === null}
              >
                Add Duplicate
              </Button>
              <Button
                variant="contained"
                sx={{ color: "red", width: "100%" }}
                disabled={selectedEntity === null}
                onClick={handleRemoveEntity}
              >
                remove selected
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
            Map Sections
          </AccordionSummary>
          <AccordionDetails>
            <div className="simple-column">
              <div className="event-container">
                <FormControl>
                  <InputLabel>Set Active Map Section</InputLabel>
                  <Select
                    name="mapSections"
                    value={activeMapSection || ""}
                    displayEmpty
                    sx={{ width: "100%" }}
                    onChange={(e) => setActiveMapSection(e.target.value)}
                  >
                    {mapSections.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title="Add New Map Section">
                  <IconButton onClick={addMapSection}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <Tooltip title="Change The Active Map Section To The Selected Entity's Map Section Owner">
                <span>
                  <Button
                    variant="contained"
                    sx={{ width: "100%" }}
                    disabled={selectedEntity === null}
                  >
                    change active map section
                  </Button>
                </span>
              </Tooltip>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
            Tiles
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>

        <Accordion
          defaultExpanded
          sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
            Entities
          </AccordionSummary>
          <AccordionDetails>
            <div className="simple-column .scrollbar">
              <List
                sx={{
                  maxHeight: "15rem",
                  overflow: "hidden auto",
                  scrollbarColor: "#bc56ff #4c4561",
                  scrollbarWidth: "thin",
                  padding: "0",
                }}
              >
                {mapEntities.map((entity, index) => (
                  <ListItem disablePadding key={index}>
                    <ListItemButton
                      selected={selectedEntity?.GUID === entity.GUID}
                      onClick={() => handleEntitySelect(entity.GUID)}
                      onDoubleClick={() => handleEntitySelect(entity.GUID)}
                    >
                      {entity.name}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion
          defaultExpanded
          sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
            Selected Entity Properties
          </AccordionSummary>
          <AccordionDetails>{entityPropsChooser()}</AccordionDetails>
        </Accordion>
      </Paper>
    </div>
  );
};

export default MapPropsPanel;

MapPropsPanel.propTypes = {
  selectedEntity: PropTypes.object,
  setActiveMapSection: PropTypes.func.isRequired,
  activeMapSection: PropTypes.object.isRequired,
  mapSections: PropTypes.array.isRequired,
  addMapSection: PropTypes.func.isRequired,
  mapEntities: PropTypes.array.isRequired,
  handleRemoveEntity: PropTypes.func.isRequired,
  updateEntity: PropTypes.func.isRequired,
  handleEntitySelect: PropTypes.func.isRequired,
};
