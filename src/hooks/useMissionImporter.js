import {
  useMissionPropertiesStore,
  useInitialGroupsStore,
  useReservedGroupsStore,
  useEventGroupStore,
  useEntityGroupStore,
  useMapSectionsStore,
  useEventsStore,
  useTriggerStore,
  useMapEntitiesStore,
  useToonsStore,
  useRootMissionPropsStore,
} from "../data/dataStore";

/**
 * Custom hook for loading mission data from a JSON file or localStorage
 * @param {Function} onClearData - Function to clear existing data before loading new mission
 * @returns {Object} Object containing loadMission and loadMissionFromLocalStorage functions
 */
const useMissionImporter = (onClearData) => {
  // Get state update methods from stores
  const updateRootMissionProp = useRootMissionPropsStore(
    (state) => state.updateMissionProp
  );
  const importMissionProps = useMissionPropertiesStore(
    (state) => state.importMission
  );
  const importInitialGroups = useInitialGroupsStore(
    (state) => state.importMission
  );
  const importReservedGroups = useReservedGroupsStore(
    (state) => state.importMission
  );
  const importEventGroups = useEventGroupStore((state) => state.importMission);
  const importEntityGroups = useEntityGroupStore(
    (state) => state.importMission
  );
  const importMapSections = useMapSectionsStore((state) => state.importMission);
  const importEvents = useEventsStore((state) => state.importMission);
  const importTriggers = useTriggerStore((state) => state.importMission);
  const importMapEntities = useMapEntitiesStore((state) => state.importMission);
  const importCustomToons = useToonsStore((state) => state.importMission);

  /**
   * Processes the imported mission data and updates all stores
   * @param {Object} importedMission - The parsed mission data
   */
  const processMissionData = (importedMission) => {
    if (onClearData) {
      onClearData();
    }

    importMissionProps(importedMission);
    importInitialGroups(importedMission);
    importReservedGroups(importedMission);
    importEventGroups(importedMission);
    importEntityGroups(importedMission);
    importMapSections(importedMission);
    importEvents(importedMission);
    importTriggers(importedMission);
    importMapEntities(importedMission);
    importCustomToons(importedMission);
    updateRootMissionProp("missionGUID", importedMission.missionGUID);
  };

  /**
   * Opens file dialog and loads mission data from selected JSON file
   */
  const loadMission = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const importedMission = JSON.parse(content);
          console.log(importedMission);
          processMissionData(importedMission);
          //send a global event to notify that the mission has been loaded
          const event = new CustomEvent("missionLoaded");
          window.dispatchEvent(event);
        };
        reader.readAsText(file);
      }
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  /**
   * Loads mission data from localStorage
   * @param {string} key - The localStorage key to retrieve mission data from
   * @returns {boolean} - Whether the mission was successfully loaded
   */
  const loadMissionFromLocalStorage = (key) => {
    try {
      const storedData = localStorage.getItem(key);
      if (!storedData) {
        console.error(`No mission data found in localStorage with key: ${key}`);
        return false;
      }

      const importedMission = JSON.parse(storedData);
      console.log("Loaded mission from localStorage:", importedMission);
      processMissionData(importedMission);
      //send a global event to notify that the mission has been loaded
      const event = new CustomEvent("missionLoaded");
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error("Error loading mission from localStorage:", error);
      return false;
    }
  };

  const loadMissionFromLocalStorageArray = (key) => {
    try {
      const savedMissions =
        JSON.parse(localStorage.getItem("savedMissions")) || [];
      // Check if the key exists in savedMissions first
      if (savedMissions.length > 0) {
        // If the key doesn't exist, use the first mission from savedMissions
        const mission = savedMissions.find(
          (mission) => mission.missionGUID === key
        );
        if (mission) {
          console.log("Using saved mission:", mission);
          processMissionData(mission);
          //send a global event to notify that the mission has been loaded
          const event = new CustomEvent("missionLoaded");
          window.dispatchEvent(event);
          return true;
        } else {
          console.error(`No mission found with GUID: ${key}`);
          return false;
        }
      } else {
        console.error("No saved missions found.");
        return false;
      }
    } catch (error) {
      console.error("Error loading mission from localStorage:", error);
      return false;
    }
  };

  return {
    loadMission,
    loadMissionFromLocalStorage,
    loadMissionFromLocalStorageArray,
  };
};

export default useMissionImporter;
