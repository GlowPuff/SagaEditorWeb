import { useMemo } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

//components
import SetDPDialog from "../Dialogs/SetDPDialog";
//data
import { DeploymentSpot } from "../../lib/core";
import { enemyData, villainData } from "../../data/carddata";
import { useToonsStore } from "../../data/dataStore";
import { CharacterType } from "../../lib/core";

// let groupData = [...enemyData, ...villainData];

export default function EnemyDeploymentTab2({
  eventAction,
  modifyEA,
  selectedTabIndex,
  tabIndex,
}) {
  const toons = useToonsStore((state) => state.customCharacters);

  const groupData = useMemo(() => {
    const baseGroups = [...enemyData, ...villainData];
    const customGroups = toons
      .filter(
        (t) =>
          t.deploymentCard.characterType === CharacterType.Imperial ||
          t.deploymentCard.characterType === CharacterType.Villain
      )
      .map((toon) => toon.deploymentCard);
    return [...baseGroups, ...customGroups];
  }, [toons]);

  function setDPClick() {
    let dpTitle = groupData.find(
      (x) => x.id === eventAction.enemyGroupData.cardID
    );
    SetDPDialog.ShowDialog(
      `${dpTitle.name}: ${dpTitle.id}`,
      eventAction.enemyGroupData.pointList,
      (value) => {
        console.log("🚀 ~ setDPClick ~ value:", value);
        modifyEA("enemyGroupData", {
          ...eventAction.enemyGroupData,
          pointList: value,
        });
      }
    );
  }

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      <Accordion
        defaultExpanded
        sx={{
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary>Deployment Point</AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            sx={{ display: "block" }}
            control={
              <Checkbox
                radioGroup="dp"
                name="deploymentPoint"
                checked={eventAction.deploymentPoint === DeploymentSpot.Active}
                onChange={(e) => {
                  if (e.target.checked)
                    modifyEA(e.target.name, DeploymentSpot.Active);
                }}
              />
            }
            label="Active Deployment Point"
          />
          <FormControlLabel
            control={
              <Checkbox
                radioGroup="dp"
                name="deploymentPoint"
                checked={
                  eventAction.deploymentPoint === DeploymentSpot.Specific
                }
                onChange={(e) => {
                  if (e.target.checked)
                    modifyEA(e.target.name, DeploymentSpot.Specific);
                }}
              />
            }
            label="Specific Deployment Point"
          />

          <Button
            disabled={eventAction.deploymentPoint === DeploymentSpot.Active}
            variant="contained"
            onClick={setDPClick}
          >
            edit deployment point(s)...
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        sx={{
          backgroundColor: "#281b40",
        }}
      >
        <AccordionDetails>
          <div className="two-column-grid">
            <FormControlLabel
              control={
                <Checkbox
                  name="canRedeploy"
                  checked={eventAction.canRedeploy}
                  onChange={(e) => {
                    modifyEA(e.target.name, e.target.checked);
                  }}
                />
              }
              label="Can Be Redeployed"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!eventAction.canRedeploy}
                  name="useResetOnRedeployment"
                  checked={eventAction.useResetOnRedeployment}
                  onChange={(e) => {
                    modifyEA(e.target.name, e.target.checked);
                  }}
                />
              }
              label="Reset on Redeployment"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="canReinforce"
                  checked={eventAction.canReinforce}
                  onChange={(e) => {
                    modifyEA(e.target.name, e.target.checked);
                  }}
                />
              }
              label="Can Be Reinforced"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="canBeDefeated"
                  checked={eventAction.canBeDefeated}
                  onChange={(e) => {
                    modifyEA(e.target.name, e.target.checked);
                  }}
                />
              }
              label="Can Be Defeated"
            />
          </div>

          <Typography
            sx={{
              color: "#ee82e5",
              marginBottom: ".5rem",
            }}
          >
            Groups that cannot Redeploy are removed from the Mission and do not
            return to the Imperial Hand on defeat, but they can be manually
            deployed again with new options.
          </Typography>
          <Typography
            sx={{
              color: "#ee82e5",
            }}
          >
            Groups that Reset on Redeployment are able to redeploy in their
            original card state, removing any customizations made in this Event
            Action. Otherwise, they redeploy with the same customized options.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <SetDPDialog />
    </div>
  );
}

EnemyDeploymentTab2.propTypes = {
  eventAction: PropTypes.object.isRequired,
  modifyEA: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
