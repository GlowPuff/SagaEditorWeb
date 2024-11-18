import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
//components
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";
import EventSelectAdd from "../SubComponents/EventSelectAdd";

export default function EnemyDeploymentTab4({
  eventAction,
  modifyEA,
  selectedTabIndex,
  tabIndex,
}) {
  function changeTrigger(trigger) {
    modifyEA("enemyGroupData", {
      ...eventAction.enemyGroupData,
      defeatedTrigger: trigger.GUID,
    });
  }

  function changeEvent(event) {
    modifyEA("enemyGroupData", {
      ...eventAction.enemyGroupData,
      defeatedEvent: event.GUID,
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
        <AccordionSummary>On Defeated, Fire This Trigger...</AccordionSummary>
        <AccordionDetails>
          <TriggerSelectAdd
            initialGUID={eventAction.enemyGroupData.defeatedTrigger}
            onItemChanged={(e) => changeTrigger(e)}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        sx={{
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary>On Defeated, Fire This Event...</AccordionSummary>
        <AccordionDetails>
          <EventSelectAdd
            initialGUID={eventAction.enemyGroupData.defeatedEvent}
            onItemChanged={(e) => changeEvent(e)}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

EnemyDeploymentTab4.propTypes = {
  eventAction: PropTypes.object.isRequired,
  modifyEA: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
