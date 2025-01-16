import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
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

  function onEditText(title, name, value) {
    GenericTextDialog.ShowDialog(title, value, (text) => {
      setPropValue(name, text);
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
                  sx={
                    missionProps.missionInfo
                      ? { outline: "2px solid lime" }
                      : { outline: "2px solid red" }
                  }
                >
                  Edit Mission Info...
                </Button>
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
                  sx={
                    missionProps.startingObjective
                      ? { outline: "2px solid lime" }
                      : { outline: "2px solid red" }
                  }
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
