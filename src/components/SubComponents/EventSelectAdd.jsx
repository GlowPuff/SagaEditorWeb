import { useState, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
//icons
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
//my components
import QuickAddDialog from "../Dialogs/QuickAddDialog.jsx";
//data
import * as Mission from "../../data/Mission.js";
import { useEventsStore } from "../../data/dataStore.js";

export default function EventSelectAdd({ initialGUID, onItemChanged }) {
  const missionEvents = useEventsStore((state) => state.missionEvents);
  const addEvent = useEventsStore((state) => state.addEvent);
  const [selectedEvent, setSelectedEvent] = useState(
    missionEvents.find((x) => x.GUID === initialGUID) || Mission.emptyEvent
  );
  const missionRefresh = useEventsStore((state) => state.refreshToken);

  useEffect(() => {
    setSelectedEvent(
      missionEvents.find((x) => x.GUID === initialGUID) || Mission.emptyEvent
    );
  }, [missionRefresh, initialGUID, missionEvents]);

  function onChangeEvent(ev) {
    setSelectedEvent(ev);
    onItemChanged(ev);
  }

  function onAddEventClick() {
    QuickAddDialog.ShowEventDialog((evName) => {
      let newEvent = new Mission.MissionEvent(evName);
      setSelectedEvent(newEvent);
      addEvent(newEvent);
      onItemChanged(newEvent);
    });
  }

  return (
    <div className="event-container">
      <div>
        {/* MISSION EVENTS */}
        <Select
          name="eventSelectAdd"
          sx={{ width: "100%" }}
          value={selectedEvent || ""}
          onChange={(e) => onChangeEvent(e.target.value)}
          displayEmpty
        >
          {missionEvents.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <Tooltip title="Add New Event">
          <IconButton onClick={onAddEventClick}>
            <DynamicFormIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </div>
      <QuickAddDialog />
    </div>
  );
}

EventSelectAdd.propTypes = {
  onItemChanged: PropTypes.func,
  initialGUID: PropTypes.string,
};
