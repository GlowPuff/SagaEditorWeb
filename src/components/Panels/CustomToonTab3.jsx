import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CustomToonTab3({
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

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      <Accordion
        defaultExpanded
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionDetails>
          <Typography>
            Deployment properties are only relevant for Enemy Groups and
            Villains.
          </Typography>
          <Typography sx={{ marginTop: ".5rem" }}>
            Further, these properties are only used by Imperial Commander when
            this Character is Exported as a standalone Character and Imported by
            a player into their game.
          </Typography>
          <Typography sx={{ marginTop: ".5rem" }} className="orange">
            However, if this Character is deployed by an Event in this Mission,
            control the deployment using the Deployment options found in the
            Enemy Group Deployment Event Action, and not the Deployment options
            below.
          </Typography>

          <div className="triple-column-grid mt-p5">
            <FormControlLabel
              control={
                <Checkbox
                  name="canRedeploy"
                  checked={customToon.canRedeploy}
                  onChange={(e) =>
                    changeToonProp(e.target.name, e.target.checked)
                  }
                />
              }
              label="Can Be Redeployed"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="canReinforce"
                  checked={customToon.canReinforce}
                  onChange={(e) =>
                    changeToonProp(e.target.name, e.target.checked)
                  }
                />
              }
              label="Can Be Reinforced"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="canBeDefeated"
                  checked={customToon.canBeDefeated}
                  onChange={(e) =>
                    changeToonProp(e.target.name, e.target.checked)
                  }
                />
              }
              label="Can Be Defeated"
            />
          </div>

          <Typography sx={{ marginTop: ".5rem" }}>
            Groups that cannot Redeploy are removed from the Mission and do not
            return to the Imperial Hand upon defeat, but they can be manually
            deployed again with new options.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

CustomToonTab3.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  customToon: PropTypes.object.isRequired,
  updateToon: PropTypes.func.isRequired,
};
