import { useState } from "react";
import PropTypes from "prop-types";
//mui
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
//data
import {
  allyData,
  heroData,
  enemyData,
  villainData,
} from "../../data/carddata";

export default function TriggeredByTriggers({ missionEvent, modifyEvent }) {
  const [allyDefeated, setAllyDefeated] = useState(
    allyData.find((x) => x.id === missionEvent.allyDefeated)
  );
  const [heroWounded, setHeroWounded] = useState(
    heroData.find((x) => x.id === missionEvent.heroWounded)
  );
  const [heroWithdraws, setHeroWithdraws] = useState(
    heroData.find((x) => x.id === missionEvent.heroWithdraws)
  );
  const [enemyActivate, setEnemyActivate] = useState(
    [...enemyData, ...villainData].find(
      (x) => x.id === missionEvent.activationOf
    )
  );

  function changeAllyDefeated(value) {
    setAllyDefeated(value);
    modifyEvent("allyDefeated", value.id);
  }

  function changeHeroWounded(value) {
    setHeroWounded(value);
    modifyEvent("heroWounded", value.id);
  }

  function changeHeroWithdraws(value) {
    setHeroWithdraws(value);
    modifyEvent("heroWithdraws", value.id);
  }

  function changeEnemyActivate(value) {
    setEnemyActivate(value);
    modifyEvent("activationOf", value.id);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  return (
    <div className="mission-panel">
      <TextField
        type="number"
        label="Start of Round"
        name="startOfRound"
        variant="filled"
        value={missionEvent.startOfRound}
        onChange={(e) => modifyEvent(e.target.name, e.target.value)}
        onFocus={(e) => e.target.select()}
        fullWidth
        onKeyUp={onKeyUp}
        sx={{ marginBottom: "1rem" }}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="useStartOfRound"
            checked={missionEvent.useStartOfRound}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Start of Each Round"
      />
      {/* === */}
      <TextField
        type="number"
        label="End of Round"
        name="endOfRound"
        variant="filled"
        value={missionEvent.endOfRound}
        onChange={(e) => modifyEvent(e.target.name, e.target.value)}
        onFocus={(e) => e.target.select()}
        fullWidth
        onKeyUp={onKeyUp}
        sx={{ marginBottom: "1rem" }}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="useEndOfRound"
            checked={missionEvent.useEndOfRound}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="End of Each Round"
      />
      {/* === */}
      <FormControlLabel
        control={
          <Checkbox
            name="useAllGroupsDefeated"
            checked={missionEvent.useAllGroupsDefeated}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="All Enemy Groups Defeated"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="useAllHeroesWounded"
            checked={missionEvent.useAllHeroesWounded}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="All Heroes Are Wounded"
      />
      {/* === */}
      <FormControlLabel
        control={
          <Checkbox
            name="useAnyHeroDefeated"
            checked={missionEvent.useAnyHeroDefeated}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Any Hero Withdraws"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="useAnyHeroWounded"
            checked={missionEvent.useAnyHeroWounded}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Any Hero Wounded"
      />
      {/* === */}
      <FormControlLabel
        control={
          <Checkbox
            name="useAllyDefeated"
            checked={missionEvent.useAllyDefeated}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Ally Defeated"
      />
      <FormControl>
        <InputLabel>Ally Defeated</InputLabel>
        <Select
          name="allyDefeated"
          value={allyDefeated}
          onChange={(e) => changeAllyDefeated(e.target.value)}
          displayEmpty
          disabled={!missionEvent.useAllyDefeated}
        >
          {allyData.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* === */}
      <FormControlLabel
        control={
          <Checkbox
            name="useHeroWounded"
            checked={missionEvent.useHeroWounded}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Hero Wounded"
      />
      <FormControl>
        <InputLabel>Hero Wounded</InputLabel>
        <Select
          name="heroWounded"
          value={heroWounded}
          onChange={(e) => changeHeroWounded(e.target.value)}
          displayEmpty
          disabled={!missionEvent.useHeroWounded}
        >
          {heroData.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* === */}
      <FormControlLabel
        control={
          <Checkbox
            name="useHeroWithdraws"
            checked={missionEvent.useHeroWithdraws}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Hero Withdraws"
      />
      <FormControl>
        <InputLabel>Hero Withdraws</InputLabel>
        <Select
          name="heroWithdraws"
          value={heroWithdraws}
          onChange={(e) => changeHeroWithdraws(e.target.value)}
          displayEmpty
          disabled={!missionEvent.useHeroWithdraws}
        >
          {heroData.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* === */}
      <FormControlLabel
        control={
          <Checkbox
            name="useActivation"
            checked={missionEvent.useActivation}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Activation Of"
      />
      <FormControl>
        <InputLabel>Enemy Activates</InputLabel>
        <Select
          name="activationOf"
          value={enemyActivate}
          onChange={(e) => changeEnemyActivate(e.target.value)}
          displayEmpty
          disabled={!missionEvent.useActivation}
        >
          {[...enemyData, ...villainData].map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

TriggeredByTriggers.propTypes = {
  modifyEvent: PropTypes.func,
  missionEvent: PropTypes.object,
};
