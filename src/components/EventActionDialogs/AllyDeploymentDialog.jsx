import { useState, useRef, useMemo } from "react";
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
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//components
import EventSelectAdd from "../SubComponents/EventSelectAdd";
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";
//data
import { CharacterType } from "../../lib/core";
import { allyData } from "../../data/carddata";
import { DeploymentSpot } from "../../lib/core";
import { useMapEntitiesStore } from "../../data/dataStore";
import { EntityType } from "../../lib/core";
import { useToonsStore } from "../../data/dataStore";

// const transformedData = allyData.map((item) => ({
//   name: item.name,
//   id: item.id,
// }));

const defaultDP = [
  {
    name: "Active Deployment Point",
    GUID: "00000000-0000-0000-0000-000000000000",
  },
  {
    name: "None",
    GUID: "11111111-1111-1111-1111-111111111111",
  },
];

export default function AllyDeploymentDialog() {
  const toons = useToonsStore((state) => state.customCharacters);
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [selectedAlly, setSelectedAlly] = useState();
  const [selectedDP, setSelectedDP] = useState();
  const [dPoints, setdDPoints] = useState();
  const mapEntities = useMapEntitiesStore((store) => store.mapEntities);

  const transformedData = useMemo(() => {
    const baseGroups = allyData.map((item) => ({
      name: item.name,
      id: item.id,
    }));
    const customGroups = toons
      .filter(
        (t) =>
          t.deploymentCard.characterType === CharacterType.Ally ||
          t.deploymentCard.characterType === CharacterType.Rebel
      )
      .map((toon) => ({
        name: toon.deploymentCard.name,
        id: toon.deploymentCard.id,
      }));
    return [...baseGroups, ...customGroups];
  }, [toons]);

  function changeDP(dp) {
    setSelectedDP(dp);
    setEAValue("specificDeploymentPoint", dp.GUID);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    // console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setSelectedAlly(transformedData.find((x) => x.id === ea.allyID) || "");

    let deploymentPoints = [
      ...defaultDP,
      ...mapEntities
        .filter((x) => x.entityType === EntityType.DeploymentPoint)
        .map((item) => ({ name: item.name, GUID: item.GUID })),
    ];
    setdDPoints(deploymentPoints);
    setSelectedDP(
      deploymentPoints.find((x) => x.GUID == ea.specificDeploymentPoint) || ""
    );
    setOpen(true);
  }
  AllyDeploymentDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
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
          <DialogTitle>Ally/Rebel Deployment Event Action</DialogTitle>
          <DialogContent>
            <div className="two-column-grid">
              {/* LEFT */}
              <div>
                <Paper sx={{ padding: ".5rem" }}>
                  <div className="mission-panel align-center">
                    <Typography>Select an Ally to deploy.</Typography>
                    <FormControl>
                      <InputLabel>Deploy Ally</InputLabel>
                      <Select
                        name="allyID"
                        value={selectedAlly || ""}
                        onChange={(e) => {
                          setEAValue(e.target.name, e.target.value.id);
                          setSelectedAlly(e.target.value);
                        }}
                        displayEmpty
                      >
                        {transformedData.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <Accordion
                    defaultExpanded
                    sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                  >
                    <AccordionSummary>Customize</AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        name="allyName"
                        label={"Custom Name - Blank For Default"}
                        variant="filled"
                        value={eventAction.allyName}
                        onChange={(e) =>
                          setEAValue(e.target.name, e.target.value)
                        }
                        onFocus={(e) => e.target.select()}
                        onKeyUp={onKeyUp}
                        fullWidth
                        sx={{ marginBottom: ".5rem" }}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            name="useGenericMugshot"
                            checked={eventAction.useGenericMugshot}
                            onChange={(e) =>
                              setEAValue(e.target.name, e.target.checked)
                            }
                          />
                        }
                        label="Use Generic Thumbnail"
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    defaultExpanded
                    sx={{
                      backgroundColor: "#281b40",
                    }}
                  >
                    <AccordionSummary>On Defeated...</AccordionSummary>
                    <AccordionDetails>
                      <Typography>Fire This Trigger:</Typography>
                      <TriggerSelectAdd
                        initialGUID={eventAction.setTrigger}
                        onItemChanged={(e) => setEAValue("setTrigger", e.GUID)}
                      />

                      <Typography sx={{ marginTop: ".5rem" }}>
                        Fire This Event:
                      </Typography>
                      <EventSelectAdd
                        initialGUID={eventAction.setEvent}
                        onItemChanged={(e) => setEAValue("setEvent", e.GUID)}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              </div>

              {/* RIGHT */}
              <div>
                <Paper sx={{ padding: ".5rem" }}>
                  <Accordion
                    defaultExpanded
                    sx={{
                      backgroundColor: "#281b40",
                    }}
                  >
                    <AccordionSummary>Deployment Point</AccordionSummary>
                    <AccordionDetails>
                      <FormControlLabel
                        control={
                          <Checkbox
                            radioGroup="dp"
                            name="deploymentPoint"
                            checked={
                              eventAction.deploymentPoint ===
                              DeploymentSpot.Active
                            }
                            onChange={(e) => {
                              if (e.target.checked)
                                setEAValue(
                                  e.target.name,
                                  DeploymentSpot.Active
                                );
                            }}
                          />
                        }
                        label="Active Deployment Point"
                      />
                      <FormControlLabel
                        sx={{ display: "block", marginBottom: ".5rem" }}
                        control={
                          <Checkbox
                            radioGroup="dp"
                            name="deploymentPoint"
                            checked={
                              eventAction.deploymentPoint ===
                              DeploymentSpot.Specific
                            }
                            onChange={(e) => {
                              if (e.target.checked)
                                setEAValue(
                                  e.target.name,
                                  DeploymentSpot.Specific
                                );
                            }}
                          />
                        }
                        label="Specific Deployment Point:"
                      />
                      <FormControl>
                        <InputLabel>Specific Deployment Point</InputLabel>
                        <Select
                          disabled={
                            eventAction.deploymentPoint !==
                            DeploymentSpot.Specific
                          }
                          name="specificDeploymentPoint"
                          value={selectedDP || ""}
                          onChange={(e) => changeDP(e.target.value)}
                          displayEmpty
                        >
                          {dPoints.map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    defaultExpanded
                    sx={{
                      backgroundColor: "#281b40",
                    }}
                  >
                    <AccordionDetails>
                      <FormControlLabel
                        sx={{ display: "block" }}
                        control={
                          <Checkbox
                            name="useThreat"
                            checked={eventAction.useThreat}
                            onChange={(e) => {
                              setEAValue(e.target.name, e.target.checked);
                            }}
                          />
                        }
                        label="Add This Group's Cost To Threat"
                      />
                      <div className="two-column-grid align-center">
                        <TextField
                          name="threatCost"
                          type="number"
                          label={"Cost Modifier"}
                          variant="filled"
                          value={eventAction.threatCost}
                          onChange={(e) =>
                            setEAValue(e.target.name, e.target.value)
                          }
                          onFocus={(e) => e.target.select()}
                          onKeyUp={onKeyUp}
                          fullWidth
                        />
                        <Typography
                          sx={{
                            color: "#ee82e5",
                          }}
                        >
                          +/- Cost
                        </Typography>
                      </div>
                    </AccordionDetails>
                  </Accordion>
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
