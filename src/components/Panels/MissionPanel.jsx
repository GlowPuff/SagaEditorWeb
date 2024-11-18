import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import SpeedIcon from "@mui/icons-material/Speed";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GroupsIcon from "@mui/icons-material/Groups";
import BuildIcon from "@mui/icons-material/Build";
//core.js
import * as core from "../../lib/core";
//my components
import GenericTextDialog from "../Dialogs/GenericTextDialog";
//panel tabs
import MissionPanelTab1 from "./MissionPanelTab1";
import MissionPanelTab2 from "./MissionPanelTab2";
import MissionPanelTab3 from "./MissionPanelTab3";
import MissionPanelTab4 from "./MissionPanelTab4";

function getMissionIDs() {
  let ids = [];
  ids.push("Custom");
  for (let i = 1; i <= 32; i++) ids.push("Core " + i);
  for (let i = 1; i <= 6; i++) ids.push("Bespin " + i);
  for (let i = 1; i <= 16; i++) ids.push("Empire " + i);
  for (let i = 1; i <= 16; i++) ids.push("Hoth " + i);
  for (let i = 1; i <= 16; i++) ids.push("Jabba " + i);
  for (let i = 1; i <= 6; i++) ids.push("Lothal " + i);
  for (let i = 1; i <= 6; i++) ids.push("Twin " + i);
  for (let i = 1; i <= 40; i++) ids.push("Other " + i);
  return ids.map((item, index) => (
    <MenuItem key={index} value={item}>
      {item}
    </MenuItem>
  ));
}

function getMissionTypes() {
  let mtypes = [
    "Story",
    "Side",
    "Forced",
    "Introduction",
    "Interlude",
    "Finale",
  ];
  return mtypes.map((t, index) => (
    <MenuItem key={index} value={t}>
      {t}
    </MenuItem>
  ));
}

const stypes = [
  "Agenda",
  "Threat",
  "Other",
  "Finale",
  "General",
  "Personal",
  "Villain",
  "Ally",
];

