import { useState, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
//icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
//data
import {
  enemyData,
  villainData,
  allyData,
  heroData,
} from "../../data/carddata";

export default function GroupFilter({
  title = "Enemy Groups",
  dataType = "enemy", //ally, hero, heroally
  onAdd = () => {}, //returns group {name,id}
  onRemove = () => {}, //returns index
  groupList = [], //array of {name,id}
}) {
  const [unfiltered, setUnfiltered] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [listOfGroups, setListOfGroups] = useState(groupList);

  useEffect(() => {
    const filterFunc = () => {
      if (dataType === "enemy") {
        return [...enemyData, ...villainData];
      } else if (dataType === "ally") {
        return [...allyData];
      } else if (dataType === "hero") {
        return [...heroData];
      } else if (dataType === "heroally") {
        return [...heroData, ...allyData];
      }
    };
    setUnfiltered(filterFunc());
    setSelectedGroup(filterFunc()[0]);
    setGroupData(filterFunc());
  }, [dataType]);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) {
      ev.target.blur();
      if (filterTerm.trim() !== "" && groupData.length > 0) onAddGroupClick();
      setSelectedGroup(unfiltered[0]);
      setGroupData([...unfiltered]);
    }
  }

  function onAddGroupClick() {
    onAdd(selectedGroup);
    setFilterTerm("");
    setGroupData([...unfiltered]);
    setListOfGroups([...listOfGroups, selectedGroup]);
  }

  function onRemoveGroupClick(index) {
    onRemove(index);
    setListOfGroups(listOfGroups.filter((x, idx) => idx !== index));
    setFilterTerm("");
    setGroupData([...unfiltered]);
  }

  function onUpdateFilter(term) {
    setFilterTerm(term);
    if (term.trim() !== "") {
      let filtered = unfiltered.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      if (filtered.length) {
        setSelectedGroup(filtered[0]);
        setGroupData(filtered);
      } else {
        setSelectedGroup("");
        setGroupData([]);
      }
    } else {
      setSelectedGroup(unfiltered[0]);
      setGroupData([...unfiltered]);
    }
  }

  return (
    <div>
      <TextField
        label={"Filter Term"}
        variant="filled"
        value={filterTerm}
        onChange={(e) => onUpdateFilter(e.target.value)}
        onFocus={(e) => e.target.select()}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: ".5rem" }}
      />

      {/* LIST OF GROUPS */}
      <div className="event-container mt-1">
        <FormControl>
          <InputLabel>{title}</InputLabel>
          <Select
            sx={{ width: "100%" }}
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            displayEmpty
          >
            {groupData.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item.name}: {item.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Add Group">
          <IconButton onClick={onAddGroupClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* GROUP LIST */}
      <Paper
        sx={{
          padding: ".5rem",
          marginTop: ".5rem",
          display: listOfGroups.length > 0 ? "" : "none",
        }}
      >
        <List
          sx={{
            overflow: "hidden auto",
            scrollbarColor: "#bc56ff #4c4561",
            scrollbarWidth: "thin",
            maxHeight: "14rem",
          }}
        >
          {listOfGroups.map((item, index) => (
            <div key={index} className="event-container">
              <ListItem key={index} disablePadding>
                <div
                  className="two-column-grid align-center"
                  style={{
                    width: "100%",
                  }}
                >
                  <div>
                    <Typography sx={{ paddingLeft: ".5rem" }}>
                      {item.name}: {item.id}
                    </Typography>
                  </div>
                  <div
                    style={{
                      justifySelf: "end",
                    }}
                  >
                    <Tooltip title="Remove Group">
                      <IconButton onClick={() => onRemoveGroupClick(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </ListItem>
            </div>
          ))}
        </List>
      </Paper>
    </div>
  );
}

GroupFilter.propTypes = {
  title: PropTypes.string,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  dataType: PropTypes.string,
  groupList: PropTypes.array,
};
