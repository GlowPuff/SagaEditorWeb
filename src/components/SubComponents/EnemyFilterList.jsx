import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
//mui
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
//icons
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
//data
import { enemyData, villainData } from "../../data/carddata";
import { useToonsStore } from "../../data/dataStore";
import { CharacterType } from "../../lib/core";

export default function EnemyFilterList({
  title,
  onGroupChanged = () => {},
  initialAddedGroups = [],
  alternateView = false,
  onAddInitial,
  onAddReserved,
}) {
  const toons = useToonsStore((state) => state.customCharacters);
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Stormtrooper [DG001]");
  const [addedGroups, setAddedGroups] = useState(initialAddedGroups);
  const [selectedRemoveGroup, setSelectedRemoveGroup] = useState(
    initialAddedGroups.length ? initialAddedGroups[0] : ""
  );

  useEffect(() => {
    if (initialAddedGroups.length) {
      setAddedGroups(initialAddedGroups);
      setSelectedRemoveGroup(initialAddedGroups[0]);
    } else {
      setAddedGroups([]);
      setSelectedRemoveGroup("");
    }
  }, [initialAddedGroups]);

  // build groupData ("Name [ID]") based on dependencies
  const originalGroupData = useMemo(() => {
    const baseGroups = [...enemyData, ...villainData].map(
      (item) => `${item.name} [${item.id}]`
    );
    const customGroups = toons
      .filter(
        (t) =>
          t.deploymentCard.characterType === CharacterType.Imperial ||
          t.deploymentCard.characterType === CharacterType.Villain
      )
      .map((toon) => toon.deploymentCard)
      .map((item) => `${item.name} [${item.id}]`);
    return [...baseGroups, ...customGroups];
  }, [toons]);

  const transformedEnemies = enemyData.map(
    (item) => `${item.name} [${item.id}]`
  );
  const transformedVillains = villainData.map(
    (item) => `${item.name} [${item.id}]`
  );
  const transformedCustomToons = toons
    .filter(
      (t) =>
        t.deploymentCard.characterType === CharacterType.Imperial ||
        t.deploymentCard.characterType === CharacterType.Villain
    )
    .map((toon) => toon.deploymentCard)
    .map((item) => `${item.name} [${item.id}]`);

  const [groupData, setGroupData] = useState([
    ...transformedEnemies,
    ...transformedVillains,
    ...transformedCustomToons,
  ]);

  function onAddInitialGroup() {
    let idx = selectedGroup.lastIndexOf(" ");
    const regex = /\[(.*?)\]/;
    const match = selectedGroup.match(regex);
    onAddInitial([selectedGroup.slice(0, idx).trim(), match[1]]);
    setFilterTerm("");
    setGroupData([
      ...transformedEnemies,
      ...transformedVillains,
      ...transformedCustomToons,
    ]);
  }

  function onAddReservedGroup() {
    let idx = selectedGroup.lastIndexOf(" ");
    const regex = /\[(.*?)\]/;
    const match = selectedGroup.match(regex);
    onAddReserved([selectedGroup.slice(0, idx).trim(), match[1]]);
    setFilterTerm("");
    setGroupData([
      ...transformedEnemies,
      ...transformedVillains,
      ...transformedCustomToons,
    ]);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) {
      ev.target.blur();
      if (filterTerm.trim() !== "") onAddGroupClick();
      setSelectedGroup("Stormtrooper [DG001]");
      setGroupData([
        ...transformedEnemies,
        ...transformedVillains,
        ...transformedCustomToons,
      ]);
    }
  }

  function onUpdateFilter(term) {
    setFilterTerm(term);
    //update the group list
    if (term.trim() !== "") {
      let filtered = originalGroupData.filter((item) =>
        item.toLowerCase().includes(term.toLowerCase())
      );
      if (filtered.length) {
        setSelectedGroup(filtered[0]);
        setGroupData(filtered);
      } else {
        setSelectedGroup("");
        setGroupData([]);
      }
    } else {
      setSelectedGroup("Stormtrooper [DG001]");
      setGroupData([
        ...transformedEnemies,
        ...transformedVillains,
        ...transformedCustomToons,
      ]);
    }
  }

  function onAddGroupClick() {
    if (!addedGroups.includes(selectedGroup)) {
      setAddedGroups([...addedGroups, selectedGroup]);
      setSelectedRemoveGroup(selectedGroup);
      setFilterTerm("");
      setGroupData([
        ...transformedEnemies,
        ...transformedVillains,
        ...transformedCustomToons,
      ]);
      //transform groups back into just the id, text between []
      let propgroups = [];
      const regex = /\[(.*?)\]/;
      [...addedGroups, selectedGroup].map((item) => {
        const match = item.match(regex);
        propgroups.push(match[1]);
      });
      onGroupChanged(propgroups);
    }
  }

  function onRemoveGroupClick() {
    let groups = addedGroups.filter((item) => item !== selectedRemoveGroup);
    setSelectedRemoveGroup(groups[0] || "");
    setAddedGroups(groups);
    //transform groups back into just the id, text between []
    let propgroups = [];
    const regex = /\[(.*?)\]/;
    groups.map((item) => {
      const match = item.match(regex);
      propgroups.push(match[1]);
    });
    onGroupChanged(propgroups);
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

      {/* MASTER LIST OF GROUPS */}
      <div className="event-container" style={{ marginBottom: ".5rem" }}>
        <div>
          <Select
            sx={{ width: "100%" }}
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            displayEmpty
          >
            {groupData.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ display: alternateView ? "none" : "" }}>
          <Tooltip title="Add Group to List">
            <IconButton onClick={onAddGroupClick}>
              <PersonAddAlt1Icon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* ADDED GROUPS */}
      <Typography variant="button">{title}</Typography>
      <div
        className="event-container"
        style={{
          marginBottom: ".5rem",
          display: alternateView ? "none" : "",
        }}
      >
        <div>
          <Select
            sx={{ width: "100%" }}
            value={selectedRemoveGroup}
            onChange={(e) => setSelectedRemoveGroup(e.target.value)}
            displayEmpty
          >
            {addedGroups.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <Tooltip title="Remove Group From List">
            <IconButton onClick={onRemoveGroupClick}>
              <PersonRemoveIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* ALTERNATE UI FOR INITIAL/RESERVED GROUPS */}
      <div
        style={{
          display: alternateView ? "" : "none",
        }}
        className="event-container"
      >
        <div>
          <Button variant="contained" onClick={onAddInitialGroup}>
            add to initial groups
          </Button>
        </div>
        <div>
          <Button variant="contained" onClick={onAddReservedGroup}>
            add to reserved groups
          </Button>
        </div>
      </div>
    </div>
  );
}

EnemyFilterList.propTypes = {
  setPropValue: PropTypes.func,
  onAddInitial: PropTypes.func,
  onAddReserved: PropTypes.func,
  title: PropTypes.string,
  onGroupChanged: PropTypes.func,
  initialAddedGroups: PropTypes.array,
  alternateView: PropTypes.bool,
};
