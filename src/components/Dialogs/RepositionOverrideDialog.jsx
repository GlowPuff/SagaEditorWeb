import { useState, useRef, useMemo } from "react";
//mui
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//my components
import EnemyFilterList from "../SubComponents/EnemyFilterList";
//data
import * as Mission from "../../data/Mission";
import { enemyData, villainData } from "../../data/carddata";
import { useToonsStore } from "../../data/dataStore";
import { CharacterType } from "../../lib/core";

export default function RepositionOverrideDialog() {
  const toons = useToonsStore((state) => state.customCharacters);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [applyAll, setApplyAll] = useState(true);
  const [specificGroups, setSpecificGroups] = useState([]);
  const [initialAddedGroups, setInitialAddedGroups] = useState([]);
  const callbackFunc = useRef(null);
  const GUID = useRef("");

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

  function onCheckAll(checked) {
    if (checked) setSpecificGroups([]);
    setApplyAll(checked);
  }

  function onGroupChanged(value) {
    let groups = value.map((item) => {
      let group = groupData.find((x) => x.id === item);
      return { name: group.name, id: group.id };
    });
    setSpecificGroups(groups);
  }

  function showDialog(repoOverride, callback) {
    callbackFunc.current = callback;
    if (repoOverride === null) repoOverride = new Mission.RepoOverride();
    setText(repoOverride.theText);
    setApplyAll(!repoOverride.useSpecific);
    let xformedGroups =
      repoOverride.repoGroups.length > 0
        ? repoOverride.repoGroups.map((item) => `${item.name} [${item.id}]`)
        : [];
    setInitialAddedGroups(xformedGroups);
    setSpecificGroups(repoOverride.repoGroups);
    GUID.current = repoOverride.GUID;
    setOpen(true);
  }
  RepositionOverrideDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current({
      theText: text ? text.trim() : "",
      useSpecific: !applyAll,
      repoGroups: specificGroups,
      GUID: GUID.current,
      eventActionType: 17,
      displayName: "",
    });
    setOpen(false);
  }

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      maxWidth={"sm"}
      fullWidth={true}
      scroll={"paper"}
    >
      <DialogTitle>Change Reposition Instructions</DialogTitle>
      <DialogContent>
        <TextField
          label={"Text"}
          variant="filled"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          fullWidth
          multiline
          sx={{ marginBottom: "1rem" }}
        />

        <Paper sx={{ padding: ".5rem" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={applyAll}
                onChange={(e) => onCheckAll(e.target.checked)}
              />
            }
            label="Apply to all Groups"
            sx={{ display: "block", marginBottom: ".5rem" }}
          />
          <div
            style={{
              pointerEvents: applyAll ? "none" : "",
              opacity: applyAll ? ".5" : "1",
            }}
          >
            <EnemyFilterList
              onGroupChanged={(value) => onGroupChanged(value)}
              title={"Apply To These Groups:"}
              initialAddedGroups={initialAddedGroups}
            />
          </div>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
        <Button variant="contained" onClick={() => onOK()}>
          continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
