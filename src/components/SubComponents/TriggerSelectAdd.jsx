import { useState } from "react";
import PropTypes from "prop-types";
//mui
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
//icons
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
//my components
import QuickAddDialog from "../Dialogs/QuickAddDialog.jsx";
//data
import * as Mission from "../../data/Mission.js";
import { emptyGUID } from "../../lib/core.js";
import { useTriggerStore } from "../../data/dataStore.js";

export default function TriggerSelectAdd({
  initialGUID = emptyGUID,
  onItemChanged,
}) {
  const missionTriggers = useTriggerStore((state) => state.missionTriggers);
  const addTrigger = useTriggerStore((state) => state.addTrigger);
  const [selectedTrigger, setSelectedTrigger] = useState(
    missionTriggers.find((x) => x.GUID === initialGUID)
  );

  function onChangeEvent(ev) {
    setSelectedTrigger(ev);
    onItemChanged(ev);
  }

  function onAddTriggerClick() {
    QuickAddDialog.ShowTriggerDialog((evName) => {
      let newTrigger = new Mission.MissionTrigger(evName);
      setSelectedTrigger(newTrigger);
      addTrigger(newTrigger);
      onItemChanged(newTrigger);
    });
  }

  return (
    <div className="event-container">
      <div>
        {/* MISSION TRIGGERS */}
        <Select
          sx={{ width: "100%" }}
          value={selectedTrigger || ""}
          onChange={(e) => onChangeEvent(e.target.value)}
          displayEmpty
        >
          {missionTriggers.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <Tooltip title="Add New Trigger">
          <IconButton
            onClick={onAddTriggerClick}
            sx={{ width: "32px", height: "32px" }}
          >
            <ToggleOnIcon />
          </IconButton>
        </Tooltip>
      </div>
      <QuickAddDialog />
    </div>
  );
}

TriggerSelectAdd.propTypes = {
  onItemChanged: PropTypes.func,
  initialGUID: PropTypes.string,
};
