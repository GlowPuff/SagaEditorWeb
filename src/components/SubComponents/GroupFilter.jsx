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
import { useToonsStore } from "../../data/dataStore";
import { CharacterType } from "../../lib/core";

export default function GroupFilter({
  title = "Enemy Groups",
  dataType = "enemy", //ally, hero, heroally, allyrebel, heroallyrebel
  onAdd = () => {}, //returns group {name,id}
  onRemove = () => {}, //returns index
  groupList = [], //array of {name,id}
}) {
  const toons = useToonsStore((state) => state.customCharacters);
  const [unfiltered, setUnfiltered] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [listOfGroups, setListOfGroups] = useState(groupList);

  useEffect(() => {
    const filterFunc = () => {
      const customGroups = toons.map((toon) => toon.deploymentCard);
      // console.log("❗ :: filterFunc :: customGroups::", customGroups);
      if (dataType === "enemy") {
        return [
          ...enemyData,
          ...villainData,
          ...customGroups.filter(
            (t) =>
              t.characterType === CharacterType.Imperial ||
              t.characterType === CharacterType.Villain
          ),
        ];
      } else if (dataType === "ally") {
        return [
          ...allyData,
          ...customGroups.filter((t) => t.characterType === CharacterType.Ally),
        ];
      } else if (dataType === "hero") {
        return [
          ...heroData,
          ...customGroups.filter((t) => t.characterType === CharacterType.Hero),
        ];
      } else if (dataType === "heroally") {
        return [
          ...heroData,
          ...allyData,
          ...customGroups.filter(
            (t) =>
              t.characterType === CharacterType.Hero ||
              t.characterType === CharacterType.Ally
          ),
        ];
      } else if (dataType === "allyrebel") {
        return [
          ...allyData,
          ...customGroups.filter(
            (t) =>
              t.characterType === CharacterType.Ally ||
              t.characterType === CharacterType.Rebel
          ),
        ];
      }
			else if (dataType === "heroallyrebel") {
				return [
					...heroData,
					...allyData,
					...customGroups.filter(
						(t) =>
							t.characterType === CharacterType.Hero ||
							t.characterType === CharacterType.Ally ||
							t.characterType === CharacterType.Rebel
					),
				];
			}
    };
    setUnfiltered(filterFunc());
    setSelectedGroup(filterFunc()[0]);
    setGroupData(filterFunc());
  }, [dataType, toons]);

  //return core groups, filter out custom toons that no longer exist
  // function verifyCustomToons(groupsToVerify) {
  //   if (groupsToVerify.length === 0) return groupsToVerify;
  //   //first get only the core groups whose id does not start with TC
  //   const coreGroups = groupsToVerify.filter(
  //     (group) => !group.id.startsWith("TC")
  //   );
  //   //then get only the custom groups
  //   const customGroups = groupsToVerify.filter((group) =>
  //     group.id.startsWith("TC")
  //   );
  //   //then filter out the custom toons that are no longer in "toons"
  //   const filteredCustomGroups = customGroups.filter((group) =>
  //     toons.some((t) => t.deploymentCard.id === group.id)
  //   );
  //   //then return the core groups and the filtered custom groups
  //   return [...coreGroups, ...filteredCustomGroups];
  //   // return groupsToVerify.filter(group =>
  //   //   toons.some((t) => t.deploymentCard.id === group.id)
  //   // );
  // }

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
