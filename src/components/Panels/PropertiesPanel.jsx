import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
//icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//dialog
import EventGroupDialog from "../Dialogs/EventGroupDialog";
import EntityGroupDialog from "../Dialogs/EntityGroupDialog";
//data
import * as Mission from "../../data/Mission";
//store
import { useEventGroupStore, useEntityGroupStore } from "../../data/dataStore";

export default function PropertiesPanel({
  setPropValue,
  missionProps,
  value,
  index,
}) {
  //event group store
  const eventGroups = useEventGroupStore((state) => state.eventGroups);
  const addEVGroup = useEventGroupStore((state) => state.addGroup);
  const updateEVGroup = useEventGroupStore((state) => state.updateGroup);
  const removeEVGroup = useEventGroupStore((state) => state.removeGroup);
  const selectedEventGroup = useEventGroupStore(
    (state) => state.selectedEventGroup
  );
  const setSelectedEventGroup = useEventGroupStore(
    (state) => state.setSelectedEventGroup
  );
  //entity group store
  const entityGroups = useEntityGroupStore((state) => state.entityGroups);
  const addENGroup = useEntityGroupStore((state) => state.addGroup);
  const updateENGroup = useEntityGroupStore((state) => state.updateGroup);
  const removeENGroup = useEntityGroupStore((state) => state.removeGroup);
  const selectedEntityGroup = useEntityGroupStore(
    (state) => state.selectedEntityGroup
  );
  const setSelectedEntityGroup = useEntityGroupStore(
    (state) => state.setSelectedEntityGroup
  );

  function onChangeEventGroup(value) {
    setSelectedEventGroup(eventGroups.find((x) => x.GUID === value.GUID));
  }

  function modifyEvGroupClick(command) {
    if (command === "add") {
      EventGroupDialog.ShowDialog(new Mission.EventGroup(), (value) => {
        addEVGroup(value);
        setSelectedEventGroup(value);
      });
    } else if (command === "remove") {
      removeEVGroup(selectedEventGroup);
      setSelectedEventGroup("");
    } else if (command == "edit") {
      EventGroupDialog.ShowDialog(selectedEventGroup, (value) => {
        updateEVGroup(value);
        setSelectedEventGroup(value);
      });
    }
  }

  function modifyEnGroupClick(command) {
    if (command === "add") {
      EntityGroupDialog.ShowDialog(new Mission.EntityGroup(), (value) => {
        addENGroup(value);
        setSelectedEntityGroup(value);
      });
    } else if (command === "remove") {
      removeENGroup(selectedEntityGroup);
      setSelectedEntityGroup("");
    } else if (command === "edit") {
      EntityGroupDialog.ShowDialog(selectedEntityGroup, (value) => {
        updateENGroup(value);
        setSelectedEntityGroup(value);
      });
    }
  }

  return (
    <div hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && (
        <div className="mission-panel">
          {/* LEFT  */}
          <Paper sx={{ padding: ".5rem" }}>
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">
                Event and Entity Groups
              </AccordionSummary>
              <AccordionDetails>
                <Paper
                  sx={{
                    padding: ".5rem",
                    marginBottom: ".5rem",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ee82e5",
                      marginBottom: "1rem",
                    }}
                  >
                    {eventGroups.length} Event Group(s) in the Mission
                  </Typography>
                  <div className="group-column-grid">
                    <FormControl>
                      <InputLabel id="eventGroups">Event Groups</InputLabel>
                      <Select
                        id="eventGroups"
                        name="eventGroups"
                        value={selectedEventGroup || ""}
                        onChange={(e) => onChangeEventGroup(e.target.value)}
                        displayEmpty
                      >
                        {eventGroups.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Tooltip title="Add New Event Group">
                      <IconButton onClick={() => modifyEvGroupClick("add")}>
                        <AddIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Event Group">
                      <span>
                        <IconButton
                          disabled={selectedEventGroup === ""}
                          onClick={() => modifyEvGroupClick("edit")}
                        >
                          <EditIcon fontSize="medium" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Remove Event Group">
                      <span>
                        <IconButton
                          disabled={selectedEventGroup === ""}
                          onClick={() => modifyEvGroupClick("remove")}
                        >
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </Paper>
                <Paper sx={{ padding: ".5rem" }}>
                  <Typography
                    sx={{
                      color: "#ee82e5",
                      marginBottom: "1rem",
                    }}
                  >
                    {entityGroups.length} Random Map Entity Group(s) in the
                    Mission
                  </Typography>
                  <div className="group-column-grid">
                    <FormControl>
                      <InputLabel id="entityGroups">Entity Groups</InputLabel>
                      <Select
                        id="entityGroups"
                        name="entityGroups"
                        value={selectedEntityGroup || ""}
                        onChange={(e) => setSelectedEntityGroup(e.target.value)}
                        displayEmpty
                      >
                        {entityGroups.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Tooltip title="Add New Entity Group">
                      <IconButton onClick={() => modifyEnGroupClick("add")}>
                        <AddIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Entity Group">
                      <span>
                        <IconButton
                          disabled={selectedEntityGroup === ""}
                          onClick={() => modifyEnGroupClick("edit")}
                        >
                          <EditIcon fontSize="medium" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Remove Entity Group">
                      <span>
                        <IconButton
                          disabled={selectedEntityGroup === ""}
                          onClick={() => modifyEnGroupClick("remove")}
                        >
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* RIGHT  */}
          <Paper sx={{ padding: ".5rem" }}>
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">
                Event System
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="factionImperial"
                      checked={missionProps.useAlternateEventSystem}
                      onChange={(e) =>
                        setPropValue(
                          "useAlternateEventSystem",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Use Alternate Event System"
                />
                <Typography
                  sx={{
                    color: "#ee82e5",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                  }}
                >
                  The Alternate Event System queues new Events at the END OF THE
                  QUEUE, as opposed to queuing them to trigger or fire
                  IMMEDIATELY after the currently processing Event. This applies
                  to explicitly fired Events as well as Events that trigger
                  themselves after reacting to changing Mission conditions.
                </Typography>
                <Typography
                  sx={{
                    color: "orange",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                  }}
                >
                  This option may be necessary for Missions with intricate
                  timing and triggering systems that respond to Mission
                  conditions.
                </Typography>
                <Typography
                  sx={{
                    color: "red",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                  }}
                >
                  This option will affect ALL Events in this Mission.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </div>
      )}
      <EventGroupDialog />
      <EntityGroupDialog />
    </div>
  );
}

PropertiesPanel.propTypes = {
  setPropValue: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  missionProps: PropTypes.object.isRequired,
};
