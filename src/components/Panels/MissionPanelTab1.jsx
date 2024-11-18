import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//my components
import EventSelectAdd from "../SubComponents/EventSelectAdd";
//data
import { useEventsStore } from "../../data/dataStore";

function onKeyUp(ev) {
  if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
}

export default function MissionPanelTab1({
  missionProps,
  setPropValue,
  selectedTabIndex,
  tabIndex,
}) {
  const missionEvents = useEventsStore((state) => state.missionEvents);
  const refreshToken = useEventsStore((state) => state.refreshToken);

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
              Round Limit
            </AccordionSummary>
            <AccordionDetails>
              <div className="label-text">
                <Typography>Round Limit for the Mission:</Typography>
                <TextField
                  type="number"
                  name="roundLimit"
                  label={"Round Limit"}
                  variant="filled"
                  value={missionProps.roundLimit}
                  onChange={(e) => setPropValue(e.target.name, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyUp={onKeyUp}
                  fullWidth
                  sx={{ marginBottom: ".5rem" }}
                />
              </div>

              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                A value of -1 will remove the round limit for this Mission, but
                it can be set later in the Mission with a &apos;Modify Round
                Limit&apos; Event Action.
              </Typography>
              <Typography
                sx={{
                  color: "red",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                <i>
                  WARNING: The Round Limit can be disabled by the user in the
                  Saga IC2 app.
                </i>
              </Typography>
            </AccordionDetails>
          </Accordion>

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
              Round Limit Event
            </AccordionSummary>
            <AccordionDetails>
              {/* event UI */}
              <EventSelectAdd
                key={refreshToken}
                initialGUID={missionProps.roundLimitEvent}
                initialEvent={missionEvents.find(
                  (x) => x.GUID === missionProps.roundLimitEvent
                )}
                onItemChanged={(e) => setPropValue("roundLimitEvent", e.GUID)}
              />

              <Typography
                sx={{
                  color: "#ee82e5",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                This Event will fire at the end of the round set in Round Limit
                above.
              </Typography>
              <Typography
                sx={{
                  color: "red",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                <i>
                  WARNING: If the Round Limit is disabled by the user in the
                  Saga IC2 app, this Event will not fire.
                </i>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
}

MissionPanelTab1.propTypes = {
  missionProps: PropTypes.object.isRequired,
  setPropValue: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
