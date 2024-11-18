import { useRef } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
//data
import { CustomInstructionType } from "../../lib/core";

export default function EnemyDeploymentTab3({
  eventAction,
  modifyEA,
  selectedTabIndex,
  tabIndex,
}) {
  //refs
  const handleRef = (ref) => {
    if (ref) {
      customNameRef.current = ref;
      customNameRef.current.value = eventAction.enemyGroupData.customText;
    }
  };
  const customNameRef = useRef();

  function changeType(type) {
    modifyEA("enemyGroupData", {
      ...eventAction.enemyGroupData,
      customInstructionType: type,
    });
  }

  function setText(value) {
    // enemyGroupData.customText;
    modifyEA("enemyGroupData", {
      ...eventAction.enemyGroupData,
      customText: value,
    });
  }

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
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
                name="useCustomInstructions"
                checked={eventAction.useCustomInstructions}
                onChange={(e) => {
                  modifyEA(e.target.name, e.target.checked);
                }}
              />
            }
            label="Use Custom Instructions"
          />

          <Typography sx={{ textAlign: "center" }}>Placement</Typography>
          <div className={eventAction.useCustomInstructions ? "" : "disabled"}>
            <div className="triple-column-grid">
              <FormControlLabel
                control={
                  <Checkbox
                    name="useCustomInstructions"
                    checked={
                      eventAction.enemyGroupData.customInstructionType ===
                      CustomInstructionType.Top
                    }
                    onChange={(e) => {
                      if (e.target.checked)
                        changeType(CustomInstructionType.Top);
                    }}
                  />
                }
                label="Top"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    radioGroup=""
                    name="useCustomInstructions"
                    checked={
                      eventAction.enemyGroupData.customInstructionType ===
                      CustomInstructionType.Bottom
                    }
                    onChange={(e) => {
                      if (e.target.checked)
                        changeType(CustomInstructionType.Bottom);
                    }}
                  />
                }
                label="Bottom"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="useCustomInstructions"
                    checked={
                      eventAction.enemyGroupData.customInstructionType ===
                      CustomInstructionType.Replace
                    }
                    onChange={(e) => {
                      if (e.target.checked)
                        changeType(CustomInstructionType.Replace);
                    }}
                  />
                }
                label="Replace"
              />
            </div>

            <TextField
              label={"Custom Instructions"}
              variant="filled"
              onBlur={(e) => setText(e.target.value)}
              onFocus={(e) => e.target.select()}
              fullWidth
              multiline
              inputRef={handleRef}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

EnemyDeploymentTab3.propTypes = {
  eventAction: PropTypes.object.isRequired,
  modifyEA: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
