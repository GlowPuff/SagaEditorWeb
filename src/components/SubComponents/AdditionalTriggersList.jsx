import { useState } from "react";
import PropTypes from "prop-types";
//mui
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
//icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
//components
import TriggerSelectAdd from "./TriggerSelectAdd";
//data
import { emptyGUID } from "../../lib/core";
import { TriggeredBy, emptyTrigger } from "../../data/Mission";
import { useTriggerStore } from "../../data/dataStore";

export default function AdditionalTriggersList({
  additionalTriggers,
  modifyTriggers,
}) {
  const missionTriggers = useTriggerStore((state) => state.missionTriggers);

  // eslint-disable-next-line no-unused-vars
  const [selectedTrigger, setSelectedTrigger] = useState([
    missionTriggers.find((x) => x.GUID === emptyGUID),
  ]);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onChangeTrigger(trigger, index) {
    let trigs = [...additionalTriggers];
    trigs = trigs.map((item, idx) => {
      if (idx === index) {
        item.triggerGUID = trigger.GUID;
        item.triggerName = trigger.name;
      }
      return item;
    });
    modifyTriggers(trigs);
  }

  function onAddTrigger() {
    modifyTriggers([...additionalTriggers, new TriggeredBy(emptyTrigger)]);
  }

  function onRemoveTrigger(index) {
    modifyTriggers(additionalTriggers.filter((x, idx) => index !== idx));
  }

  function changeValue(index, value) {
    let trigs = [...additionalTriggers];
    trigs = trigs.map((item, idx) => {
      if (idx === index) {
        item.triggerValue = value;
      }
      return item;
    });
    modifyTriggers(trigs);
  }

  return (
    <>
      <div className="add-trigger-row">
        <Typography>Triggered By...</Typography>
        <Typography>When Its Value is...</Typography>
        <Tooltip title="Add New Additional Trigger">
          <IconButton onClick={() => onAddTrigger()}>
            <AddIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </div>

      <List
        sx={{
          overflow: "auto",
          scrollbarColor: "#bc56ff #4c4561",
          scrollbarWidth: "thin",
          maxHeight: "14rem",
        }}
      >
        {additionalTriggers.map((item, index) => (
          <ListItem key={index} disablePadding>
            <div className="mod-var-grid mb-25">
              <TriggerSelectAdd
                key={item.triggerGUID} //make sure it updates upon removal
                initialGUID={item.triggerGUID}
                onItemChanged={(t) => onChangeTrigger(t, index)}
              />
              <TextField
                type="number"
                label={"Triggered By Value"}
                variant="filled"
                name="triggerValue"
                onKeyUp={onKeyUp}
                value={additionalTriggers[index].triggerValue}
                onChange={(e) => changeValue(index, e.target.value)}
                onFocus={(e) => e.target.select()}
                fullWidth
              />
              <Tooltip title="Remove Additional Trigger">
                <IconButton onClick={() => onRemoveTrigger(index)}>
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
}

AdditionalTriggersList.propTypes = {
  additionalTriggers: PropTypes.array,
  modifyTriggers: PropTypes.func,
};
