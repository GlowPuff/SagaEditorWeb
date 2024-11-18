import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, TextField } from "@mui/material";
import { AttackType } from "../../lib/core";
//data
import { traitsToIntArray, intArrayToTraits } from "../../lib/core";
//components
import PriorityTargetDialog from "../Dialogs/PriorityTargetDialog";

export default function CustomToonTab4({
  selectedTabIndex,
  tabIndex,
  customToon,
  updateToon,
}) {
  //refs
  const attackRef = useRef(null);
  const defenseRef = useRef(null);

  useEffect(() => {
    if (attackRef.current) attackRef.current.value = customToon.groupAttack;
    if (defenseRef.current) defenseRef.current.value = customToon.groupDefense;
  }, [customToon.groupAttack, customToon.groupDefense]);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function changeToonProp(name, value) {
    let update = {
      ...customToon,
      [name]: value,
    };
    updateToon(update);
    // console.log("🚀 ~ changeToonProp ~ update:", update);
  }

  function changeCardProp(name, value) {
    let update = {
      ...customToon,
      deploymentCard: { ...customToon.deploymentCard, [name]: value },
    };
    updateToon(update);
    // console.log("🚀 ~ changeCardProp ~ update:", update);
  }

  function changeTraitsClick() {
    let traitObj = intArrayToTraits(customToon.deploymentCard.preferredTargets);
    PriorityTargetDialog.ShowDialog(
      traitObj,
      (value) => {
        let traits = traitsToIntArray(value);
        changeCardProp("preferredTargets", traits);
      },
      true
    );
  }

  function outputTraitNames() {
    let traitObj = intArrayToTraits(customToon.deploymentCard.preferredTargets);
    let traitNames = [];
    for (const [key, value] of Object.entries(traitObj)) {
      if (value) traitNames.push(key.substring(3));
    }

    return traitNames.reduce((acc, cur) => {
      return acc + ", " + cur;
    });
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Combat Properties
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: "orange" }}>
            For Attack and Defense, use this format:
          </Typography>
          <Typography>#Color #Color</Typography>
          <Typography
            sx={{
              color: "#ee82e5",
            }}
          >
            Example: 2Red 1Green
          </Typography>
          <Typography
            sx={{
              color: "#ee82e5",
            }}
          >
            Interprets as 2 Red dice and 1 Green dice
          </Typography>

          <div className="two-column-grid mt-p5">
            <TextField
              name="groupAttack"
              label={"Attack Example: 1Blue 2Yellow"}
              variant="filled"
              onBlur={(e) => changeToonProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
              sx={{ marginBottom: ".5rem" }}
              inputRef={attackRef}
            />
            <TextField
              name="groupDefense"
              label={"Defense Example: 1White 1Black"}
              variant="filled"
              onBlur={(e) => changeToonProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
              sx={{ marginBottom: ".5rem" }}
              inputRef={defenseRef}
            />
          </div>

          <div className="two-column-grid mt-p5 align-center">
            <Typography>Attack Type</Typography>
            <div className="two-column-grid">
              <FormControlLabel
                control={
                  <Checkbox
                    radioGroup="attackType"
                    name="attackType"
                    checked={
                      customToon.deploymentCard.attackType === AttackType.Melee
                    }
                    onChange={(e) =>
                      changeCardProp(e.target.name, AttackType.Melee)
                    }
                  />
                }
                label="Melee"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    radioGroup="attackType"
                    name="attackType"
                    checked={
                      customToon.deploymentCard.attackType === AttackType.Ranged
                    }
                    onChange={(e) =>
                      changeCardProp(e.target.name, AttackType.Ranged)
                    }
                  />
                }
                label="Ranged"
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Default Priority Target Traits
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" onClick={changeTraitsClick}>
            change priority traits...
          </Button>
          <Typography sx={{ marginTop: ".5rem" }}>
            {customToon.deploymentCard.preferredTargets.length > 0
              ? outputTraitNames()
              : "None"}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <PriorityTargetDialog />
    </div>
  );
}

CustomToonTab4.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  customToon: PropTypes.object.isRequired,
  updateToon: PropTypes.func.isRequired,
};
