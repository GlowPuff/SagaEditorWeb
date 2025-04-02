import { create } from "zustand";
//data
import {
  startSection,
  MapSection,
  emptyEvent,
  emptyTrigger,
  MissionProperties,
} from "./Mission";
import {
  createGUID,
  calculateEntityPosition,
} from "../lib/core";

export const useRootMissionPropsStore = create((set) => ({
  missionProps: { missionGUID: createGUID() },
  updateMissionProp: (propName, value) =>
    set((state) => ({
      missionProps: { ...state.missionProps, [propName]: value },
    })),
}));

export const useMissionPropertiesStore = create((set) => ({
  missionProperties: new MissionProperties(),
  importMission: (mission) =>
    set(() => ({ missionProperties: mission.missionProperties })),
  updateMissionProp: (propName, value) =>
    set((state) => ({
      missionProperties: { ...state.missionProperties, [propName]: value },
    })),
}));

export const useInitialGroupsStore = create((set) => ({
  initialGroups: [],
  importMission: (mission) =>
    set(() => ({ initialGroups: mission.initialDeploymentGroups })),
  addGroup: (group) =>
    set((state) => ({ initialGroups: [...state.initialGroups, group] })),
  modifyGroup: (groupIndex, group) =>
    set((state) => {
      return {
        initialGroups: state.initialGroups.map((item, index) => {
          if (index === groupIndex) item = group;
          return item;
        }),
      };
    }),
  removeGroup: (index) =>
    set((state) => ({
      initialGroups: state.initialGroups.filter((x, idx) => index !== idx),
    })),
}));

export const useReservedGroupsStore = create((set) => ({
  reservedGroups: [],
  importMission: (mission) =>
    set(() => ({ reservedGroups: mission.reservedDeploymentGroups })),
  addGroup: (group) =>
    set((state) => ({ reservedGroups: [...state.reservedGroups, group] })),
  removeGroup: (index) =>
    set((state) => ({
      reservedGroups: state.reservedGroups.filter((x, idx) => index !== idx),
    })),
}));

