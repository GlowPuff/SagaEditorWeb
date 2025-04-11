import { useEffect } from "react";
import PropTypes from "prop-types";
//data
import { emptyGUID } from "../../lib/core";
import { useEventsStore, useTriggerStore } from "../../data/dataStore";
//hooks
import useLogger from "../../hooks/useLogger";

export default function TriggerValidator({ dataChanged }) {
  const logger = useLogger();
  let missionEvents = useEventsStore((state) => state.missionEvents); //useEvents();
  const replaceAllEvents = useEventsStore((state) => state.replaceAll);
  let missionTriggers = useTriggerStore((state) => state.missionTriggers);

  //initialize
  useEffect(() => {
    ValidateTriggers();
  });

  function ValidateTriggers() {
    if (!dataChanged) {
      // console.log("SKIPPING VALIDATION");
      return;
    }

    logger.debug("***VALIDATING***");
    // console.log("🚀 ~ TriggerValidator ~ missionEvents:", missionEvents);

    let dirty = false;
    let removedTriggers = [];
    if (missionTriggers.length === 0) return;

    let mEvents = missionEvents; //???
    //array of existing trigger GUIDs
    let triggerGUIDs = missionTriggers.map((item) => item.GUID);

    //EVENTS - ADDITIONAL TRIGGERS
    mEvents.forEach((mEvent) => {
      //skip None Event
      if (mEvent.GUID === emptyGUID) return;
      // console.log(
      //   `Found ${mEvent.additionalTriggers.length} Additional Triggers in ${mEvent.name}`
      // );
      mEvent.additionalTriggers = mEvent.additionalTriggers
        .map((item, index) => {
          if (triggerGUIDs.includes(item.triggerGUID)) {
            //update name
            if (item.triggerName !== missionTriggers[index].name) {
              dirty = true;
              item.triggerName = missionTriggers[index].name;
            }
            return item;
          } else {
            let t = missionTriggers.find((x) => x.GUID === item.GUID);
            dirty = true;
            if (t) {
              removedTriggers.push(
                `${mEvent.name}: Trigger '${t.name}' no longer exists, removing from Event's Additional Triggers`
              );
            } else {
              logger.error(
                `Error removing Trigger. Trigger with GUID [${item.GUID}] not found in the Mission`
              );
              removedTriggers.push(
                `${mEvent.name}: Trigger '${item.GUID}' no longer exists, removing from Event's Additional Triggers`
              );
            }
            return;
          }
        })
        .filter((notUndefined) => notUndefined !== undefined);
    });

    //console.log("🚀 ~ mEvents.forEach:", mEvents);

    //INITIAL GROUPS - DEFEATED TRIGGER

    //EAs
    // G3, G4, G9, G11

    //MAP ENTITIES

    //update the store
    if (dirty) {
      //eventDispatch({ command: "replaceAll", replacements: mEvents });
      replaceAllEvents(mEvents);
      //report
      logger.debug("removedTriggers:", removedTriggers);
    }
  }

  TriggerValidator.validate = ValidateTriggers;
}

TriggerValidator.propTypes = {
  dataChanged: PropTypes.bool,
};
