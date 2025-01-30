//mui
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
//icons
import FileOpenIcon from "@mui/icons-material/FileOpen";
//store
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
} from "../../data/dataStore";

const MissionLoadButton = () => {
  //set state methods
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

  function onLoad() {
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
        };
        reader.readAsText(file);
      }
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  return (
    <Tooltip title="Import a Mission">
      <Button
        sx={{ marginLeft: "auto" }}
        variant="contained"
        onClick={onLoad}
        startIcon={<FileOpenIcon />}
      >
        Import...
      </Button>
    </Tooltip>
  );
};

export default MissionLoadButton;