export const useEventGroupStore = create((set) => ({
  eventGroups: [],
  selectedEventGroup: "",
  importMission: (mission) =>
    set(() => ({ selectedEventGroup: "", eventGroups: mission.eventGroups })),
  setSelectedEventGroup: (group) =>
    set((state) => ({
      selectedEventGroup: state.eventGroups.find((x) => x.GUID === group.GUID),
    })),
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
  selectedEntityGroup: "",
  importMission: (mission) =>
    set(() => ({
      selectedEntityGroup: "",
      entityGroups: mission.entityGroups,
    })),
  setSelectedEntityGroup: (group) =>
    set((state) => ({
      selectedEntityGroup: state.entityGroups.find(
        (x) => x.GUID === group.GUID
      ),
    })),
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
  activeMapSectionGUID: startSection.GUID,
  importMission: (mission) =>
    set(() => ({
      mapSections: mission.mapSections,
      activeMapSectionGUID: startSection.GUID,
    })),
  setActiveMapSectionGUID: (guid) =>
    set(() => ({ activeMapSectionGUID: guid })),
  //adds a pre-constructed section to the mapSections array, sets it as active
  addExistingSection: (section) =>
    set((state) => {
      return {
        activeMapSectionGUID: section.GUID,
        mapSections: [...state.mapSections, section],
      };
    }),
  //constructs a new section and adds it to the mapSections array, sets it as active
  addSection: (name) =>
    set((state) => {
      var s = new MapSection();
      s.name = name;
      // s.GUID = createGUID();
      return {
        activeMapSectionGUID: s.GUID,
        mapSections: [...state.mapSections, s],
      };
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
  addTileToActiveSection: (tile) =>
    set((state) => {
      return {
        mapSections: state.mapSections.map((item) => {
          if (item.GUID === state.activeMapSectionGUID) {
            tile.mapSectionOwner = state.activeMapSectionGUID;
            item.mapTiles.push(tile);
          }
          return item;
        }),
      };
    }),
  updateTileEntity: (tile) =>
    set((state) => {
      return {
        mapSections: state.mapSections.map((section) => {
          section.mapTiles = section.mapTiles.map((item) => {
            if (item.GUID === tile.GUID) {
              return tile;
            } else return item;
          });
          return section;
        }),
      };
    }),
  removeTileFromActiveSection: (tile) =>
    set((state) => {
      return {
        mapSections: state.mapSections.map((section) => {
          if (section.GUID === state.activeMapSectionGUID) {
            section.mapTiles = section.mapTiles.filter(
              (x) => x.GUID !== tile.GUID
            );
          }
          return section;
        }),
      };
    }),
  //regardless of active section
  removeTile: (tile) =>
    set((state) => {
      return {
        mapSections: state.mapSections.map((section) => {
          section.mapTiles = section.mapTiles.filter(
            (x) => x.GUID !== tile.GUID
          );
          return section;
        }),
      };
    }),
  changeTileOwnerBulk: (oldGuid, newSectionGUID) =>
    set((state) => {
      //first get a flattened list of all tiles across all sections that match the guid
      let tilesToMove = [];
      state.mapSections.forEach((section) => {
        section.mapTiles.forEach((tile) => {
          if (tile.mapSectionOwner === oldGuid) {
            tilesToMove.push(tile);
          }
        });
      });
      //then update the owner of those tiles to the new section
      return {
        mapSections: state.mapSections.map((section) => {
          if (section.GUID === newSectionGUID) {
            //add the tiles to the new section
            tilesToMove.forEach((tile) => {
              tile.mapSectionOwner = newSectionGUID;
              section.mapTiles.push(tile);
            });
          } else {
            //remove the tiles from their original sections
            //not really necessary since they are removed with the section
            section.mapTiles = section.mapTiles.filter(
              (x) => !tilesToMove.includes(x)
            );
          }
          return section;
        }),
      };
    }),
  rotateTile: (guid, direction, drawPosition) =>
    set((state) => {
      return {
        mapSections: state.mapSections.map((section) => {
          section.mapTiles = section.mapTiles.map((tile) => {
            if (tile.GUID === guid) {
              tile.entityRotation =
                (tile.entityRotation + 90 * direction) % 360;
              if (tile.entityRotation < 0) {
                tile.entityRotation += 360;
              }
              //calculate new position based on rotation
              const newPosition = calculateEntityPosition(tile, drawPosition);
              //snap the position to the grid
              newPosition.x = Math.round(newPosition.x / 10) * 10;
              newPosition.y = Math.round(newPosition.y / 10) * 10;
              tile.entityPosition = `${newPosition.x},${newPosition.y}`;
            }
            return tile;
          });
          return section;
        }),
      };
    }),
  updateTilePosition: (
    guid,
    position //position is a string "x,y"
  ) =>
    set((state) => {
      return {
        mapSections: state.mapSections.map((section) => {
          section.mapTiles = section.mapTiles.map((tile) => {
            if (tile.GUID === guid) {
              //snap the position to the grid
              const [x, y] = position.split(",");
              let newPosition = {
                x: parseFloat(x),
                y: parseFloat(y),
              };
              newPosition.x = Math.floor(newPosition.x / 10) * 10;
              newPosition.y = Math.floor(newPosition.y / 10) * 10;
              newPosition = `${newPosition.x},${newPosition.y}`;
              tile.entityPosition = newPosition;
            }
            return tile;
          });
          return section;
        }),
      };
    }),
}));

export const useEventsStore = create((set) => ({
  missionEvents: [emptyEvent],
  refreshToken: 0,
  importMission: (mission) =>
    set((state) => ({
      missionEvents:
        mission.globalEvents.length === 1 ? [emptyEvent] : mission.globalEvents,
      refreshToken: ++state.refreshToken,
    })),
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
  importMission: (mission) =>
    set((state) => ({
      missionTriggers:
        mission.globalTriggers.length === 1
          ? [emptyTrigger]
          : mission.globalTriggers,
      refreshToken: ++state.refreshToken,
    })),
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
  importMission: (mission) => set(() => ({ mapEntities: mission.mapEntities })),
  addEntity: (newState) =>
    set((state) => ({ mapEntities: [...state.mapEntities, newState] })),
  updateEntity: (entity) =>
    set((state) => ({
      mapEntities: state.mapEntities.map((item) => {
        if (item.GUID === entity.GUID) {
          return entity;
        } else return item;
      }),
    })),
  removeEntity: (guid) =>
    set((state) => ({
      mapEntities: state.mapEntities.filter((x) => x.GUID !== guid),
    })),
  removeEntitiesBulk: (guids) =>
    set((state) => ({
      mapEntities: state.mapEntities.filter((x) => !guids.includes(x.GUID)),
    })),
  updateEntityPosition: (
    guid,
    position //position is a string "x,y"
  ) =>
    set((state) => ({
      mapEntities: state.mapEntities.map((item) => {
        if (item.GUID === guid) {
          //snap the position to the grid
          const [x, y] = position.split(",");
          let newPosition = {
            x: parseFloat(x),
            y: parseFloat(y),
          };
          newPosition.x = Math.floor(newPosition.x / 10) * 10;
          newPosition.y = Math.floor(newPosition.y / 10) * 10;
          newPosition = `${newPosition.x},${newPosition.y}`;

          item.entityPosition = newPosition;
          return item;
        } else return item;
      }),
    })),
  rotateEntity: (guid, direction, drawPosition) =>
    set((state) => ({
      mapEntities: state.mapEntities.map((item) => {
        if (item.GUID === guid) {
          item.entityRotation = (item.entityRotation + 90 * direction) % 360;
          if (item.entityRotation < 0) {
            item.entityRotation += 360;
          }
          //calculate new position based on rotation
          const newPosition = calculateEntityPosition(item, drawPosition);
          //snap the position to the grid
          newPosition.x = Math.round(newPosition.x / 10) * 10;
          newPosition.y = Math.round(newPosition.y / 10) * 10;
          item.entityPosition = `${newPosition.x},${newPosition.y}`;
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
  importMission: (mission) =>
    set(() => ({ customCharacters: mission.customCharacters })),
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
