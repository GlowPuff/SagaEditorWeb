import { useState } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//my components
import MultiBanAllySelector from "../Dialogs/MultiBanAllySelector";
import EnemyFilterList from "../SubComponents/EnemyFilterList";
//data
import { allyData, enemyData, villainData } from "../../data/carddata";
//core.js
import * as core from "../../lib/core";

const enemySet = new Map(
  [...enemyData, ...villainData].map((x) => [x.id, `${x.name} [${x.id}]`])
);

export default function MissionPanelTab2({
  missionProps,
  setPropValue,
  selectedTabIndex,
  tabIndex,
}) {
  const [selectedAlly, setSelectedAlly] = useState("Luke Skywalker (Hero)");
  const [selectedBannedAlly, setSelectedBannedAlly] = useState(
    "Luke Skywalker (Hero)"
  );

  function onChangeChecked(name, value) {
    setPropValue(name, value);
  }

  function onChangeBanned(e) {
    setSelectedBannedAlly(e.target.value);
    let s = allyData.findIndex((item) => item.name === e.target.value);
    setPropValue("bannedAlly", allyData[s].id);
  }

  function onChangeFixed(e) {
    setSelectedAlly(e.target.value);
    let s = allyData.findIndex((item) => item.name === e.target.value);
    setPropValue("fixedAlly", allyData[s].id);
  }

  function onMultiEditClick() {
    MultiBanAllySelector.ShowDialog(allyData, missionProps, (e) => {
      setPropValue("multipleBannedAllies", e);
    });
  }

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      {selectedTabIndex === tabIndex && (
        <div>
          <Accordion
            defaultExpanded
            sx={{
              marginBottom: ".5rem",
              backgroundColor: "#281b40",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1-header"
            >
              Fixed Ally
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    radioGroup="fixedally"
                    checked={missionProps.useFixedAlly === core.YesNoAll.No}
                    onChange={(e) => {
                      if (e.target.checked)
                        onChangeChecked("useFixedAlly", core.YesNoAll.No);
                    }}
                  />
                }
                label="No"
              />

              <div className="two-column-grid">
                <FormControlLabel
                  control={
                    <Checkbox
                      radioGroup="fixedally"
                      checked={missionProps.useFixedAlly === core.YesNoAll.Yes}
                      onChange={(e) => {
                        if (e.target.checked)
                          onChangeChecked("useFixedAlly", core.YesNoAll.Yes);
                      }}
                    />
                  }
                  label="Yes"
                />
                <Select
                  sx={{ width: "100%" }}
                  value={(allyData && selectedAlly) || ""}
                  onChange={(e) => onChangeFixed(e)}
                  displayEmpty
                  disabled={missionProps.useFixedAlly === core.YesNoAll.No}
                >
                  {allyData &&
                    allyData.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* BANNED ALLY */}
          <Accordion
            defaultExpanded
            sx={{
              marginBottom: ".5rem",
              backgroundColor: "#281b40",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1-header"
            >
              Banned Ally
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    radioGroup="banned"
                    checked={missionProps.useBannedAlly === core.YesNoAll.All}
                    onChange={(e) => {
                      if (e.target.checked)
                        onChangeChecked("useBannedAlly", core.YesNoAll.All);
                    }}
                  />
                }
                label="All"
                sx={{ display: "block" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    radioGroup="banned"
                    checked={missionProps.useBannedAlly === core.YesNoAll.No}
                    onChange={(e) => {
                      if (e.target.checked)
                        onChangeChecked("useBannedAlly", core.YesNoAll.No);
                    }}
                  />
                }
                label="None"
                sx={{ display: "block" }}
              />
              <div className="two-column-grid">
                <FormControlLabel
                  control={
                    <Checkbox
                      radioGroup="banned"
                      checked={missionProps.useBannedAlly === core.YesNoAll.Yes}
                      onChange={(e) => {
                        if (e.target.checked)
                          onChangeChecked("useBannedAlly", core.YesNoAll.Yes);
                      }}
                    />
                  }
                  label="Single"
                  sx={{ display: "block" }}
                />
                <Select
                  sx={{ width: "100%" }}
                  value={(allyData && selectedBannedAlly) || ""}
                  onChange={(e) => onChangeBanned(e)}
                  displayEmpty
                  disabled={missionProps.useBannedAlly !== core.YesNoAll.Yes}
                >
                  {allyData &&
                    allyData.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>

                <FormControlLabel
                  control={
                    <Checkbox
                      radioGroup="banned"
                      checked={
                        missionProps.useBannedAlly === core.YesNoAll.Multi
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          onChangeChecked("useBannedAlly", core.YesNoAll.Multi);
                      }}
                    />
                  }
                  label="Multiple"
                  sx={{ display: "block" }}
                />
                <Button
                  variant="contained"
                  onClick={onMultiEditClick}
                  disabled={missionProps.useBannedAlly !== core.YesNoAll.Multi}
                >
                  Select...
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* BANNED ENEMY GROUPS */}
          <Accordion
            defaultExpanded
            sx={{
              marginBottom: ".5rem",
              backgroundColor: "#281b40",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1-header"
            >
              Banned Enemy Groups
            </AccordionSummary>
            <AccordionDetails>
              <EnemyFilterList
                onGroupChanged={(value) => setPropValue("bannedGroups", value)}
                title={"banned groups"}
                setPropValue={setPropValue}
                initialAddedGroups={missionProps.bannedGroups.map((x) =>
                  enemySet.get(x)
                )}
              />
            </AccordionDetails>
          </Accordion>

          <MultiBanAllySelector />
        </div>
      )}
    </div>
  );
}

MissionPanelTab2.propTypes = {
  missionProps: PropTypes.object.isRequired,
  setPropValue: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
