import PropTypes from "prop-types";
//mui
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
//icons
import SaveIcon from "@mui/icons-material/Save";
//data
import {
  useRootMissionPropsStore,
  useMissionPropertiesStore,
  useMapSectionsStore,
  useTriggerStore,
  useEventsStore,
  useMapEntitiesStore,
  useInitialGroupsStore,
  useReservedGroupsStore,
  useEventGroupStore,
  useEntityGroupStore,
  useToonsStore,
} from "../../data/dataStore";

const MissionSaveButton = ({ languageID }) => {
  //data stores
  const rootMissionProps = useRootMissionPropsStore(
    (state) => state.missionProps
  );
  const missionProps = useMissionPropertiesStore(
    (state) => state.missionProperties
  );
  const mapSections = useMapSectionsStore((state) => state.mapSections);
  const triggers = useTriggerStore((state) => state.missionTriggers);
  const events = useEventsStore((state) => state.missionEvents);
  const mapEntities = useMapEntitiesStore((state) => state.mapEntities);
  const initialGroups = useInitialGroupsStore((state) => state.initialGroups);
  const reservedGroups = useReservedGroupsStore(
    (state) => state.reservedGroups
  );
  const eventGroups = useEventGroupStore((state) => state.eventGroups);
  const entityGroups = useEntityGroupStore((state) => state.entityGroups);
  const customCharacters = useToonsStore((state) => state.customCharacters);

  //export mission data to a JSON file on the client side
  function onSave() {
    const date = new Date();

    let missionData = {
      missionGUID: rootMissionProps.missionGUID,
      fileName: "mission.json",
      fileVersion: "22",
      saveDate: `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`,
      timeTicks: date.getTime(),
      languageID: languageID,
      missionProperties: missionProps,
      mapSections: mapSections,
      globalTriggers: triggers,
      globalEvents: events,
      mapEntities: mapEntities,
      initialDeploymentGroups: initialGroups,
      reservedDeploymentGroups: reservedGroups,
      eventGroups: eventGroups,
      entityGroups: entityGroups,
      customCharacters: customCharacters,
    };
    console.log("🚀 ~ onSave ~ rootMissionProps.missionGUID:", rootMissionProps.missionGUID)

    //format the json in a human readable way
    const missionDataStr = JSON.stringify(missionData, null, 2);

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(missionDataStr)
    );
    element.setAttribute("download", "mission.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <Tooltip title="Export the Mission">
      <Button variant="contained" onClick={onSave} startIcon={<SaveIcon />}>
        Export...
      </Button>
    </Tooltip>
  );
};

export default MissionSaveButton;

MissionSaveButton.propTypes = {
  languageID: PropTypes.string.isRequired,
};
