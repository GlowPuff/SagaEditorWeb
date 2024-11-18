import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
//data
import { EventActionType } from "../../lib/core";

const menuItems = [
  {
    root: "General",
    subitems: [
      { name: "Mission Management", eaType: EventActionType.G1 },
      { name: "Change Mission Info", eaType: EventActionType.G2 },
      { name: "Change Objective", eaType: EventActionType.G3 },
      { name: "Modify Variable(s)", eaType: EventActionType.G4 },
      { name: "Modify Threat", eaType: EventActionType.G5 },
      { name: "Activate Event Group", eaType: EventActionType.G8 },
      { name: "Modify Round Limit", eaType: EventActionType.G10 },
      { name: "Set Countdown", eaType: EventActionType.G11 },
    ],
  },
  {
    root: "Dialogs",
    subitems: [
      { name: "Text Box", eaType: EventActionType.G7 },
      { name: "Question Prompt", eaType: EventActionType.G6 },
      { name: "Input Prompt", eaType: EventActionType.G9 },
    ],
  },
  {
    root: "Deployment",
    subitems: [
      { name: "Enemy Deployment", eaType: EventActionType.D1 },
      { name: "Ally/Rebel Deployment", eaType: EventActionType.D2 },
      { name: "Optional Deployment", eaType: EventActionType.D3 },
      { name: "Random Deployment", eaType: EventActionType.D4 },
      { name: "Add Group(s) to Deployment Hand", eaType: EventActionType.D5 },
      { name: "(DEPRECATED) Custom Deployment", eaType: EventActionType.D6 },
    ],
  },
  {
    root: "Group Manipulation",
    subitems: [
      { name: "Change Group Instructions", eaType: EventActionType.GM1 },
      { name: "Change Priority Target", eaType: EventActionType.GM2 },
      { name: "Change Reposition Instructions", eaType: EventActionType.GM4 },
      { name: "Ready / Exhaust a Group", eaType: EventActionType.GM3 },
      { name: "Reset Group Defaults", eaType: EventActionType.GM5 },
      { name: "Remove Group", eaType: EventActionType.GM6 },
      { name: "Query Group", eaType: EventActionType.GM7 },
    ],
  },
  {
    root: "Map and Tokens",
    subitems: [
      { name: "Map Management", eaType: EventActionType.M1 },
      { name: "Modify Map Entity", eaType: EventActionType.M2 },
    ],
  },
  {
    root: "Campaign Management",
    subitems: [
      { name: "Modify XP", eaType: EventActionType.CM1 },
      { name: "Modify Credits", eaType: EventActionType.CM2 },
      { name: "Modify Fame and Awards", eaType: EventActionType.CM3 },
      { name: "Set Next Mission", eaType: EventActionType.CM4 },
      { name: "Add Campaign Reward", eaType: EventActionType.CM5 },
    ],
  },
];

export default function NewEADialog() {
  const [selectedRoot, setSelectedRoot] = useState(0);
  const [selectedSubitem, onChangeSelectedSubitem] = useState(0);
  const [subList, setSubList] = useState(menuItems[0].subitems);
  const [open, setOpen] = useState(false);
  const callbackFunc = useRef(null);

  function onChangeSelectedRoot(index) {
    setSelectedRoot(index);
    onChangeSelectedSubitem(0);
    setSubList(menuItems[index].subitems);
  }

  function showDialog(callback) {
    callbackFunc.current = callback;
    setSelectedRoot(0);
    onChangeSelectedSubitem(0);
    setSubList(menuItems[0].subitems);
    setOpen(true);
  }
  NewEADialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(
      menuItems[selectedRoot].subitems[selectedSubitem].eaType
    );
    setOpen(false);
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
          <DialogTitle>New Event Action</DialogTitle>
          <DialogContent>
            <div className="mission-panel">
              {/* LEFT */}
              <Paper sx={{ padding: ".5rem" }}>
                <List sx={{ flex: "1" }}>
                  {menuItems.map((item, index) => (
                    <ListItem disablePadding key={index}>
                      <ListItemButton
                        selected={selectedRoot === index}
                        onClick={() => onChangeSelectedRoot(index)}
                      >
                        {item.root}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* RIGHT */}
              <Paper sx={{ padding: ".5rem" }}>
                <List sx={{ flex: "1" }}>
                  {subList.map((item, index) => (
                    <ListItem disablePadding key={index}>
                      <ListItemButton
                        selected={selectedSubitem === index}
                        onClick={() => onChangeSelectedSubitem(index)}
                        onDoubleClick={() => onOK()}
                      >
                        {item.name}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </div>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Typography sx={{ marginRight: "auto", paddingLeft: "1rem" }}>
              Selected{" "}
              <span style={{ color: "#cb4ff9" }}>
                {menuItems[selectedRoot].root}
              </span>{" "}
              /{" "}
              <span style={{ color: "lime" }}>
                {menuItems[selectedRoot].subitems[selectedSubitem].name}
              </span>
            </Typography>
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