export default function MissionPanel({
  missionProps,
  onSetProps,
  value,
  index,
}) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const campaignNameRef = useRef();
  const missionNameRef = useRef();

  useEffect(() => {
    if (campaignNameRef.current)
      campaignNameRef.current.value = missionProps.campaignName || "";
    if (missionNameRef.current)
      missionNameRef.current.value = missionProps.missionName || "";
  });

  function setPropValue(name, value) {
    onSetProps(name, value);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function getMissionSubtypes() {
    return stypes.map((t, index) => (
      <MenuItem key={index} value={t}>
        <Checkbox checked={missionProps.missionSubType.indexOf(t) > -1} />
        {t}
      </MenuItem>
    ));
  }

  function changeSubtype(ev) {
    const {
      target: { value },
    } = ev;
    let s = typeof value === "string" ? value.split(",") : value;
    onSetProps("missionSubType", s);
  }

  function refreshCustomID() {
    setPropValue("customMissionIdentifier", core.createGUID());
  }

  function onDescriptionClick() {
    GenericTextDialog.ShowDialog(
      "Mission Description",
      missionProps.missionDescription,
      (text) => {
        setPropValue("missionDescription", text);
      }
    );
  }

  function onAdditionalClick() {
    GenericTextDialog.ShowDialog(
      "Additional Mission Information",
      missionProps.additionalMissionInfo,
      (text) => {
        setPropValue("additionalMissionInfo", text);
      }
    );
  }

  function handleTabChange(event, newValue) {
    setSelectedTabIndex(newValue);
  }

  return (
    <div hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && (
        <div className="mission-panel">
          {/* LEFT SIDE */}
          <Paper sx={{ padding: ".5rem" }}>
            {/* general props */}
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1-header"
              >
                General Properties
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  name="campaignName"
                  label={"Campaign Name"}
                  variant="filled"
                  onBlur={(e) => setPropValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                  inputRef={campaignNameRef}
                />
                <TextField
                  name="missionName"
                  label={"Mission Name"}
                  variant="filled"
                  // value={missionProps.missionName || ""}
                  onBlur={(e) => setPropValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                  inputRef={missionNameRef}
                />
                <div className="missionPanel__typebox">
                  <FormControl>
                    <InputLabel id="missionID">Mission Type</InputLabel>
                    <Select
                      id="missionType"
                      name="missionType"
                      value={missionProps.missionType}
                      onChange={(e) =>
                        setPropValue(e.target.name, e.target.value)
                      }
                      displayEmpty
                    >
                      {getMissionTypes()}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="missionID">Mission ID</InputLabel>
                    <Select
                      id="missionID"
                      name="missionID"
                      value={missionProps.missionID}
                      onChange={(e) =>
                        setPropValue(e.target.name, e.target.value)
                      }
                      displayEmpty
                    >
                      {getMissionIDs()}
                    </Select>
                  </FormControl>
                </div>

                <Typography
                  sx={{
                    color: "#ee82e5",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                  }}
                >
                  Use a MissionID other than &apos;Custom&apos; to have the
                  Description filled in automatically by the Saga app.
                </Typography>

                <FormControl>
                  <InputLabel id="missionID">Mission Subtypes</InputLabel>
                  <Select
                    id="missionSubType"
                    name="missionSubType"
                    value={missionProps.missionSubType}
                    onChange={(e) => changeSubtype(e)}
                    displayEmpty
                    multiple
                    sx={{ minWidth: "12rem" }}
                  >
                    {getMissionSubtypes()}
                  </Select>
                </FormControl>

                <Paper sx={{ padding: "1rem", marginTop: ".5rem" }}>
                  <Typography>Include Factions</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="factionImperial"
                        checked={missionProps.factionImperial}
                        onChange={(e) =>
                          setPropValue(e.target.name, e.target.checked)
                        }
                      />
                    }
                    label="Imperial"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="factionMercenary"
                        checked={missionProps.factionMercenary}
                        onChange={(e) =>
                          setPropValue(e.target.name, e.target.checked)
                        }
                      />
                    }
                    label="Mercenary"
                  />
                </Paper>
              </AccordionDetails>
            </Accordion>

            {/* custom props */}
            <Accordion
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel2-header"
              >
                Custom Mission Properties
              </AccordionSummary>
              <AccordionDetails>
                <div className="event-container">
                  <div>
                    <TextField
                      name="customMissionIdentifier"
                      label={"Custom Mission Identifier"}
                      variant="filled"
                      value={missionProps.customMissionIdentifier}
                      onChange={(e) =>
                        setPropValue(e.target.name, e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      onKeyUp={onKeyUp}
                      fullWidth
                      sx={{ marginBottom: ".5rem" }}
                    />
                  </div>
                  <div>
                    <IconButton onClick={refreshCustomID}>
                      <RefreshIcon />
                    </IconButton>
                  </div>
                </div>
                <Typography
                  sx={{
                    color: "#ee82e5",
                    marginTop: ".5rem",
                    marginBottom: ".5rem",
                  }}
                >
                  The Custom Mission Identifier is{" "}
                  <u>only used by Custom Campaigns</u> and defaults to a unique
                  number, but you can set it to any text for easier
                  identification. Just make sure it&apos;s unique among all the
                  Custom Missions in your Custom Campaign.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* description/info */}
            <Accordion
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel3-header"
              >
                Mission Description and Additional Info
              </AccordionSummary>
              <AccordionDetails>
                <div className="missionPanel__info-container">
                  <Button variant="contained" onClick={onDescriptionClick}>
                    description...
                  </Button>
                  <Button variant="contained" onClick={onAdditionalClick}>
                    additional info
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* RIGHT SIDE */}
          <Paper
            sx={{
              padding: ".5rem",
            }}
          >
            <div>
              <Paper
                sx={{
                  width: "100%",
                  backgroundColor: "#281b40",
									marginBottom: ".5rem",
                }}
              >
                <Tabs
                  value={selectedTabIndex}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab icon={<SpeedIcon />} label="round limit" id="tab-0" />
                  <Tab
                    icon={<PlayArrowIcon />}
                    label="mission start"
                    id="tab-1"
                  />
                  <Tab
                    icon={<GroupsIcon />}
                    label="groups / allies"
                    id="tab-2"
                  />
                  <Tab icon={<BuildIcon />} label="overrides" id="tab-3" />
                </Tabs>
              </Paper>
              {/* TAB CONTENT */}
              <MissionPanelTab1
                missionProps={missionProps}
                selectedTabIndex={selectedTabIndex}
                setPropValue={setPropValue}
                tabIndex={0}
              />
              <MissionPanelTab2
                missionProps={missionProps}
                selectedTabIndex={selectedTabIndex}
                setPropValue={setPropValue}
                tabIndex={1}
              />
              <MissionPanelTab3
                missionProps={missionProps}
                selectedTabIndex={selectedTabIndex}
                setPropValue={setPropValue}
                tabIndex={2}
              />
              <MissionPanelTab4
                missionProps={missionProps}
                selectedTabIndex={selectedTabIndex}
                setPropValue={setPropValue}
                tabIndex={3}
              />
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
}

MissionPanel.propTypes = {
  missionProps: PropTypes.object.isRequired,
  onSetProps: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
