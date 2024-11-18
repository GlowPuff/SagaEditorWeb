import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
//components
import EventSelectAdd from "../SubComponents/EventSelectAdd";
import TriggerSelectAdd from "../SubComponents/TriggerSelectAdd";

export default function SetCountdownDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    callbackFunc.current = callback;
    setEventAction(ea);
    setOpen(true);
  }
  SetCountdownDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"md"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Set Countdown Timer Event Action</DialogTitle>
          <DialogContent>
            <div className="mission-panel">
              {/* LEFT */}
              <div>
                <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
                  <Accordion
                    defaultExpanded
                    sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                  >
                    <AccordionSummary>General Properties</AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        disabled={eventAction.setRoundLimit === true}
                        name="countdownTimerName"
                        label={"Timer Name"}
                        variant="filled"
                        value={eventAction.countdownTimerName}
                        onChange={(e) =>
                          setEAValue(e.target.name, e.target.value)
                        }
                        onFocus={(e) => e.target.select()}
                        onKeyUp={onKeyUp}
                        fullWidth
                        sx={{ marginBottom: ".5rem" }}
                      />
                      <Typography
                        sx={{
                          color: "#ee82e5",
                          marginTop: ".5rem",
                          marginBottom: ".5rem",
                        }}
                      >
                        Giving a name to the Timer allows you to later disable
                        it. The name is case insensitive, so &apos;MY
                        TIMER&apos; is treated the same as &apos;my timer&apos;.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    defaultExpanded
                    sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                  >
                    <AccordionDetails>
                      <TextField
                        disabled={eventAction.setRoundLimit === true}
                        name="countdownTimer"
                        type="number"
                        label={"Timer Value"}
                        variant="filled"
                        value={eventAction.countdownTimer}
                        onChange={(e) =>
                          setEAValue(e.target.name, e.target.value)
                        }
                        onFocus={(e) => e.target.select()}
                        onKeyUp={onKeyUp}
                        fullWidth
                        sx={{ marginBottom: ".5rem" }}
                      />
                      <Typography
                        sx={{
                          color: "#ee82e5",
                          marginTop: ".5rem",
                          marginBottom: ".5rem",
                        }}
                      >
                        Start a countdown of rounds, optionally firing an Event
                        and/or Trigger when it expires.
                      </Typography>
                      <Typography
                        sx={{
                          color: "orange",
                          marginTop: ".5rem",
                          marginBottom: ".5rem",
                        }}
                      >
                        Example: A Timer with a value of &apos;2&apos; that is
                        started on Round 1 will finish at the END of Round 3.
                      </Typography>
                      <Typography
                        sx={{
                          color: "red",
                          marginTop: ".5rem",
                          marginBottom: ".5rem",
                        }}
                      >
                        Set the Timer Value to -1 to DISABLE an existing timer
                        of the same name.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              </div>

              {/* RIGHT */}
              <Paper sx={{ padding: ".5rem" }}>
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary>When The Timer Expires...</AccordionSummary>
                  <AccordionDetails>
                    <Typography>Fire This Trigger:</Typography>
                    <TriggerSelectAdd
                      initialGUID={eventAction.triggerGUID}
                      onItemChanged={(v) => setEAValue("triggerGUID", v.GUID)}
                    />
                    <Typography
                      sx={{
                        marginTop: ".5rem",
                      }}
                    >
                      Fire This Event:
                    </Typography>
                    <EventSelectAdd
                      initialGUID={eventAction.eventGUID}
                      onItemChanged={(v) => setEAValue("eventGUID", v.GUID)}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary>In-Game UI</AccordionSummary>
                  <AccordionDetails>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={eventAction.showPlayerCountdown}
                          onChange={(e) => {
                            setEAValue("showPlayerCountdown", e.target.checked);
                          }}
                        />
                      }
                      label="Display Countdown in Saga IC2"
                      sx={{ display: "block" }}
                    />
                    <Typography
                      sx={{
                        color: "#ee82e5",
                        marginTop: ".5rem",
                        marginBottom: ".5rem",
                      }}
                    >
                      If this is checked, the current countdown value will be
                      displayed in a small UI overlay above the Round number in
                      the IC2 app. Only one timer value can be shown in IC2 at a
                      time, defaulting to the one that will expire first.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </div>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button variant="contained" onClick={() => onOK()}>
              continue
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              color="error"
            >
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
