import { create } from "zustand";
import { CampaignStructure, CampaignSlot, MissionItem } from "./CampaignData";
import { createGUID } from "../../lib/core";

export const useCampaignState = create((set) => ({
  campaignName: "Default Campaign Name",
  campaignInstructions: "",
  campaignImageFilename: "none.png",
  campaignImageData: null, // Base64 image data
  instructionTranslations: [], //array of TranslationItem
  campaignSlots: [], //array of CampaignSlot
  missionPool: [], //array of MissionPoolItem
  packageGUID: createGUID(),

  resetCampaignState: () =>
    set({
      campaignName: "Default Campaign Name",
      campaignInstructions: "",
      campaignImageFilename: "none.png",
      campaignImageData: null,
      instructionTranslations: [],
      campaignSlots: [],
      missionPool: [],
      packageGUID: createGUID(),
    }),

  setPackageGUID: (guid) => set({ packageGUID: guid }),

  setCampaignName: (name) => set({ campaignName: name }),

  setCampaignInstructions: (instructions) =>
    set({ campaignInstructions: instructions }),

  setCampaignImageFilename: (filename) =>
    set({ campaignImageFilename: filename }),

  //store the image as Base64 data
  setCampaignImageData: (imageData) => set({ campaignImageData: imageData }),

  addInstructionTranslation: (translation) =>
    set((state) => ({
      instructionTranslations: [...state.instructionTranslations, translation],
    })),

  removeInstructionTranslation: (fileName) =>
    set((state) => ({
      instructionTranslations: state.instructionTranslations.filter(
        (translation) => translation.fileName !== fileName
      ),
    })),

  setInstructionTranslations: (translations) => {
    //console.log("Setting instruction translations:", translations);
    set({ instructionTranslations: translations });
  },

  //Campaign Slots
  addCampaignSlot: () =>
    set((state) => ({
      campaignSlots: [...state.campaignSlots, new CampaignSlot()],
    })),

  addCampaignSlotWithStructure: (structure) =>
    set((state) => ({
      campaignSlots: [...state.campaignSlots, structure],
    })),

  removeCampaignSlot: (index) =>
    set((state) => ({
      campaignSlots: state.campaignSlots.filter((_, i) => i !== index),
    })),

  // removeCampaignSlotsBulk: (indices) =>
  //   set((state) => ({
  //     campaignSlots: state.campaignSlots.filter((_, i) => !indices.includes(i)),
  //   })),

  updateSlotStructure: (index, updatedStructure) =>
    set((state) => {
      const newSlots = [...state.campaignSlots];
      newSlots[index].structure = updatedStructure;
      return { campaignSlots: newSlots };
    }),

  updateSlotMissionItem: (index, updatedMissionItem) =>
    set((state) => {
      const newSlots = [...state.campaignSlots];
      newSlots[index].campaignMissionItem = updatedMissionItem;
      newSlots[index].structure.projectItem.Title =
        updatedMissionItem.missionName;
      return { campaignSlots: newSlots };
    }),

  addSlotTranslation: (index, translation) =>
    set((state) => {
      const newSlots = [...state.campaignSlots];
      newSlots[index].translationItems.push(translation);
      return { campaignSlots: newSlots };
    }),

  removeSlotTranslation: (slotIndex, translationFileName) =>
    set((state) => {
      const newSlots = [...state.campaignSlots];
      const slot = newSlots[slotIndex];
      if (slot) {
        slot.translationItems = slot.translationItems.filter(
          (item) => item.fileName !== translationFileName
        );
      }
      return { campaignSlots: newSlots };
    }),

  moveSlotUp: (index) =>
    set((state) => {
      if (index <= 0 || index >= state.campaignSlots.length) return state;
      const newSlots = [...state.campaignSlots];
      [newSlots[index - 1], newSlots[index]] = [
        newSlots[index],
        newSlots[index - 1],
      ];
      return { campaignSlots: newSlots };
    }),

  moveSlotDown: (index) =>
    set((state) => {
      if (index < 0 || index >= state.campaignSlots.length - 1) return state;
      const newSlots = [...state.campaignSlots];
      [newSlots[index + 1], newSlots[index]] = [
        newSlots[index],
        newSlots[index + 1],
      ];
      return { campaignSlots: newSlots };
    }),

  resetCampaignSlot: (index) =>
    set((state) => {
      const newSlots = [...state.campaignSlots];
      if (index !== -1) {
        newSlots[index].structure = new CampaignStructure();
        newSlots[index].translationItems = [];
        newSlots[index].campaignMissionItem = new MissionItem();
      }
      return { campaignSlots: newSlots };
    }),

  resetCampaignSlotsBulk: (indices) =>
    set((state) => {
      const newSlots = [...state.campaignSlots];
      indices.forEach((index) => {
        if (index >= 0 && index < newSlots.length) {
          newSlots[index].structure = new CampaignStructure();
          newSlots[index].translationItems = [];
          newSlots[index].campaignMissionItem = new MissionItem();
        }
      });
      return { campaignSlots: newSlots };
    }),

  // Mission Pool
  addMissionPoolItem: (poolItem) =>
    set((state) => ({
      missionPool: [...state.missionPool, poolItem],
    })),
  removeMissionPoolItem: (missionGUID) =>
    set((state) => ({
      missionPool: state.missionPool.filter(
        (item) => item.missionGUID !== missionGUID
      ),
    })),
  updateMissionPoolItem(index, updatedItem) {
    set((state) => {
      const newPool = [...state.missionPool];
      if (newPool[index]) {
        newPool[index] = { ...newPool[index], ...updatedItem };
      }
      return { missionPool: newPool };
    });
  },
  //translation is TranslationItem
  addPoolTranslation: (index, translation) =>
    set((state) => {
      const newPool = [...state.missionPool];
      if (newPool[index]) {
        newPool[index].translationItems.push(translation);
      }
      return { missionPool: newPool };
    }),
  removePoolTranslation: (missionPoolIndex, translationItem) =>
    set((state) => {
      const newPool = [...state.missionPool];
      console.log("❗ :: set :: newPool::", newPool);
      if (
        newPool[missionPoolIndex] &&
        newPool[missionPoolIndex].missionItem.missionGUID ===
          translationItem.assignedMissionGUID
      ) {
        newPool[missionPoolIndex].translationItems = newPool[
          missionPoolIndex
        ].translationItems.filter(
          (item) => item.fileName !== translationItem.fileName
        );
      } else
        console.warn(
          `Mission Pool Item at index ${missionPoolIndex} does not match the translation's assigned mission GUID (${translationItem.assignedMissionGUID}).`
        );
      return { missionPool: newPool };
    }),
}));
