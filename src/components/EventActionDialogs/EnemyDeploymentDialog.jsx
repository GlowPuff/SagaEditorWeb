import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
//icons
import SettingsIcon from "@mui/icons-material/Settings";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import SubjectIcon from "@mui/icons-material/Subject";
import ClearIcon from "@mui/icons-material/Clear";
//components
import ThumbnailSelector from "../SubComponents/ThumbnailSelector";
//tabs
import EnemyDeploymentTab1 from "./EnemyDeploymentTab1";
import EnemyDeploymentTab2 from "./EnemyDeploymentTab2";
import EnemyDeploymentTab3 from "./EnemyDeploymentTab3";
import EnemyDeploymentTab4 from "./EnemyDeploymentTab4";
//data
import { enemyData, villainData } from "../../data/carddata";
import { useReservedGroupsStore } from "../../data/dataStore";
import { ActiveDeploymentPoint, NoneThumb } from "../../data/Mission";

//can these be optimized? Use a state, but pass a function to set the state instead of rebuilding the initial state on each render
let groupData = [...enemyData, ...villainData].map(
  (item) => `${item.name} [${item.id}]`
);

let cardList = [...enemyData, ...villainData];

export default function EnemyDeploymentDialog() {
  const reservedGroups = useReservedGroupsStore(
    (state) => state.reservedGroups
  );

  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState("Stormtrooper [DG001]");
  const [filter, setFilter] = useState(false);

  //refs
  const handleRef = (ref) => {
    if (ref) {
      customNameRef.current = ref;
      customNameRef.current.value = eventAction.enemyName;
    }
  };
  const customNameRef = useRef();

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(ea, callback) {
    console.log("🚀 ~ showDialog ~ ea:", ea);
    groupData = [...enemyData, ...villainData].map(
      (item) => `${item.name} [${item.id}]`
    );
    callbackFunc.current = callback;
    setEventAction(ea);
    setSelectedGroup(
      groupData.find((x) => x.includes(`[${ea.deploymentGroup}]`))
    );
    setFilter(false);
    setSelectedTabIndex(0);
    setOpen(true);
  }
  EnemyDeploymentDialog.ShowDialog = showDialog;

  function onOK() {
    // console.log(customNameRef);
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function toggleFilter(checked) {
    setFilter(checked);
    if (checked) {
      groupData = reservedGroups.map(
        (item) => `${item.cardName} [${item.cardID}]`
      );
      if (!groupData.includes(selectedGroup)) setSelectedGroup("");
    } else {
      groupData = [...enemyData, ...villainData].map(
        (item) => `${item.name} [${item.id}]`
      );
      setSelectedGroup(
        groupData.find((x) => x.includes(`[${eventAction.deploymentGroup}]`))
      );
    }
  }

  function changeGroup(value) {
    const regex = /\[(.*?)\]/;
    const match = value.match(regex);

    //update the enemyGroupData
    let newcard = cardList.find((x) => x.id === match[1]);
    let card = { ...eventAction.enemyGroupData };
    card.cardName = value.slice(0, value.indexOf("[")).trim();
    card.cardID = match[1];
    let oldPoints = [...card.pointList];
    let newPoints = [];
    for (let index = 0; index < newcard.size; index++) {
      if (index < oldPoints.length) newPoints.push(oldPoints[index]);
      else newPoints.push(new ActiveDeploymentPoint());
    }
    card.pointList = [...newPoints];

    setSelectedGroup(value);
    setEventAction({
      ...eventAction,
      enemyGroupData: card,
      deploymentGroup: match[1],
      displayName: `Deploy: ${match[1]}/${value.slice(0, value.indexOf("["))}`,
    });
  }

  function onIconChanged(icon) {
    console.log("🚀 ~ onIconChanged ~ icon:", icon);
    setEAValue("thumbnail", icon);
  }

  function handleTabChange(event, newValue) {
    setSelectedTabIndex(newValue);
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"lg"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Enemy Deployment Event Action</DialogTitle>
          <DialogContent>
            <div className="two-column-grid">
              {/* LEFT */}
              <Paper
                sx={{
                  backgroundColor: "#201531",
                  padding: "1rem",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="factionImperial"
                      checked={filter}
                      onChange={(e) => toggleFilter(e.target.checked)}
                    />
                  }
                  label="Filter By Reserved Groups"
                />
                <Select
                  name="enemyGroup"
                  sx={{ width: "100%" }}
                  value={selectedGroup}
                  onChange={(e) => changeGroup(e.target.value)}
                  displayEmpty
                >
                  {groupData.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>

                {/* CUSTOMIZE ENEMY PANEL */}
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary>Customize Enemy</AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      name="enemyName"
                      label={"Custom Name - Blank for Default"}
                      variant="filled"
                      onBlur={(e) => setEAValue(e.target.name, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      onKeyUp={onKeyUp}
                      fullWidth
                      sx={{ marginBottom: ".5rem" }}
                      inputRef={handleRef}
                    />
                    <Paper
                      sx={{
                        padding: "1rem",
                        margin: ".5rem 0 1rem 0",
                      }}
                    >
                      <Typography>
                        Thumbnail:{" "}
                        <span style={{ color: "#ee82e5" }}>
                          {eventAction.thumbnail === null ||
                          eventAction.thumbnail?.ID === "None"
                            ? "Default"
                            : eventAction.thumbnail.Name}
                        </span>
                      </Typography>
                    </Paper>

                    {/* ICON */}
                    <ThumbnailSelector
                      showDefaultButton={true}
                      onIconChanged={onIconChanged}
                      initialThumb={eventAction.thumbnail || NoneThumb}
                    />
                  </AccordionDetails>
                </Accordion>
              </Paper>

              {/* RIGHT */}
              <div>
                <Paper
                  sx={{
                    backgroundColor: "#201531",
                    padding: "1rem",
                    marginBottom: ".5rem",
                  }}
                >
                  <Tabs
                    name="enemyDeploymentTabs"
                    value={selectedTabIndex}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab icon={<SettingsIcon />} label="modify" id="tab-0" />
                    <Tab
                      icon={<DirectionsRunIcon />}
                      label="deployment"
                      id="tab-1"
                    />
                    <Tab
                      icon={<SubjectIcon />}
                      label="instructions"
                      id="tab-2"
                    />
                    <Tab icon={<ClearIcon />} label="on defeated" id="tab-3" />
                  </Tabs>
                </Paper>
                <Paper
                  sx={{
                    backgroundColor: "#201531",
                    padding: "1rem",
                  }}
                >
                  {/* TAB CONTENT */}
                  <EnemyDeploymentTab1
                    eventAction={eventAction}
                    modifyEA={setEAValue}
                    tabIndex={0}
                    selectedTabIndex={selectedTabIndex}
                  />
                  <EnemyDeploymentTab2
                    eventAction={eventAction}
                    modifyEA={setEAValue}
                    tabIndex={1}
                    selectedTabIndex={selectedTabIndex}
                  />
                  <EnemyDeploymentTab3
                    eventAction={eventAction}
                    modifyEA={setEAValue}
                    tabIndex={2}
                    selectedTabIndex={selectedTabIndex}
                  />
                  <EnemyDeploymentTab4
                    eventAction={eventAction}
                    modifyEA={setEAValue}
                    tabIndex={3}
                    selectedTabIndex={selectedTabIndex}
                  />
                </Paper>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button variant="contained" onClick={() => onOK()}>
              continue
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              color="error"
            >
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
