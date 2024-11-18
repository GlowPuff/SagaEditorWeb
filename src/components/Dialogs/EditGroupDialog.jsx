import { useState, useRef } from "react";
//mui
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//my components
import EventSelectAdd from "../SubComponents/EventSelectAdd";
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";
//dialogs
import PriorityTargetDialog from "./PriorityTargetDialog";
import GenericTextDialog from "./GenericTextDialog";
import SetDPDialog from "./SetDPDialog";
//data
import * as core from "../../lib/core";
import { enemyData, villainData } from "../../data/carddata";

let groupData = [...enemyData, ...villainData];

export default function EditGroupDialog() {
  const [open, setOpen] = useState(false);
  const callbackFunc = useRef(null);
  const [enemyGroup, setEnemyGroup] = useState();

  function modifyGroup(name, value) {
    if (name === "cardName") {
      setEnemyGroup({
        ...enemyGroup,
        [name]: value,
        useInitialGroupCustomName: value.trim() === "" ? false : true,
      });
    } else setEnemyGroup({ ...enemyGroup, [name]: value });
  }

  function onEditInstructionsClick() {
    GenericTextDialog.ShowDialog(
      "Edit Custom Instructions",
      enemyGroup.customText,
      (value) => {
        modifyGroup("customText", value);
      }
    );
  }

  function onEditDPClick() {
    let dpTitle = groupData.find((x) => x.id === enemyGroup.cardID);
    SetDPDialog.ShowDialog(
      `${dpTitle.name}: ${dpTitle.id}`,
      enemyGroup.pointList,
      (value) => {
        modifyGroup("pointList", value);
      }
    );
  }

  function onEditTraitsClick() {
    PriorityTargetDialog.ShowDialog(enemyGroup.groupPriorityTraits, (value) => {
      modifyGroup("groupPriorityTraits", value);
    });
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function showDialog(group, callback) {
    callbackFunc.current = callback;
    if (!group.useInitialGroupCustomName) group.cardName = "";
    setEnemyGroup(group);
    setOpen(true);
  }
  EditGroupDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(enemyGroup);
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
      {enemyGroup && (
        <>
          <DialogTitle>
            Edit Initial Group [
            {enemyGroup.useInitialGroupCustomName
              ? enemyGroup.cardName
              : "Use Default Name"}
            ]
          </DialogTitle>
          <DialogContent>
            <div className="mission-panel">
              {/* LEFT SIDE */}
              <Paper sx={{ padding: ".5rem" }}>
                <TextField
                  label={"Custom Name - Blank for Default"}
                  value={enemyGroup.cardName}
                  onKeyUp={(e) => onKeyUp(e)}
                  onChange={(e) => modifyGroup("cardName", e.target.value)}
                  sx={{ width: "100%" }}
                />
                {/* DUMMY ICON */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="factionImperial"
                      checked={enemyGroup.useGenericMugshot}
                      onChange={(e) =>
                        modifyGroup("useGenericMugshot", e.target.checked)
                      }
                    />
                  }
                  label="Use Generic Thumbnail"
                />
                {/* INFO */}
                <Typography sx={{ color: "#ee82e5", textAlign: "justify" }}>
                  Forcing the use of a Generic Thumbnail will essentially make
                  this deployment a &apos;dummy token&apos; when its card is
                  shown in Imperial Commander. All unique data about this group
                  will be set to 0 or empty values, such as health, cost,
                  abilities, bonus text, traits, keywords, attack, and defense.
                </Typography>
                {/* TRIGGERS */}
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1-header"
                  >
                    On Defeated, Fire This Trigger:
                  </AccordionSummary>
                  <AccordionDetails>
                    <TriggerSelectAdd
                      initialGUID={enemyGroup.defeatedTrigger}
                      onItemChanged={(e) =>
                        modifyGroup("defeatedTrigger", e.GUID)
                      }
                    />
                  </AccordionDetails>
                </Accordion>
                {/* EVENTS */}
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1-header"
                  >
                    On Defeated, Fire This Event:
                  </AccordionSummary>
                  <AccordionDetails>
                    <EventSelectAdd
                      initialGUID={enemyGroup.defeatedEvent}
                      onItemChanged={(e) =>
                        modifyGroup("defeatedEvent", e.GUID)
                      }
                    />
                  </AccordionDetails>
                </Accordion>
              </Paper>

              {/* RIGHT SIDE */}
              <Paper sx={{ padding: ".5rem" }}>
                {/* CUSTOM INSTRUCTIONS */}
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1-header"
                  >
                    Custom Instructions
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="triple-column-grid">
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="location"
                            name="customInstructionType"
                            checked={
                              enemyGroup.customInstructionType ===
                              core.CustomInstructionType.Top
                            }
                            onChange={(e) => {
                              if (e.target.checked)
                                modifyGroup(
                                  "customInstructionType",
                                  core.CustomInstructionType.Top
                                );
                            }}
                          />
                        }
                        label="Top"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="location"
                            name="customInstructionType"
                            checked={
                              enemyGroup.customInstructionType ===
                              core.CustomInstructionType.Bottom
                            }
                            onChange={(e) => {
                              if (e.target.checked)
                                modifyGroup(
                                  "customInstructionType",
                                  core.CustomInstructionType.Bottom
                                );
                            }}
                          />
                        }
                        label="Bottom"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="location"
                            name="customInstructionType"
                            checked={
                              enemyGroup.customInstructionType ===
                              core.CustomInstructionType.Replace
                            }
                            onChange={(e) => {
                              if (e.target.checked)
                                modifyGroup(
                                  "customInstructionType",
                                  core.CustomInstructionType.Replace
                                );
                            }}
                          />
                        }
                        label="Replace"
                      />
                    </div>
                    <div className="event-container">
                      <Button
                        variant="contained"
                        onClick={onEditInstructionsClick}
                      >
                        Edit Custom Instructions...
                      </Button>
                      <Typography
                        sx={{ color: enemyGroup.customText ? "lime" : "red" }}
                      >
                        {enemyGroup.customText ? "Text Set" : "Text Not Set"}
                      </Typography>
                    </div>
                  </AccordionDetails>
                </Accordion>
                {/* DP */}
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1-header"
                  >
                    Deployment Point
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button variant="contained" onClick={onEditDPClick}>
                      Edit Deployment Points...
                    </Button>
                  </AccordionDetails>
                </Accordion>
                {/* TRAITS */}
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1-header"
                  >
                    Priority Target Traits
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="two-column-grid">
                      <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="customInstructionType"
                              checked={
                                enemyGroup.groupPriorityTraits
                                  .useDefaultPriority
                              }
                              onChange={(e) =>
                                modifyGroup("groupPriorityTraits", {
                                  ...enemyGroup.groupPriorityTraits,
                                  useDefaultPriority: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Use Group Default"
                        />
                      </div>
                      <div>
                        <Button variant="contained" onClick={onEditTraitsClick}>
                          change traits...
                        </Button>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </div>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button variant="contained" onClick={() => onOK()}>
              continue
            </Button>
          </DialogActions>

          {/* DIALOGS */}
          <SetDPDialog />
          <PriorityTargetDialog />
        </>
      )}
    </Dialog>
  );
}
