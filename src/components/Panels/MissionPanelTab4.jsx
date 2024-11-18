import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
//my components
import RepositionOverrideDialog from "../Dialogs/RepositionOverrideDialog";
//data
import { heroData, allyData } from "../../data/carddata";
//core.js
import * as core from "../../lib/core";

export default function MissionPanelTab4({
  missionProps,
  setPropValue,
  selectedTabIndex,
  tabIndex,
}) {
  const [selectedHero, setSelectedHero] = useState("Diala Passil");
  const [selectedAlly, setSelectedAlly] = useState("Luke Skywalker (Hero)");
  const otherTargetRef = useRef();

  useEffect(() => {
    if (otherTargetRef.current)
      otherTargetRef.current.value = missionProps.priorityOther || "";
  });

  const transformedHeroData = heroData.map((item) => `${item.name}`);
  const transformedAllyData = allyData.map((item) => `${item.name}`);

  function onEditRepoClick() {
    RepositionOverrideDialog.ShowDialog(
      missionProps.changeRepositionOverride,
      (value) => {
        setPropValue("changeRepositionOverride", value);
      }
    );
  }

  function onRemoveRepoClick() {
    setPropValue("changeRepositionOverride", null);
  }

  function onChangeChecked(name, value) {
    setPropValue(name, value);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onChangeHero(e) {
    setSelectedHero(e.target.value);
    let s = heroData.findIndex((item) => item.name === e.target.value);
    setPropValue("specificHero", heroData[s].id);
  }

  function onChangeAlly(e) {
    setSelectedAlly(e.target.value);
    let s = allyData.findIndex((item) => item.name === e.target.value);
    setPropValue("specificAlly", allyData[s].id);
  }

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      {selectedTabIndex === tabIndex && (
        <div>
          <Accordion
            defaultExpanded
            sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1-header"
            >
              Priority Target Override
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                This Override applies to all deployed groups.
              </Typography>

              {/* PRIORITY TARGETS */}
              <FormControlLabel
                control={
                  <Checkbox
                    radioGroup="priorityTargetType"
                    checked={
                      missionProps.priorityTargetType ===
                      core.PriorityTargetType.Rebel
                    }
                    onChange={(e) => {
                      if (e.target.checked)
                        onChangeChecked(
                          "priorityTargetType",
                          core.PriorityTargetType.Rebel
                        );
                    }}
                  />
                }
                label="Any Rebel Figure"
                sx={{ display: "block" }}
              />
              <div className="two-column-grid">
                <FormControlLabel
                  control={
                    <Checkbox
                      radioGroup="priorityTargetType"
                      checked={
                        missionProps.priorityTargetType ===
                        core.PriorityTargetType.Hero
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          onChangeChecked(
                            "priorityTargetType",
                            core.PriorityTargetType.Hero
                          );
                      }}
                    />
                  }
                  label="Specific Hero"
                  sx={{ display: "block" }}
                />
                <Select
                  sx={{ width: "100%" }}
                  value={(transformedHeroData && selectedHero) || ""}
                  onChange={(e) => onChangeHero(e)}
                  displayEmpty
                  disabled={
                    missionProps.priorityTargetType !==
                    core.PriorityTargetType.Hero
                  }
                >
                  {heroData &&
                    heroData.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
                <FormControlLabel
                  control={
                    <Checkbox
                      radioGroup="priorityTargetType"
                      checked={
                        missionProps.priorityTargetType ===
                        core.PriorityTargetType.Ally
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          onChangeChecked(
                            "priorityTargetType",
                            core.PriorityTargetType.Ally
                          );
                      }}
                    />
                  }
                  label="Specific Ally"
                  sx={{ display: "block" }}
                />
                <Select
                  sx={{ width: "100%" }}
                  value={(transformedAllyData && selectedAlly) || ""}
                  onChange={(e) => onChangeAlly(e)}
                  displayEmpty
                  disabled={
                    missionProps.priorityTargetType !==
                    core.PriorityTargetType.Ally
                  }
                >
                  {allyData &&
                    allyData.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
                <FormControlLabel
                  control={
                    <Checkbox
                      radioGroup="priorityTargetType"
                      checked={
                        missionProps.priorityTargetType ===
                        core.PriorityTargetType.Other
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          onChangeChecked(
                            "priorityTargetType",
                            core.PriorityTargetType.Other
                          );
                      }}
                    />
                  }
                  label="Other"
                  sx={{ display: "block" }}
                />
                <TextField
                  name="priorityOther"
                  label={"Other Priority Target"}
                  variant="filled"
                  // value={missionProps.priorityOther || ""}
                  onBlur={(e) => setPropValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  disabled={
                    missionProps.priorityTargetType !==
                    core.PriorityTargetType.Other
                  }
                  sx={{ marginBottom: ".5rem" }}
                  inputRef={otherTargetRef}
                />{" "}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* REPOSITION INSTRUCTIONS OVERRIDE */}
          <Accordion
            defaultExpanded
            sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1-header"
            >
              Reposition Instructions Override
            </AccordionSummary>
            <AccordionDetails>
              <div className="two-column-grid">
                <Button variant="contained" onClick={onEditRepoClick}>
                  edit instructions...
                </Button>
                <Button
                  onClick={onRemoveRepoClick}
                  variant="contained"
                  color="error"
                  disabled={missionProps.changeRepositionOverride === null}
                >
                  remove override
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          <RepositionOverrideDialog />
        </div>
      )}
    </div>
  );
}

MissionPanelTab4.propTypes = {
  missionProps: PropTypes.object.isRequired,
  setPropValue: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
