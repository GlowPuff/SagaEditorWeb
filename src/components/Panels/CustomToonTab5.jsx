import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";
//data
import { stringArrayToTraits, traitsToStringArray } from "../../lib/core";
//dialog
import PriorityTargetDialog from "../Dialogs/PriorityTargetDialog";
import AddHeroSkillDialog from "../Dialogs/AddHeroSkillDialog";
import GenericTextDialog from "../Dialogs/GenericTextDialog";

export default function CustomToonTab5({
  selectedTabIndex,
  tabIndex,
  customToon,
  updateToon,
}) {
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

  function addTrait() {
    let traitObj = stringArrayToTraits(customToon.deploymentCard.traits);
    PriorityTargetDialog.ShowDialog(
      traitObj,
      (value) => {
        console.log("🚀 ~ PriorityTargetDialog.showDialog ~ value:", value);
        let traits = traitsToStringArray(value);
        changeCardProp("traits", traits);
      },
      true
    );
  }

  function editHeroSkills() {
    AddHeroSkillDialog.ShowDialog(
      customToon.heroSkills,
      customToon.cardName,
      (value) => {
        value = value.map((x) => ({
          ...x,
          owner: customToon.customCharacterGUID,
        }));
        changeToonProp("heroSkills", value);
      }
    );
  }

  function editInstructions() {
    let s = "";
    if (customToon.cardInstruction.content.length > 0) {
      customToon.cardInstruction.content.forEach((item) => {
        s += item.instruction.reduce((acc, cur) => acc + "\n" + cur);
        s += "\n===\n";
      });
      s = s.substring(0, s.lastIndexOf("===")).trim();
    }

    GenericTextDialog.ShowDialog("Edit Instructions", s, (value) => {
      if (value.trim().length === 0) return;

      let instruction = { ...customToon.cardInstruction };
      let content = [];
      var groups = value.trim().split("\n===\n");
      for (let item of groups) {
        content.push({ instruction: item.trim().split("\n") });
      }
      instruction.content = content;
      changeToonProp("cardInstruction", instruction);
    });
  }

  function editBonuses() {
    let s = "";
    if (customToon.bonusEffect.effects.length > 0)
      s = customToon.bonusEffect.effects.join("\n");

    GenericTextDialog.ShowDialog("Edit Bonuses", s, (value) => {
      let newEffect = { bonusID: customToon.cardID, effects: [] };
      if (value.trim().length !== 0) {
        newEffect.effects = value
          .trim()
          .split("\n")
          .map((x) => x.trim());
      }
      changeToonProp("bonusEffect", newEffect);
    });
  }

  function editAbilities() {
    let s = "";
    if (customToon.deploymentCard.abilities.length > 0)
      s = customToon.deploymentCard.abilities
        .map((x) => `${x.name}:${x.text}`)
        .reduce((acc, cur) => acc + "\n" + cur);

    GenericTextDialog.ShowDialog("Edit Abilities", s, (value) => {
      let newAbilities = [];
      if (value.trim().length !== 0) {
        let array = value.trim().split("\n"); // get each line of text
        newAbilities = array.map((item) => {
          let a = item.trim().split(":"); // split into name and text
          return { name: a[0].trim(), text: a[1].trim() };
        });
        changeCardProp("abilities", newAbilities);
      }
    });
  }

  function editSurges() {
    let s = "";
    if (customToon.deploymentCard.surges.length > 0)
      s = customToon.deploymentCard.surges.join("\n");

    GenericTextDialog.ShowDialog("Edit Surges", s, (value) => {
      let newSurges = [];
      if (value.trim().length !== 0) {
        newSurges = value
          .trim()
          .split("\n")
          .map((x) => x.trim());
      }
      changeCardProp("surges", newSurges);
    });
  }

  function editKeywords() {
    let s = "";
    if (customToon.deploymentCard.keywords.length > 0)
      s = customToon.deploymentCard.keywords.join("\n");

    GenericTextDialog.ShowDialog("Edit Keywords", s, (value) => {
      let newKeywords = [];
      if (value.trim().length !== 0) {
        newKeywords = value
          .trim()
          .split("\n")
          .map((x) => x.trim());
      }
      changeCardProp("keywords", newKeywords);
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Instructions, Bonuses, Abilities, Surges and Keywords
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ marginBottom: ".5rem" }}>
            <i>Card Text data is pre-filled with EXAMPLE data by Default.</i>
          </Typography>

          <Button
            sx={{ margin: ".5rem" }}
            variant="contained"
            onClick={editInstructions}
          >
            instructions...
          </Button>
          <Button
            onClick={editBonuses}
            sx={{ margin: ".5rem" }}
            variant="contained"
          >
            bonuses...
          </Button>
          <Button
            onClick={editAbilities}
            sx={{ margin: ".5rem" }}
            variant="contained"
          >
            abilities...
          </Button>
          <Button
            onClick={editSurges}
            sx={{ margin: ".5rem" }}
            variant="contained"
          >
            surges...
          </Button>
          <Button
            onClick={editKeywords}
            sx={{ margin: ".5rem" }}
            variant="contained"
          >
            keywords...
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        sx={{
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Character Traits
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" onClick={addTrait}>
            Add Trait...
          </Button>
          <Typography sx={{ marginTop: ".5rem" }}>
            {customToon.deploymentCard.traits.length > 0
              ? customToon.deploymentCard.traits.join(", ")
              : "None"}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        sx={{
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Hero Skills
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" onClick={editHeroSkills}>
            Edit Hero Skills...
          </Button>
          <Typography sx={{ marginTop: ".5rem" }}>
            {customToon.heroSkills.length > 0
              ? customToon.heroSkills.length +
                " Skill" +
                (customToon.heroSkills.length > 1 ? "s" : "") +
                " Added"
              : "None"}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <PriorityTargetDialog />
      <AddHeroSkillDialog />
    </div>
  );
}

CustomToonTab5.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  customToon: PropTypes.object.isRequired,
  updateToon: PropTypes.func.isRequired,
};
