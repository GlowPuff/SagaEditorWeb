import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
//icons
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
//data
import { CampaignSkill } from "../../data/Mission";

export default function AddHeroSkillDialog() {
  const [open, setOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillCost, setSkillCost] = useState("");
  const [skillList, setSkillList] = useState([]);
  const callbackFunc = useRef(null);
  const cardName = useRef(null);

  function showDialog(skills, cardname, callback) {
    callbackFunc.current = callback;
    cardName.current = cardname;
    setSkillList(skills);
    setSkillName("");
    setSkillCost("");
    setOpen(true);
  }
  AddHeroSkillDialog.ShowDialog = showDialog;

  function addSkill() {
    if (skillName.trim() !== "" && skillCost.trim() !== "") {
      let newListOfSkills = reorderSkillIDs([
        ...skillList,
        new CampaignSkill(skillName, skillCost),
      ]);
      setSkillList(newListOfSkills);
      setSkillName("");
      setSkillCost("");
    }
  }

  function removeSkill(index) {
    let newListOfSkills = skillList.filter((skill, idx) => {
      if (index !== idx) return skill;
    });
    setSkillList(reorderSkillIDs(newListOfSkills));
  }

  function moveSkillUp(index) {
    if (index === 0) return;

    let newListOfSkills = [...skillList];
    let toMove = newListOfSkills[index];
    newListOfSkills[index] = newListOfSkills[index - 1];
    newListOfSkills[index - 1] = toMove;
    setSkillList(reorderSkillIDs(newListOfSkills));
  }

  function moveSkillDown(index) {
    if (index === skillList.length - 1) return;

    let newListOfSkills = [...skillList];
    let toMove = newListOfSkills[index];
    newListOfSkills[index] = newListOfSkills[index + 1];
    newListOfSkills[index + 1] = toMove;
    setSkillList(newListOfSkills);
  }

  function reorderSkillIDs(listOfSkills) {
    for (let i = 0; i < listOfSkills.length; i++) {
      listOfSkills[i].id = `${cardName.current.replace(" ", "").toLowerCase()}${
        i + 1
      }`;
    }
    return listOfSkills;
  }

  function onOK() {
    callbackFunc.current(skillList);
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
          <DialogTitle>Edit Hero Skills</DialogTitle>
          <DialogContent>
            <Paper sx={{ backgroundColor: "#201531", padding: ".5rem" }}>
              <div className="event-container">
                <div className="two-column-grid">
                  <TextField
                    required
                    label="Skill Name"
                    variant="filled"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <TextField
                    required
                    label="Skill Cost"
                    variant="filled"
                    type="number"
                    value={skillCost}
                    onChange={(e) => setSkillCost(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                <Tooltip title="Add New Skill">
                  <span>
                    <IconButton
                      onClick={addSkill}
                      disabled={
                        skillName.trim() === "" || skillCost.trim() === ""
                      }
                    >
                      <AddIcon fontSize="medium" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </Paper>

            <Paper
              sx={{
                backgroundColor: "#201531",
                padding: ".5rem",
                marginTop: ".5rem",
              }}
            >
              {skillList.map((skill, index) => {
                return (
                  <div key={index} className="event-container">
                    <Typography>{skill.name}</Typography>
                    <div className="triple-column-grid">
                      <IconButton onClick={() => moveSkillUp(index)}>
                        <KeyboardArrowUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => moveSkillDown(index)}>
                        <KeyboardArrowDownIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => removeSkill(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
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
