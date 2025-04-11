import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
//data
import { DeploymentSpot } from "../../lib/core";
import { useMapEntitiesStore } from "../../data/dataStore";
import { EntityType } from "../../lib/core";
import { Typography } from "@mui/material";

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

export default function OptionalDeploymentDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [selectedDP, setSelectedDP] = useState();
  const [dPoints, setdDPoints] = useState();
  const mapEntities = useMapEntitiesStore((store) => store.mapEntities);

  function showDialog(ea, callback) {
    // console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
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
  OptionalDeploymentDialog.ShowDialog = showDialog;

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

  function changeDP(dp) {
    setSelectedDP(dp);
    setEAValue("specificDeploymentPoint", dp.GUID);
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
          <DialogTitle>Optional Deployment Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: ".5rem" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isOnslaught"
                    checked={eventAction.isOnslaught}
                    onChange={(e) =>
                      setEAValue(e.target.name, e.target.checked)
                    }
                  />
                }
                label="This is an Onslaught"
              />

              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionSummary>Deployment Point</AccordionSummary>
                <AccordionDetails>
                  <div
                    className="two-column-grid"
                    style={{ alignItems: "flex-start" }}
                  >
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
                              setEAValue(e.target.name, DeploymentSpot.Active);
                          }}
                        />
                      }
                      label="Active Deployment Point"
                    />

                    <div>
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
                          sx={{ minWidth: "15rem" }}
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
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded sx={{ backgroundColor: "#281b40" }}>
                <AccordionDetails>
                  <FormControlLabel
                    sx={{ display: "block", marginBottom: ".5rem" }}
                    control={
                      <Checkbox
                        radioGroup="dp"
                        name="useThreat"
                        checked={eventAction.useThreat}
                        onChange={(e) => {
                          setEAValue(e.target.name, e.target.checked);
                        }}
                      />
                    }
                    label="Deduct This Group's Cost From Threat"
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
                        marginTop: ".5rem",
                        marginBottom: ".5rem",
                      }}
                    >
                      +/- Cost
                    </Typography>
                  </div>
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
