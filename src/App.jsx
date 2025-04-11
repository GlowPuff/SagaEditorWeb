import { useState, useRef, useEffect } from "react";
import "./App.css";

//my components
import AppBar from "./components/AppBar";
import Footer from "./components/Footer";
import TabBar from "./components/TabBar";
import LeftPanel from "./components/LeftPanel";
//panels
import MissionPanel from "./components/Panels/MissionPanel";
import SectionsPanel from "./components/Panels/SectionsPanel";
import MapEditorPanel from "./components/Panels/MapEditorPanel";
import EnemyGroupPanel from "./components/Panels/EnemyGroupPanel";
import PropertiesPanel from "./components/Panels/PropertiesPanel";
import CustomToonPanel from "./components/Panels/CustomToonPanel";
//dialogs
import GenericTextDialog from "./components/Dialogs/GenericTextDialog";
import QuickAddDialog from "./components/Dialogs/QuickAddDialog";
//data
import {
  useMissionPropertiesStore,
  useInitialGroupsStore,
} from "./data/dataStore";

export default function App() {
  //Mission data
  const missionProps = useMissionPropertiesStore(
    (state) => state.missionProperties
  );
  const updateMissionProp = useMissionPropertiesStore(
    (state) => state.updateMissionProp
  );
  const initialGroups = useInitialGroupsStore((state) => state.initialGroups);
  const addInitialGroup = useInitialGroupsStore((state) => state.addGroup);
  const removeInitialGroup = useInitialGroupsStore(
    (state) => state.removeGroup
  );
  const modifyInitialGroup = useInitialGroupsStore(
    (state) => state.modifyGroup
  );
  //everything else
  const [languageID, setlanguageID] = useState("English (EN)");
  const [tabIndex, setTabIndex] = useState(0);
  //refs
  const mapPanelRef = useRef(null);
  const leftPanelRef = useRef(null);

  //subscribe to an event to set the tab index to the first tab
  useEffect(() => {
    let abortController = new AbortController();

    window.addEventListener("missionLoaded", () => setTabIndex(0), {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, []);

  function onSetMissionProps(name, value) {
    updateMissionProp(name, value);
  }

  function onModifyEnemyGroups(action) {
    if (action.type === "initial") {
      if (action.command === "add") {
        if (
          initialGroups.findIndex(
            (item) => item.cardID === action.group.cardID
          ) === -1
        )
          addInitialGroup(action.group);
      } else if (action.command === "remove") {
        removeInitialGroup(action.index);
      } else if (action.command === "edit") {
        modifyInitialGroup(action.index, action.group);
      }
    }
  }

  function clearMap() {
    if (mapPanelRef.current) {
      mapPanelRef.current.clearMap();
    }
    if (leftPanelRef.current) {
      leftPanelRef.current.resetData();
    }
  }

  return (
    <>
      <div className="surface-layout">
        {/* menu */}
        <AppBar languageID={languageID} onClearMap={clearMap} />

        {/* left panel */}
        <LeftPanel ref={leftPanelRef} />

        {/* main content */}
        <div className="display-area">
          <TabBar
            tabIndex={tabIndex}
            onTabChange={(index) => setTabIndex(index)}
          />
          <div className="display-panel">
            {tabIndex === 0 && (
              <MissionPanel
                missionProps={missionProps}
                onSetProps={(name, text) => onSetMissionProps(name, text)}
                value={tabIndex}
                index={0}
              />
            )}
            {tabIndex === 1 && <SectionsPanel value={tabIndex} index={1} />}
            {tabIndex === 2 && (
              <MapEditorPanel ref={mapPanelRef} value={tabIndex} index={2} />
            )}
            {tabIndex === 3 && (
              <EnemyGroupPanel
                value={tabIndex}
                index={3}
                initialGroups={initialGroups}
                onModifyEnemyGroups={onModifyEnemyGroups}
              />
            )}
            {tabIndex === 4 && (
              <PropertiesPanel
                value={tabIndex}
                index={4}
                setPropValue={onSetMissionProps}
                missionProps={missionProps}
              />
            )}
            {tabIndex === 5 && <CustomToonPanel value={tabIndex} index={5} />}
          </div>
        </div>

        {/* footer */}
        <Footer
          languageID={languageID}
          onSetLanguage={(lang) => setlanguageID(lang)}
        />
      </div>

      <GenericTextDialog />
      <QuickAddDialog />
    </>
  );
}
