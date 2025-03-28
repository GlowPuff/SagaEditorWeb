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
} from "../data/dataStore";

/**
 * Custom hook for saving mission data to a JSON file or localStorage
 * @param {string} languageID - The language ID for the mission
 * @returns {Object} Object containing functions to trigger the mission export process
 */
const useMissionExporter = (languageID) => {
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

  /**
   * Generates the mission data object
   * @returns {Object} The formatted mission data
   */
  const generateMissionData = () => {
    const date = new Date();

    return {
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
  };

  /**
   * Exports mission data to a JSON file on the client side
   */
  const saveMission = () => {
    const missionData = generateMissionData();
    console.log(
      "🚀 ~ saveMission ~ rootMissionProps.missionGUID:",
      rootMissionProps.missionGUID
    );

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
  };

  /**
   * Saves mission data to localStorage
   * @param {string} key - The key to store the data under (defaults to 'missionData')
   * @returns {boolean} Success status of the operation
   */
  const saveMissionToLocalStorage = (key = "missionData") => {
    try {
      const missionData = generateMissionData();
      localStorage.setItem(key, JSON.stringify(missionData));

      //also save it to the savedMissions array in localStorage in a new key if it doesn't exist, or update it if it does
      const savedMissions =
        JSON.parse(localStorage.getItem("savedMissions")) || [];
      //check if the mission already exists in savedMissions
      const existingMissionIndex = savedMissions.findIndex(
        (mission) => mission.missionGUID === rootMissionProps.missionGUID
      );
      if (existingMissionIndex === -1) {
        savedMissions.push(missionData);
      } else {
        savedMissions[existingMissionIndex] = missionData;
      }
      localStorage.setItem("savedMissions", JSON.stringify(savedMissions));
      return true;
    } catch (error) {
      console.error("Failed to save mission to localStorage:", error);
      return false;
    }
  };

  return { saveMission, saveMissionToLocalStorage };
};

export default useMissionExporter;
