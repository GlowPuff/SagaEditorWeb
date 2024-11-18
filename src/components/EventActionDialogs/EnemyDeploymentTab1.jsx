import { useState } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
//dialogs
import PriorityTargetDialog from "../Dialogs/PriorityTargetDialog";
import GenericTextDialog from "../Dialogs/GenericTextDialog";

export default function EnemyDeploymentTab1({
  eventAction,
  modifyEA,
  selectedTabIndex,
  tabIndex,
}) {
  const [mod, setMod] = useState(eventAction.modification);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onBlurEv(e) {
    modifyEA(e.target.name, e.target.value);
  }

  function changeDefaultTraits(checked) {
    modifyEA("enemyGroupData", {
      ...eventAction.enemyGroupData,
      groupPriorityTraits: {
        ...eventAction.enemyGroupData.groupPriorityTraits,
        useDefaultPriority: checked,
      },
    });
  }

  function changeTraitsClick() {
    PriorityTargetDialog.ShowDialog(
      eventAction.enemyGroupData.groupPriorityTraits,
      (value) => {
        modifyEA("enemyGroupData", {
          ...eventAction.enemyGroupData,
          groupPriorityTraits: value,
        });
      }
    );
  }

  function editInstructionsClick() {
    GenericTextDialog.ShowDialog(
      "Edit Reposition Instructions",
      eventAction.repositionInstructions,
      (value) => {
        modifyEA("repositionInstructions", value);
      }
    );
  }

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      <Accordion
        defaultExpanded
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary>Group Cost</AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                name="useThreat"
                checked={eventAction.useThreat}
                onChange={(e) => modifyEA(e.target.name, e.target.checked)}
              />
            }
            label="Deduct This Group's Cost From Threat"
          />

          <div className="two-column-grid align-center  mt-p5">
            <Typography>Modify This Group&apos;s Cost By:</Typography>
            <div className="two-column-grid align-center  mt-p5">
              <TextField
                name="threatCost"
                type="number"
                label={"Modifier"}
                variant="filled"
                onBlur={(e) => onBlurEv(e)}
                onFocus={(e) => e.target.select()}
                onKeyUp={onKeyUp}
                fullWidth
              />
              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                }}
              >
                +/- Cost
              </Typography>
            </div>
          </div>

          <div className="two-column-grid align-center mt-1">
            <FormControlLabel
              control={
                <Checkbox
                  name="showMod"
                  checked={eventAction.showMod}
                  onChange={(e) => modifyEA(e.target.name, e.target.checked)}
                />
              }
              label="Show This Modification:"
            />
            <TextField
              disabled={!eventAction.showMod}
              name="modification"
              label={"Modification"}
              variant="filled"
              value={mod}
              onChange={(e) => setMod(e.target.value)}
              onBlur={(e) => onBlurEv(e)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
          </div>
        </AccordionDetails>
      </Accordion>

      {/* PRIORITY TARGET */}
      <Accordion
        defaultExpanded
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary>Priority Target Traits</AccordionSummary>
        <AccordionDetails>
          <div className="two-column-grid">
            <FormControlLabel
              control={
                <Checkbox
                  name="showMod"
                  checked={
                    eventAction.enemyGroupData.groupPriorityTraits
                      .useDefaultPriority
                  }
                  onChange={(e) => changeDefaultTraits(e.target.checked)}
                />
              }
              label="Use Group Default"
            />
            <Button
              disabled={
                eventAction.enemyGroupData.groupPriorityTraits
                  .useDefaultPriority
              }
              variant="contained"
              onClick={changeTraitsClick}
            >
              change traits...
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* REPOSITION */}
      <Accordion
        defaultExpanded
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary>Reposition Group Instructions</AccordionSummary>
        <AccordionDetails>
          <div className="two-column-grid align-center">
            <Button variant="contained" onClick={editInstructionsClick}>
              edit instructions...
            </Button>
            <Typography
              sx={{ textAlign: "center" }}
              color={eventAction.repositionInstructions.trim() ? "lime" : "red"}
            >
              {eventAction.repositionInstructions.trim()
                ? "Text Set"
                : "Text Not Set"}
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <PriorityTargetDialog />
      <GenericTextDialog />
    </div>
  );
}

EnemyDeploymentTab1.propTypes = {
  eventAction: PropTypes.object.isRequired,
  modifyEA: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
