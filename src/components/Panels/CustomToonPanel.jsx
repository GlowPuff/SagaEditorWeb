import { useRef, useState, useEffect, useCallback, memo } from "react";
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
import Tooltip from "@mui/material/Tooltip";
//icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import SubjectIcon from "@mui/icons-material/Subject";
//components
import CustomToonTab1 from "./CustomToonTab1";
import CustomToonTab2 from "./CustomToonTab2";
import CustomToonTab3 from "./CustomToonTab3";
import CustomToonTab4 from "./CustomToonTab4";
import CustomToonTab5 from "./CustomToonTab5";
//data
import { CustomToon } from "../../data/Mission";
import { useToonsStore } from "../../data/dataStore";
import { createGUID, DeploymentColors, Factions } from "../../lib/core";
//hooks
import useLogger from "../../hooks/useLogger";

const CustomToonPanel = memo(function CustomToonPanel({ value, index }) {
  const logger = useLogger();
  const toonTypes = [
    { name: "Hero", id: 0 },
    { name: "Ally", id: 1 },
    { name: "Rebel / Neutral", id: 4 },
    { name: "Imperial", id: 2 },
    { name: "Villain", id: 3 },
  ];
  //global state
  const toons = useToonsStore((state) => state.customCharacters);
  const addToon = useToonsStore((state) => state.addToon);
  const updateToon = useToonsStore((state) => state.updateToon);
  const removeToon = useToonsStore((state) => state.removeToon);
  //component state
  const [customToon, setCustomToon] = useState(toons[0] || "");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  //refs
  const nameRef = useRef(null);
  const subNameRef = useRef(null);

  useEffect(() => {
    if (toons.length > 0 && customToon !== "") {
      logger.debug("useEffect ~ customToon:", customToon);
      if (nameRef.current) nameRef.current.value = customToon.cardName;
      if (subNameRef.current) subNameRef.current.value = customToon.cardSubName;
    } else {
      setCustomToon("");
    }
  }, [toons, customToon, logger]);

  function getUnusedID() {
    if (toons.length === 0) return "TC1";
    let used = toons.map((x) => Number.parseInt(x.cardID.slice(2)));
    for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
      if (!used.includes(i)) return "TC" + i;
    }
  }

  const setToonCardProp = useCallback(
    (name, value) => {
      let update = {
        ...customToon,
        deploymentCard: { ...customToon.deploymentCard, [name]: value },
      };
      updateToon(update);
      setCustomToon(update);
    },
    [customToon, updateToon]
  );

  const onKeyUp = useCallback((ev) => {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }, []);

  function helpClick() {}

  function newToonClick() {
    let newToon = new CustomToon(getUnusedID());
    newToon.deploymentCard.id = newToon.cardID;
    addToon(newToon);
    setCustomToon(newToon);
    logger.debug("newToonClick ~ newToon:", newToon);
  }

  function removeToonClick() {
    removeToon(customToon.customCharacterGUID);
    setCustomToon("");
  }

  function changeToonClick(value) {
    setCustomToon(value);
  }

  function newGUIDClick() {
    let update = { ...customToon, customCharacterGUID: createGUID() };
    let updatedHeroSkills = customToon.heroSkills.map((skill) => ({
      ...skill,
      owner: update.customCharacterGUID,
    }));
    update.heroSkills = updatedHeroSkills;
    updateToon(update);
    setCustomToon(update);
  }

  //when changing: cardName, cardID, faction, cardSubName
  //also modify values for the deployment card:
  // cardName => name (also update card instruction name)
  // cardSubName = subname
  // cardID => id (not modified here)
  // faction => spelled out word in deployment card

  function changeName(name) {
    let update = { ...customToon };
    update.cardName = name;
    update.deploymentCard.name = name;
    update.cardInstruction.instName = name;
    updateToon(update);
    setCustomToon(update);
  }

  function changeSubName(name) {
    let update = { ...customToon };
    update.cardSubName = name;
    update.deploymentCard.subname = name;
    updateToon(update);
    setCustomToon(update);
  }

  const changeToonType = useCallback(
    (value) => {
      setToonCardProp("characterType", value.id);
    },
    [setToonCardProp]
  );

  const changeFaction = useCallback(
    //string, number
    (factionName, factionID) => {
      let update = { ...customToon };
      update.faction = factionID;
      update.deploymentCard.faction = factionName;
      updateToon(update);
      setCustomToon(update);
    },
    [customToon, updateToon]
  );

  return (
    <div hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && (
        <div>
          <Paper sx={{ padding: ".5rem" }}>
            <div className="two-column-grid align-center">
              <Button
                sx={{ justifySelf: "start" }}
                variant="contained"
                onClick={newToonClick}
              >
                create new character
              </Button>

              <div>
                <Select
                  displayEmpty
                  sx={{ minWidth: "15rem" }}
                  onChange={(e) => changeToonClick(e.target.value)}
                  value={toons.length > 0 ? customToon || "" : ""}
                >
                  {toons.map((toon, index) => (
                    <MenuItem key={index} value={toon}>
                      {toon.cardName} : {toon.cardID}
                    </MenuItem>
                  ))}
                </Select>

                <Tooltip title="Duplicate This Character">
                  <IconButton>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Import A Character">
                  <IconButton>
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export This Character">
                  <IconButton>
                    <FileUploadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove This Character From The Mission">
                  <IconButton onClick={removeToonClick}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </Paper>
          {/* TOON PANEL */}
          {toons.length > 0 && customToon && (
            <div
              className="two-column-grid"
              style={{ overflow: "hidden", height: "100%" }}
            >
              {/* LEFT */}
              <Paper sx={{ padding: ".5rem", marginTop: ".5rem" }}>
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    General Properties For: {customToon.cardName || "Not Set"}
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      name="cardName"
                      required
                      label={"Character Name"}
                      variant="filled"
                      // value={customToon.cardName}
                      onBlur={(e) => {
                        if (e.target.value.trim() === "")
                          e.target.value = "New Character";
                        changeName(e.target.value);
                      }}
                      onFocus={(e) => e.target.select()}
                      onKeyUp={onKeyUp}
                      fullWidth
                      sx={{ marginBottom: ".5rem" }}
                      inputRef={nameRef}
                    />
                    <TextField
                      name="cardSubName"
                      label={"Character SubName (Optional)"}
                      variant="filled"
                      // value={customToon.cardSubName}
                      onBlur={(e) => changeSubName(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      onKeyUp={onKeyUp}
                      fullWidth
                      sx={{ marginBottom: ".5rem" }}
                      inputRef={subNameRef}
                    />
                    <Typography className="text-center">
                      Character ID:
                    </Typography>
                    <Typography className="text-center pink">
                      <b>
                        <i>{customToon.cardID}</i>
                      </b>
                    </Typography>
                    <div className="event-container">
                      <Typography className="text-center">
                        Character GUID:
                      </Typography>
                      <Tooltip title="Assign New Character GUID">
                        <IconButton onClick={newGUIDClick}>
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <Typography className="text-center pink">
                      <b>
                        <i>{customToon.customCharacterGUID}</i>
                      </b>
                    </Typography>
                    <Typography sx={{ marginTop: ".5rem" }} className="orange">
                      Custom characters must have a unique GUID in the Imperial
                      Commander app.
                    </Typography>
                    <Typography sx={{ marginTop: ".5rem" }}>
                      Refresh the GUID if this will be a NEW character based on
                      a character you{" "}
                      <span className="orange">
                        <i>just imported</i>
                      </span>
                      .
                    </Typography>
                    <Typography className="red" sx={{ marginTop: ".5rem" }}>
                      Do not refresh the GUID if you are just editing an
                      existing character that has already been added to this
                      Mission.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Character Type
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="event-container">
                      <Select
                        displayEmpty
                        sx={{ minWidth: "15rem" }}
                        onChange={(e) => changeToonType(e.target.value)}
                        value={toonTypes.find(
                          (x) =>
                            x.id === customToon.deploymentCard.characterType
                        )}
                      >
                        {toonTypes.map((ttype, index) => (
                          <MenuItem key={index} value={ttype}>
                            {ttype.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Tooltip title="Help Me Choose...">
                        <IconButton onClick={helpClick}>
                          <HelpIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <Typography sx={{ marginTop: ".5rem" }} className="pink">
                      Character Type affects how this Character can be used.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Icon Outline Color
                  </AccordionSummary>
                  <AccordionDetails>
                    <Select
                      displayEmpty
                      sx={{ minWidth: "15rem" }}
                      onChange={(e) =>
                        setToonCardProp(
                          "deploymentOutlineColor",
                          e.target.value
                        )
                      }
                      value={
                        customToon.deploymentCard.deploymentOutlineColor || ""
                      }
                    >
                      {DeploymentColors.map((color, index) => (
                        <MenuItem key={index} value={color}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Faction
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="faction"
                          checked={customToon.faction === Factions.Imperial}
                          onChange={(e) => {
                            if (e.target.checked)
                              changeFaction("Imperial", Factions.Imperial);
                          }}
                        />
                      }
                      label="Imperial"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="faction"
                          checked={customToon.faction === Factions.Mercenary}
                          onChange={(e) => {
                            if (e.target.checked)
                              changeFaction("Mercenary", Factions.Mercenary);
                          }}
                        />
                      }
                      label="Mercenary"
                    />
                    <Typography className="pink">
                      Faction is only relevant for Enemies and Villains.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Tier and Priority
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="two-column-grid">
                      <FormControl>
                        <InputLabel>Tier</InputLabel>
                        <Select
                          displayEmpty
                          onChange={(e) =>
                            setToonCardProp("tier", e.target.value)
                          }
                          value={customToon.deploymentCard.tier || ""}
                        >
                          {[1, 2, 3].map((value, index) => (
                            <MenuItem key={index} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          displayEmpty
                          onChange={(e) =>
                            setToonCardProp("priority", e.target.value)
                          }
                          value={customToon.deploymentCard.priority || ""}
                        >
                          {[1, 2].map((value, index) => (
                            <MenuItem key={index} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Paper>

              {/* RIGHT */}
              <Paper
                sx={{
                  padding: ".5rem",
                  marginTop: ".5rem",
                }}
              >
                <Paper
                  sx={{
                    padding: ".5rem",
                    backgroundColor: "#281b40",
                    marginBottom: ".5rem",
                  }}
                >
                  <Tabs
                    value={selectedTabIndex}
                    onChange={(_, value) => setSelectedTabIndex(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab
                      icon={<SettingsIcon />}
                      label="properties"
                      id="tab-0"
                    />
                    <Tab icon={<PersonIcon />} label="appearance" id="tab-1" />
                    <Tab
                      icon={<DirectionsRunIcon />}
                      label="deployment"
                      id="tab-2"
                    />
                    <Tab
                      icon={<ElectricBoltIcon />}
                      label="combat"
                      id="tab-3"
                    />
                    <Tab icon={<SubjectIcon />} label="card text" id="tab-4" />
                  </Tabs>
                </Paper>

                {/* TAB CONTENT */}
                <CustomToonTab1
                  selectedTabIndex={selectedTabIndex}
                  tabIndex={0}
                  customToon={customToon}
                  updateToon={(update) => {
                    setCustomToon(update);
                    updateToon(update);
                  }}
                />
                <CustomToonTab2
                  selectedTabIndex={selectedTabIndex}
                  tabIndex={1}
                  customToon={customToon}
                  updateToon={(update) => {
                    setCustomToon(update);
                    updateToon(update);
                  }}
                />
                <CustomToonTab3
                  selectedTabIndex={selectedTabIndex}
                  tabIndex={2}
                  customToon={customToon}
                  updateToon={(update) => {
                    setCustomToon(update);
                    updateToon(update);
                  }}
                />
                <CustomToonTab4
                  selectedTabIndex={selectedTabIndex}
                  tabIndex={3}
                  customToon={customToon}
                  updateToon={(update) => {
                    setCustomToon(update);
                    updateToon(update);
                  }}
                />
                <CustomToonTab5
                  selectedTabIndex={selectedTabIndex}
                  tabIndex={4}
                  customToon={customToon}
                  updateToon={(update) => {
                    setCustomToon(update);
                    updateToon(update);
                  }}
                />
              </Paper>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

CustomToonPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default CustomToonPanel;
