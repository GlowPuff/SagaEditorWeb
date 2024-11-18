import { create } from "zustand";
//data
import { startSection, MapSection, emptyEvent, emptyTrigger } from "./Mission";
import { createGUID } from "../lib/core";

export const useReservedGroupsStore = create((set) => ({
  reservedGroups: [],
  addGroup: (group) =>
    set((state) => ({ reservedGroups: [...state.reservedGroups, group] })),
  removeGroup: (index) =>
    set((state) => ({
      reservedGroups: state.reservedGroups.filter((x, idx) => index !== idx),
    })),
}));

export const useEventGroupStore = create((set) => ({
  eventGroups: [],
  addGroup: (group) =>
    set((state) => ({ eventGroups: [...state.eventGroups, group] })),
  updateGroup: (group) =>
    set((state) => ({
      eventGroups: state.eventGroups.map((item) => {
        if (item.GUID === group.GUID) return group;
        return item;
      }),
    })),
  removeGroup: (group) =>
    set((state) => ({
      eventGroups: state.eventGroups.filter((x) => x.GUID !== group.GUID),
    })),
}));

export const useEntityGroupStore = create((set) => ({
  entityGroups: [],
  addGroup: (group) =>
    set((state) => ({ entityGroups: [...state.entityGroups, group] })),
  updateGroup: (group) =>
    set((state) => ({
      entityGroups: state.entityGroups.map((item) => {
        if (item.GUID === group.GUID) return group;
        return item;
      }),
    })),
  removeGroup: (group) =>
    set((state) => ({
      entityGroups: state.entityGroups.filter((x) => x.GUID !== group.GUID),
    })),
}));

export const useMapSectionsStore = create((set) => ({
  mapSections: [startSection],
  activeMapSection: startSection,
  setActiveMapSection: (section) => set(() => ({ activeMapSection: section })),
  addExistingSection: (section) =>
    set((state) => {
      return { mapSections: [...state.mapSections, section] };
    }),
  addSection: (name) =>
    set((state) => {
      var s = new MapSection();
      s.name = name;
      s.GUID = createGUID();
      console.log("🚀 ~ set ~ [...state.mapSections, s]:", [
        ...state.mapSections,
        s,
      ]);
      return { mapSections: [...state.mapSections, s] };
    }),
  modifySection: (action) =>
    set((state) => {
      return {
        mapSections: state.mapSections.map((item) => {
          if (item.GUID == action.GUID)
            return { ...item, [action.prop]: action.value };
          else return item;
        }),
      };
    }),
  removeSection: (guid) =>
    set((state) => ({
      mapSections: state.mapSections.filter((item) => item.GUID !== guid),
    })),
}));

export const useEventsStore = create((set) => ({
  missionEvents: [emptyEvent],
  refreshToken: 0,
  addEvent: (item) =>
    set((state) => ({
      missionEvents: [...state.missionEvents, item],
    })),
  updateEvent: (mEvent) => {
    set((state) => ({ refreshToken: ++state.refreshToken }));
    set((state) => ({
      missionEvents: state.missionEvents.map((item) => {
        if (item.GUID === mEvent.GUID) return mEvent;
        else return item;
      }),
    }));
  },
  removeEvent: (guid) => {
    set((state) => ({ refreshToken: ++state.refreshToken }));
    set((state) => ({
      missionEvents: state.missionEvents.filter((x) => x.GUID !== guid),
    }));
  },
  duplicateEvent: (original) =>
    set((state) => {
      let dupe = JSON.parse(JSON.stringify(original));
      dupe.name += " (Copy)";
      dupe.GUID = createGUID();
      return { missionEvents: [...state.missionEvents, dupe] };
    }),
  moveUp: (index) =>
    set((state) => {
      let tempEvents = [...state.missionEvents];
      let toMove = tempEvents[index];
      tempEvents[index] = tempEvents[index - 1];
      tempEvents[index - 1] = toMove;
      return { missionEvents: tempEvents };
    }),
  moveDown: (index) =>
    set((state) => {
      let tempEvents = [...state.missionEvents];
      let toMove = tempEvents[index];
      tempEvents[index] = tempEvents[index + 1];
      tempEvents[index + 1] = toMove;
      return { missionEvents: tempEvents };
    }),
  replaceAll: (replacements) => {
    set((state) => ({ refreshToken: ++state.refreshToken }));
    set(() => ({ missionEvents: replacements }));
  },
  clearAll: () => set(() => ({ missionEvents: [] })),
}));

