import { useState, useRef, useMemo } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
//icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
//data
import { enemyData, villainData } from "../../data/carddata";
import { useToonsStore } from "../../data/dataStore";
import { CharacterType } from "../../lib/core";
//hooks
import useLogger from "../../hooks/useLogger";

// const groupData = [...enemyData, ...villainData];

export default function AddToHandDialog() {
	const logger = useLogger();
  const toons = useToonsStore((state) => state.customCharacters);
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [selectedGroup, setSelectedGroup] = useState();
  const [filter, setFilter] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);

  const groupData = useMemo(() => {
    const baseGroups = [...enemyData, ...villainData];
    const customGroups = toons
      .filter(
        (t) =>
          t.deploymentCard.characterType === CharacterType.Imperial ||
          t.deploymentCard.characterType === CharacterType.Villain
      )
      .map((toon) => toon.deploymentCard);
    return [...baseGroups, ...customGroups];
  }, [toons]);

  function addGroupClick() {
    setEAValue("groupsToAdd", [...eventAction.groupsToAdd, selectedGroup]);
  }

  function removeGroupClick(index) {
    setEAValue(
      "groupsToAdd",
      eventAction.groupsToAdd.filter((x, idx) => idx !== index)
    );
  }

  function changeGroup(group) {
    setSelectedGroup(group);
  }

  function changeFilter(value) {
    setFilter(value);
    let filtered = groupData.filter((x) =>
      x.name.toLowerCase().includes(value.toLowerCase())
    );
    if (filtered.length > 0) {
      setFilteredGroups(
        groupData.filter((x) =>
          x.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setSelectedGroup(filtered[0]);
    }
  }

  function showDialog(ea, callback) {
		logger.debug("showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setSelectedGroup(groupData[0]);
    setFilter("");
    setFilteredGroups([...groupData]);
    setOpen(true);
  }
  AddToHandDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) {
      if (filteredGroups.length > 0) addGroupClick();
      setFilter("");
      setFilteredGroups([...groupData]);
      setSelectedGroup(groupData[0]);
      ev.target.blur();
    }
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"sm"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>
            Add Group(s) To Deployment Hand Event Action
          </DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem" }}>
              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionSummary>Deployment Cost Limit</AccordionSummary>
                <AccordionDetails>
                  <TextField
                    sx={{ marginBottom: "1rem" }}
                    label={"Group Filter"}
                    value={filter}
                    variant="filled"
                    onChange={(e) => changeFilter(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onKeyUp={onKeyUp}
                    fullWidth
                  />

                  <div className="event-container">
                    <FormControl>
                      <InputLabel>Enemy Groups</InputLabel>
                      <Select
                        value={selectedGroup || ""}
                        onChange={(e) => changeGroup(e.target.value)}
                        displayEmpty
                      >
                        {filteredGroups.length > 0 &&
                          filteredGroups.map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item.name}: {item.id}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    <Tooltip title="Add Group To Hand">
                      <IconButton onClick={addGroupClick}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <Paper
                    sx={{
                      padding: ".5rem",
                      marginTop: ".5rem",
                      display: eventAction.groupsToAdd.length > 0 ? "" : "none",
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
                      {eventAction.groupsToAdd.map((item, index) => (
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
                                <IconButton
                                  onClick={() => removeGroupClick(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </DialogContent>
          <DialogActions
            sx={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "1rem",
            }}
          >
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
