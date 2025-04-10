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
import { useToonsStore } from "../../data/dataStore";
import { CharacterType } from "../../lib/core";

export default function TriggeredByTriggers({ missionEvent, modifyEvent }) {
  const customHeroes = useToonsStore((state) =>
    state.customCharacters
      .filter((x) => x.deploymentCard.characterType === CharacterType.Hero)
      .map((x) => x.deploymentCard)
  );
  const customAlliesRebels = useToonsStore((state) =>
    state.customCharacters
      .filter(
        (x) =>
          x.deploymentCard.characterType === CharacterType.Ally ||
          x.deploymentCard.characterType === CharacterType.Rebel
      )
      .map((x) => x.deploymentCard)
  );
  const customEnemies = useToonsStore((state) =>
    state.customCharacters
      .filter(
        (x) =>
          x.deploymentCard.characterType === CharacterType.Imperial ||
          x.deploymentCard.characterType === CharacterType.Villain
      )
      .map((x) => x.deploymentCard)
  );
  const heroArray = [...heroData, ...customHeroes];
  const allyArray = [...allyData, ...customAlliesRebels];
  const enemyArray = [...enemyData, ...villainData, ...customEnemies];

  const [allyDefeated, setAllyDefeated] = useState(
    allyData.find((x) => x.id === missionEvent.allyDefeated) || allyData[0]
  );
  const [heroWounded, setHeroWounded] = useState(
    heroArray.find((x) => x.id === missionEvent.heroWounded) || heroArray[0]
  );
  const [heroWithdraws, setHeroWithdraws] = useState(
    heroArray.find((x) => x.id === missionEvent.heroWithdraws) || heroArray[0]
  );
  const [enemyActivate, setEnemyActivate] = useState(
    enemyArray.find((x) => x.id === missionEvent.activationOf) || enemyArray[0]
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
      <div className="label-text">
        <FormControlLabel
          control={
            <Checkbox
              name="useStartOfRound"
              checked={missionEvent.useStartOfRound}
              onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
            />
          }
          label="Start of Round"
        />

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
      </div>
      <FormControlLabel
        control={
          <Checkbox
            name="useStartOfEachRound"
            checked={missionEvent.useStartOfEachRound}
            onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
          />
        }
        label="Start of Each Round"
      />
      {/* === */}
      <div className="label-text">
        <FormControlLabel
          control={
            <Checkbox
              name="useEndOfRound"
              checked={missionEvent.useEndOfRound}
              onChange={(e) => modifyEvent(e.target.name, e.target.checked)}
            />
          }
          label="End of Round"
        />
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
      </div>
      <FormControlLabel
        control={
          <Checkbox
            name="useEndOfEachRound"
            checked={missionEvent.useEndOfEachRound}
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
          {allyArray.map((item, index) => (
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
          {heroArray.map((item, index) => (
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
          {heroArray.map((item, index) => (
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
          {enemyArray.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}: {item.id}
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
