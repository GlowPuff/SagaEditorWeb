import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
//icons
import AddIcon from "@mui/icons-material/Add";
//components
import EntityModifierItem from "../SubComponents/EntityModifierItem";
//data
import { useMapEntitiesStore } from "../../data/dataStore";
import { EntityModifier } from "../../data/Mission";

export default function ModifyMapEntityDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [selectedEntity, setSelectedEntity] = useState("");

  const mapEntities = useMapEntitiesStore((state) => state.mapEntities);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function updateEntityModifier(em) {
    console.log("🚀 ~ updateEntityModifier ~ em:", em);
    setEAValue(
      "entitiesToModify",
      eventAction.entitiesToModify.map((x) => (x.GUID === em.GUID ? em : x))
    );
  }

  function showDialog(ea, callback) {
    callbackFunc.current = callback;
    setSelectedEntity(mapEntities[0]);
    setEventAction(ea);
    setOpen(true);
  }
  ModifyMapEntityDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function addEntityClick() {
    let modifier = EntityModifier.fromEntity(selectedEntity);
    console.log("🚀 ~ addEntityClick ~ selectedEntity:", selectedEntity);
    console.log("🚀 ~ addEntityClick ~ modifier:", modifier);
    setEAValue("entitiesToModify", [...eventAction.entitiesToModify, modifier]);
  }

  function removeEntityClick(index) {
    setEAValue(
      "entitiesToModify",
      eventAction.entitiesToModify.filter((x, idx) => index !== idx)
    );
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
          <DialogTitle>Modify Map Entity Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
              <div className="event-container align-center">
                <FormControl>
                  <InputLabel>Map Entities</InputLabel>
                  <Select
                    value={selectedEntity}
                    onChange={(e) => {
                      setEAValue(e.target.value);
                      setSelectedEntity(e.target.value);
                    }}
                    displayEmpty
                  >
                    {mapEntities.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title="Add Map Entity">
                  <IconButton onClick={addEntityClick}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>

            <Paper
              sx={{
                padding: "1rem",
                marginBottom: ".5rem",
                backgroundColor: "#ff8c00",
              }}
            >
              <Typography sx={{ color: "black" }}>
                This Event Action creates a SNAPSHOT COPY of an Entity at the
                moment you add it here. The Snapshot is a special editable copy
                and is not visible on the Map. Be aware that changing the
                ORIGINAL Entity&apos;s properties AFTER adding it here will NOT
                UPDATE this snapshot copy.
              </Typography>
            </Paper>

            <Paper sx={{ padding: "1rem" }}>
              <List
                sx={{
                  overflow: "auto",
                  scrollbarColor: "#bc56ff #4c4561",
                  scrollbarWidth: "thin",
                  maxHeight: "14rem",
                }}
              >
                {eventAction.entitiesToModify.map((item, index) => (
                  <ListItem disablePadding key={index}>
                    <EntityModifierItem
                      entityToModify={item}
                      updateEntityModifier={updateEntityModifier}
                      removeEntityClick={() => removeEntityClick(index)}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
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
