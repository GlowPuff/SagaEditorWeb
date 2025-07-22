import { create } from "zustand";

export const useRawCampaignDataState = create((set) => ({
  translations: [], //array of RawTranslationData (TODO make into Instruction translations ONLY)
  translationIDs: [], //TODO: remove
  importedMissions: [], //array of actual mission JSON data
  missionGUIDs: [], //array of mission GUIDs for quick access, TODO: remove

  resetRawCampaignData: () =>
    set({
      translations: [],
      translationIDs: [],
      importedMissions: [],
      missionGUIDs: [],
    }),

  //data is RawTranslationData (TODO make this for translated campaign Instructions only)
  addTranslationData: (data) =>
    set((state) => {
      // Check if data with the same identifier already exists
      const exists = state.translations.some(
        (translation) => translation.identifier === data.identifier
      );
      if (exists) {
        // console.warn(
        //   "Translation data with this identifier already exists:",
        //   data.identifier
        // );
        return state; // Return unchanged state
      }

      //console.info("Adding translation data:", data);

      return {
        translations: [...state.translations, data],
        translationIDs: [...state.translationIDs, data.identifier],
      };
    }),

  removeTranslationData: (id) =>
    set((state) => ({
      translations: state.translations.filter((data) => data.identifier !== id),
      translationIDs: state.translationIDs.filter(
        (translationID) => translationID !== id
      ),
    })),

  //array of TranslationItem
  removeTranslationDataBulk: (translationItems) =>
    set((state) => {
      //filter out translations whose 'identifier' property = translationItems 'fileName' property
      const translationFileNames = translationItems.map(
        (item) => item.fileName
      );
      return {
        translations: state.translations.filter(
          (data) => !translationFileNames.includes(data.identifier)
        ),
        translationIDs: state.translationIDs.filter(
          (id) => !translationFileNames.includes(id)
        ),
      };
    }),

  resetTranslationData: () => set({ translations: [], translationIDs: [] }),

  addImportedMission: (mission) =>
    set((state) => ({
      importedMissions: [...state.importedMissions, mission],
      missionGUIDs: [...state.missionGUIDs, mission.missionGUID],
    })),

  replaceImportedMission: (mission) =>
    set((state) => {
      const existingIndex = state.importedMissions.findIndex(
        (m) => m.missionGUID === mission.missionGUID
      );
      if (existingIndex !== -1) {
        const newMissions = [...state.importedMissions];
        newMissions[existingIndex] = mission;
        return { importedMissions: newMissions };
      }
      return state; // Return unchanged state if not found
    }),

  removeImportedMission: (missionGUID) =>
    set((state) => ({
      importedMissions: state.importedMissions.filter(
        (m) => m.missionGUID !== missionGUID
      ),
      missionGUIDs: state.missionGUIDs.filter((id) => id !== missionGUID),
    })),

  updateImportedMissionNextEventAction: (missionGUID, eventGUID, updatedEA) =>
    set((state) => {
      const missionIndex = state.importedMissions.findIndex(
        (m) => m.missionGUID === missionGUID
      );

      if (missionIndex !== -1) {
        // console.log("Updating mission event action:", updatedEA);
        const updatedMissions = [...state.importedMissions];
        const mission = updatedMissions[missionIndex];
        const missionEvent = mission.globalEvents.findIndex(
          (event) => event.GUID === eventGUID
        );
        if (missionEvent !== -1) {
          // console.log("Found mission event:", missionEvent);
          const missionEA = mission.globalEvents[
            missionEvent
          ].eventActions.findIndex((action) => action.GUID === updatedEA.GUID);
          if (missionEA !== -1) {
            // console.log("Found mission event action:", missionEA);
            updatedMissions[missionIndex].globalEvents[
              missionEvent
            ].eventActions[missionEA] = updatedEA;
          }
        }
        return { importedMissions: updatedMissions };
      }
      return state; // Return unchanged state if not found
    }),
}));
