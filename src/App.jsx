import { useState } from "react";
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
//Mission data
import * as Mission from "./data/Mission";

export default function App() {
  //Mission data
  const [missionProps, setMissionProps] = useState(
    new Mission.MissionProperties()
  );
  const [initialGroups, setInitialGroups] = useState([]);
  // const [reservedGroups, setReservedGroups] = useState([]);
  //everything else
  const [languageID, setlanguageID] = useState("English (EN)");
  const [tabIndex, setTabIndex] = useState(0);

  function onSetMissionProps(name, value) {
    //console.log("🚀 ~ onSetMissionProps ~ text:", value);
    setMissionProps({ ...missionProps, [name]: value });
    //debug
    // let newProps = { ...missionProps, [name]: value };
    // console.log("🚀 ~ onSetMissionProps ~ newProps:", newProps);
  }

  function onModifyEnemyGroups(action) {
    // console.log("🚀 ~ onModifyEnemyGroups ~ action:", action);
    if (action.type === "initial") {
      if (action.command === "add") {
        if (
          initialGroups.findIndex(
            (item) => item.cardID === action.group.cardID
          ) === -1
        )
          setInitialGroups([...initialGroups, action.group]);
      } else if (action.command === "remove") {
        let groups = [...initialGroups];
        groups.splice(action.index, 1);
        setInitialGroups(groups);
      } else if (action.command === "edit") {
        setInitialGroups(
          initialGroups.map((item, index) => {
            if (index === action.index) {
              item = action.group;
            }
            return item;
          })
        );
      }
    }
  }

  return (
    <>
      <div className="surface-layout">
        {/* menu */}
        <AppBar
          onChangeSelectedSection={(value) =>
            console.log("changed section: ", value)
          }
        />

        {/* left panel */}
        <LeftPanel />

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
            {tabIndex === 2 && <MapEditorPanel value={tabIndex} index={2} />}
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
