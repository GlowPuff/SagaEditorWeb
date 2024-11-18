import { useState, useRef } from "react";
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
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//my components
//data
import { useMapEntitiesStore } from "../../data/dataStore";
import { emptyGUID } from "../../lib/core";

export default function EntityGroupDialog() {
  const mapEntities = useMapEntitiesStore((state) => state.mapEntities);

  const [open, setOpen] = useState(false);
  const [entityGroup, setEntityGroup] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(
    mapEntities.length > 0 ? mapEntities[0] : ""
  );
  const [name, setName] = useState("");
  const [groupEntities, setGroupEntities] = useState([]); //array of {name:"foo",GUID:"00000"}
  const callbackFunc = useRef(null);

  function onModifyGroup(name, value) {
    setEntityGroup({ ...entityGroup, [name]: value });
  }

  function onAddEntity() {
    if (selectedEntity.GUID !== emptyGUID) {
      setGroupEntities([
        ...groupEntities,
        { name: selectedEntity.name, GUID: selectedEntity.GUID },
      ]);
      onModifyGroup("missionEntities", [
        ...entityGroup.mapEntities,
        selectedEntity.GUID,
      ]);
    }
  }

  function onRemoveEvent(index) {
    setGroupEntities(groupEntities.filter((x, idx) => index != idx));

    onModifyGroup(
      "missionEntities",
      entityGroup.missionEntities.filter((x, idx) => index != idx)
    );
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(eGroup, callback) {
    callbackFunc.current = callback;
    setEntityGroup(eGroup);
    setSelectedEntity(mapEntities[0]);
    setName(eGroup.name);
    setGroupEntities(
      eGroup.missionEntities.map((item) => ({
        name: mapEntities.find((x) => x.GUID === item).name,
        GUID: item,
      }))
    );
    setOpen(true);
  }
  EntityGroupDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(entityGroup);
    setOpen(false);
  }

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      maxWidth={"md"}
      fullWidth={true}
      scroll={"paper"}
    >
      <DialogTitle>Random Map Entity Group Editor</DialogTitle>
      <DialogContent>
        <div className="mission-panel">
          {/* LEFT */}
          <Paper sx={{ padding: ".5rem" }}>
            {/* general props */}
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">Group Name</AccordionSummary>
              <AccordionDetails>
                <TextField
                  label={"Group Name"}
                  name={"name"}
                  value={name}
                  variant="filled"
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => onModifyGroup("name", name)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">
                Map Entities
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <FormControl>
                    <InputLabel id="mapEntities">Map Entities</InputLabel>
                    <Select
                      id="mapEntities"
                      name="mapEntities"
                      value={selectedEntity || ""}
                      displayEmpty
                      sx={{ minWidth: "10rem" }}
                    >
                      {mapEntities.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <Button
                  sx={{ marginTop: ".5rem" }}
                  variant="contained"
                  onClick={onAddEntity}
                  disabled={mapEntities.length === 0}
                >
                  add entity to group
                </Button>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* RIGHT */}
          <Paper sx={{ padding: ".5rem" }}>
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary id="panel1-header">
                Entities In This Group
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {groupEntities.map((item, index) => (
                    <ListItem
                      disablePadding
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => onRemoveEvent(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemButton>{item.name}</ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </div>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
        <Button
          variant="contained"
          onClick={() => onOK()}
          disabled={entityGroup.name?.trim() === ""}
        >
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
  );
}
