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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//dialog
import PriorityTargetDialog from "../Dialogs/PriorityTargetDialog";
//components
import EnemyFilter from "../SubComponents/GroupFilter";
//data
import { heroData, allyData } from "../../data/carddata";
import { GroupType, PriorityTargetType } from "../../lib/core";

export default function ChangeTargetDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [hero, setHero] = useState();
  const [ally, setAlly] = useState();

  function onAddGroup(group) {
    setEAValue("groupsToAdd", [
      ...eventAction.groupsToAdd,
      {
        id: group.id,
        name: group.name,
      },
    ]);
  }

  function onRemoveGroup(index) {
    setEAValue(
      "groupsToAdd",
      eventAction.groupsToAdd.filter((x, idx) => idx !== index)
    );
  }

  function editTraitsClick() {
    PriorityTargetDialog.ShowDialog(
      eventAction.groupPriorityTraits,
      (value) => {
        setEAValue("groupPriorityTraits", value);
      }
    );
  }

  function changeHero(group) {
    setHero(group);
    setEAValue("specificHero", group.id);
  }

  function changeAlly(group) {
    setAlly(group);
    setEAValue("specificAlly", group.id);
  }

  function showDialog(ea, callback) {
    console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setHero(heroData.find((x) => x.id === ea.specificHero));
    setAlly(allyData.find((x) => x.id === ea.specificAlly));
    setOpen(true);
  }
  ChangeTargetDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"md"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Change Priority Target Event Action</DialogTitle>
          <DialogContent>
            <div className="two-column-grid">
              <Paper sx={{ padding: ".5rem" }}>
                {/* LEFT */}
                <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                  <AccordionSummary>New Priority Target</AccordionSummary>
                  <AccordionDetails>
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="group"
                          checked={
                            eventAction.targetType === PriorityTargetType.Rebel
                          }
                          onChange={(ev) => {
                            if (ev.target.checked)
                              setEAValue(
                                "targetType",
                                PriorityTargetType.Rebel
                              );
                          }}
                        />
                      }
                      label="Any Rebel Figure"
                    />

                    {/* HERO */}
                    <div className="two-column-grid mt-p5">
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="group"
                            checked={
                              eventAction.targetType === PriorityTargetType.Hero
                            }
                            onChange={(ev) => {
                              if (ev.target.checked)
                                setEAValue(
                                  "targetType",
                                  PriorityTargetType.Hero
                                );
                            }}
                          />
                        }
                        label="Specific Hero"
                      />
                      <Select
                        disabled={
                          eventAction.targetType !== PriorityTargetType.Hero
                        }
                        value={hero}
                        onChange={(ev) => {
                          changeHero(ev.target.value);
                        }}
                      >
                        {heroData.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>

                    {/* ALLY/REBEL */}
                    <div className="two-column-grid mt-p5">
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="group"
                            checked={
                              eventAction.targetType === PriorityTargetType.Ally
                            }
                            onChange={(ev) => {
                              if (ev.target.checked)
                                setEAValue(
                                  "targetType",
                                  PriorityTargetType.Ally
                                );
                            }}
                          />
                        }
                        label="Specific Ally/Rebel"
                      />
                      <Select
                        disabled={
                          eventAction.targetType !== PriorityTargetType.Ally
                        }
                        value={ally}
                        onChange={(ev) => {
                          changeAlly(ev.target.value);
                        }}
                      >
                        {allyData.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>

                    {/* TRAIT */}
                    <div className="two-column-grid mt-p5">
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="group"
                            checked={
                              eventAction.targetType ===
                              PriorityTargetType.Trait
                            }
                            onChange={(ev) => {
                              if (ev.target.checked)
                                setEAValue(
                                  "targetType",
                                  PriorityTargetType.Trait
                                );
                            }}
                          />
                        }
                        label="Specific Target Traits"
                      />
                      <Button
                        disabled={
                          eventAction.targetType !== PriorityTargetType.Trait
                        }
                        variant="contained"
                        onClick={editTraitsClick}
                      >
                        select traits...
                      </Button>
                    </div>
                    <div className="two-column-grid mt-p5">
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="group"
                            checked={
                              eventAction.targetType ===
                              PriorityTargetType.Other
                            }
                            onChange={(ev) => {
                              if (ev.target.checked)
                                setEAValue(
                                  "targetType",
                                  PriorityTargetType.Other
                                );
                            }}
                          />
                        }
                        label="Other"
                      />
                      <TextField
                        disabled={
                          eventAction.targetType !== PriorityTargetType.Other
                        }
                        label={"Other Target"}
                        variant="filled"
                        value={eventAction.otherTarget}
                        onChange={(e) => {
                          setEAValue("otherTarget", e.target.value);
                        }}
                        onFocus={(e) => e.target.select()}
                        onKeyUp={onKeyUp}
                        fullWidth
                      />
                    </div>

                    <div className="two-column-grid mt-p5">
                      <Typography>
                        Percent Chance Priority Target Is Enforced
                      </Typography>
                      <TextField
                        type="number"
                        label={"Percent Chance"}
                        variant="filled"
                        value={eventAction.percentChance}
                        onChange={(e) => {
                          setEAValue("percentChance", e.target.value);
                        }}
                        onFocus={(e) => e.target.select()}
                        onKeyUp={onKeyUp}
                        fullWidth
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Paper>

              {/* RIGHT */}
              <Paper sx={{ padding: ".5rem" }}>
                <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                  <AccordionSummary>
                    Which Enemy Groups Are Affected By This Override?
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControlLabel
                      sx={{ display: "block" }}
                      control={
                        <Checkbox
                          radioGroup="group2"
                          checked={eventAction.groupType === GroupType.All}
                          onChange={(ev) => {
                            if (ev.target.checked)
                              setEAValue("groupType", GroupType.All);
                          }}
                        />
                      }
                      label="All Enemy Groups"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="group2"
                          checked={eventAction.groupType === GroupType.Specific}
                          onChange={(ev) => {
                            if (ev.target.checked)
                              setEAValue("groupType", GroupType.Specific);
                          }}
                        />
                      }
                      label="Specific Groups:"
                    />

                    {/* ENEMY LIST */}
                    <div
                      style={{ width: "100%" }}
                      className={
                        ("event-container",
                        eventAction.groupType === GroupType.All
                          ? "disabled"
                          : "")
                      }
                    >
                      <EnemyFilter
                        title={"Enemy Groups"}
                        onAdd={(g) => onAddGroup(g)}
                        onRemove={(index) => onRemoveGroup(index)}
                        groupList={eventAction.groupsToAdd}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </div>
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
      <PriorityTargetDialog />
    </>
  );
}
