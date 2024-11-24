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
//map components
import EntityProps from "./EntityProps";

const MapPropsPanel = ({
  selectedEntity,
  setActiveMapSectionGUID,
  activeMapSectionGUID,
  mapSections,
  addMapSection,
  mapEntities,
  handleRemoveEntity,
  updateEntity,
  handleEntitySelect,
  onEditPropertiesClick,
}) => {
  return (
    <div className="map-props">
      <Paper
        sx={{
          padding: ".5rem",
          overflowY: "auto",
          scrollbarColor: "#bc56ff #4c4561",
          scrollbarWidth: "thin",
          height: "100%",
        }}
      >
        <Paper
          sx={{
            padding: ".5rem",
            marginBottom: ".5rem",
            backgroundColor: "#281b40",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            <span className="lime">Active Map Section:</span>
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            {mapSections.find((x) => x.GUID === activeMapSectionGUID)?.name ||
              "None"}
          </Typography>
        </Paper>

        {/* ENTITY ACTIONS SECTION */}
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

        {/* MAP SECTIONS SECTION */}
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
                    value={activeMapSectionGUID || ""}
                    displayEmpty
                    sx={{ width: "100%" }}
                    onChange={(e) => setActiveMapSectionGUID(e.target.value)}
                  >
                    {mapSections.map((item, index) => (
                      <MenuItem key={index} value={item.GUID}>
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
                    onClick={() => {
                      setActiveMapSectionGUID(selectedEntity.mapSectionOwner);
                    }}
                  >
                    change active map section
                  </Button>
                </span>
              </Tooltip>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* TILES SECTION */}
        <Accordion sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
            Tiles
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>

        {/* ENTITIES SECTION */}
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

        {/* SELECTED ENTITY PROPS SECTION */}
        <Accordion
          defaultExpanded
          sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
            Selected Entity Properties
          </AccordionSummary>
          <AccordionDetails>
            {selectedEntity === null && (
              <Typography>Select an entity to view its properties.</Typography>
            )}
            {selectedEntity !== null && (
              <EntityProps
                key={selectedEntity.GUID}
                entity={selectedEntity}
                onUpdateEntity={updateEntity}
                activeMapSectionGUID={activeMapSectionGUID}
                onEditPropertiesClick={onEditPropertiesClick}
              />
            )}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </div>
  );
};

export default MapPropsPanel;

MapPropsPanel.propTypes = {
  selectedEntity: PropTypes.object,
  setActiveMapSectionGUID: PropTypes.func.isRequired,
  activeMapSectionGUID: PropTypes.string,
  mapSections: PropTypes.array.isRequired,
  addMapSection: PropTypes.func.isRequired,
  mapEntities: PropTypes.array.isRequired,
  handleRemoveEntity: PropTypes.func.isRequired,
  updateEntity: PropTypes.func.isRequired,
  handleEntitySelect: PropTypes.func.isRequired,
	onEditPropertiesClick: PropTypes.func.isRequired,
};
