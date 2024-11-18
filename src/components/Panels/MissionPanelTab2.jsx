import { useState } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//dispatcher
import EventSelectAdd from "../SubComponents/EventSelectAdd.jsx";
//my components
import GenericTextDialog from "../Dialogs/GenericTextDialog";
//data
import { useEventsStore } from "../../data/dataStore";

export default function MissionPanelTab2({
  missionProps,
  setPropValue,
  selectedTabIndex,
  tabIndex,
}) {
  const refreshToken = useEventsStore((state) => state.refreshToken);

  const [infoSet, setInfoSet] = useState(missionProps.missionInfo !== "");
  const [objectiveSet, setObjectiveSet] = useState(
    missionProps.startingObjective !== ""
  );

  function onEditText(title, name, value) {
    GenericTextDialog.ShowDialog(title, value, (text) => {
      setPropValue(name, text);
      if (name === "missionInfo") setInfoSet(text !== "");
      else if (name === "startingObjective") setObjectiveSet(text !== "");
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
              Starting Event
            </AccordionSummary>
            <AccordionDetails>
              <EventSelectAdd
                key={refreshToken}
                initialGUID={missionProps.startingEvent}
                onItemChanged={(e) => setPropValue("startingEvent", e.GUID)}
              />
            </AccordionDetails>
          </Accordion>

          {/* STARTING INFO */}
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
              Starting Mission Information
            </AccordionSummary>
            <AccordionDetails>
              <div className="label-text">
                <Button
                  variant="contained"
                  onClick={() =>
                    onEditText(
                      "Mission Info",
                      "missionInfo",
                      missionProps.missionInfo
                    )
                  }
                >
                  Edit Mission Info...
                </Button>
                <Typography sx={{ color: infoSet ? "lime" : "red" }}>
                  {infoSet ? "Text Set" : "Text Not Set"}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* STARTING OBJECTIVE */}
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
              Starting Objective
            </AccordionSummary>
            <AccordionDetails>
              <div className="label-text">
                <Button
                  variant="contained"
                  onClick={() =>
                    onEditText(
                      "Starting Objective",
                      "startingObjective",
                      missionProps.startingObjective
                    )
                  }
                >
                  Edit Objective...
                </Button>
                <Typography sx={{ color: objectiveSet ? "lime" : "red" }}>
                  {objectiveSet ? "Text Set" : "Text Not Set"}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
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