export const useTriggerStore = create((set) => ({
  missionTriggers: [emptyTrigger],
  refreshToken: 0,
  addTrigger: (trigger) =>
    set((state) => ({ missionTriggers: [...state.missionTriggers, trigger] })),
  updateTrigger: (trigger) => {
    set((state) => ({ refreshToken: ++state.refreshToken }));
    set((state) => ({
      missionTriggers: state.missionTriggers.map((item) => {
        if (item.GUID === trigger.GUID) return trigger;
        else return item;
      }),
    }));
  },
  removeTrigger: (guid) =>
    set((state) => ({
      missionTriggers: state.missionTriggers.filter((x) => x.GUID !== guid),
    })),
}));

export const useMapEntitiesStore = create((set) => ({
  mapEntities: [],
  addEntity: (entity) =>
    set((state) => ({ mapEntities: [...state.mapEntities, entity] })),
  updateEntity: (entity) =>
    set((state) => ({
      mapEntities: state.mapEntities.map((item) => {
        if (item.GUID === entity.GUID) {
          console.log(
            "🚀 ~ UPDATED mapEntities:state.mapEntities.map ~ entity:",
            entity
          );
          return entity;
        } else return item;
      }),
    })),
  removeEntity: (guid) =>
    set((state) => ({
      mapEntities: state.mapEntities.filter((x) => x.GUID !== guid),
    })),
  updateEntityPosition: (
    guid,
    position //position is a string "x,y"
  ) =>
    set((state) => ({
      mapEntities: state.mapEntities.map((item) => {
        if (item.GUID === guid) {
          item.entityPosition = position;
          return item;
        } else return item;
      }),
    })),
  getEntityByGUID: (guid) => {
    let entity = null;
    set((state) => {
      entity = state.mapEntities.find((x) => x.GUID === guid);
    });
    return entity;
  },
}));

export const useToonsStore = create((set) => ({
  customCharacters: [],
  addToon: (toon) =>
    set((state) => ({ customCharacters: [...state.customCharacters, toon] })),
  updateToon: (toon) =>
    set((state) => ({
      customCharacters: state.customCharacters.map((item) => {
        if (item.cardID === toon.cardID) return toon;
        else return item;
      }),
    })),
  removeToon: (guid) =>
    set((state) => ({
      customCharacters: state.customCharacters.filter(
        (x) => x.customCharacterGUID !== guid
      ),
    })),
}));

// export const useEntityShapeStore = create((set) => ({
//   shapes: [], //maybe use a map instead of an array, GUID -> shape
//   setSelected: (guid, isSelected) =>
//     set((state) => ({
//       shapes: state.shapes.map((item) => {
//         if (item.entityGUID === guid) {
//           item.isSelected = isSelected;
//           console.log("🚀 ~ set ~ item SELECTED:", item);
//         }
//         return item;
//       }),
//     })),
//   unselectAll: () =>
//     set((state) => ({
//       shapes: state.shapes.map((item) => {
// 				item.isSelected = false;
//         return item;
//       }),
//     })),
//   addCrate: (entity) => {
//     //entity is a CrateEntity
//     const [x, y] = entity.entityPosition.split(",");
//     const position = { x: parseFloat(x), y: parseFloat(y) };
//     const shape = {
//       type: "crate",
//       dimensions: { width: 10, height: 10 },
//       position: position,
//       rotation: entity.entityRotation,
//       fill: entity.entityProperties.entityColor,
//       stroke: "black",
//       entityGUID: entity.GUID,
//       isSelected: false,
//       boundingRect: {
//         x: position.x,
//         y: position.y,
//         width: 10,
//         height: 10,
//         left: position.x,
//         top: position.y,
//         right: position.x + 10,
//         bottom: position.y + 10,
//       },
//     };
//     set((state) => ({ shapes: [...state.shapes, shape] }));
//   },
// }));
