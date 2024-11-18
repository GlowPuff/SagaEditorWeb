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

export default function ModifyRoundLimitDialog() {
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
  ModifyRoundLimitDialog.ShowDialog = showDialog;

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
          <DialogTitle>Modify Round Limit Event Action</DialogTitle>
          <DialogContent>
            <div className="mission-panel">
              <div>
                <Paper sx={{ padding: ".5rem", marginBottom: ".5rem" }}>
                  <Typography
                    sx={{
                      color: "#ee82e5",
                      marginTop: ".5rem",
                      marginBottom: ".5rem",
                    }}
                  >
                    The <b>initial Round Limit</b> used at the start of the
                    Mission can be optionally set in Mission Properties.
                  </Typography>
                </Paper>

                <Paper sx={{ padding: ".5rem" }}>
                  <div className="mission-panel align-center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="limit"
                          checked={!eventAction.setRoundLimit}
                          onChange={(e) => {
                            if (e.target.checked)
                              setEAValue("setRoundLimit", false);
                          }}
                        />
                      }
                      label="Modify Round Limit"
                      sx={{ display: "block" }}
                    />
                    <TextField
                      disabled={eventAction.setRoundLimit === true}
                      type="number"
                      name="roundLimitModifier"
                      label={"Round Limit Modifier"}
                      variant="filled"
                      value={eventAction.roundLimitModifier}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.value)
                      }
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
                    When <b>modifying</b> the Round Limit, positive values
                    increase it and negative values decrease it by the given
                    amount.
                  </Typography>
                  <Paper
                    sx={{
                      padding: ".5rem",
                      marginBottom: ".5rem",
                      backgroundColor: "#312949",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "orange",
                        marginTop: ".5rem",
                        marginBottom: ".5rem",
                      }}
                    >
                      If the Round Limit is DISABLED by the player in the IC2
                      app (which sets the internal Round Limit to -1), modifying
                      the Round Limit here will ENABLE it in the IC2 app and
                      modify it by the given amount (-1 +/- Modifier).
                    </Typography>
                  </Paper>

                  <div className="mission-panel align-center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          radioGroup="limit"
                          checked={eventAction.setRoundLimit}
                          onChange={(e) => {
                            if (e.target.checked)
                              setEAValue("setRoundLimit", true);
                          }}
                        />
                      }
                      label="Set Round Limit"
                      sx={{ display: "block" }}
                    />
                    <TextField
                      disabled={eventAction.setRoundLimit === false}
                      type="number"
                      name="setLimitTo"
                      label={"Set Round Limit Directly"}
                      variant="filled"
                      value={eventAction.setLimitTo}
                      onChange={(e) =>
                        setEAValue(e.target.name, e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      onKeyUp={onKeyUp}
                      fullWidth
                      sx={{ marginBottom: ".5rem" }}
                    />
                  </div>
                </Paper>
              </div>

              {/* RIGHT */}
              <Paper sx={{ padding: ".5rem" }}>
                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary>
                    Change Round Limit Event (Optional)
                  </AccordionSummary>
                  <AccordionDetails>
                    <EventSelectAdd
                      initialGUID={eventAction.eventGUID}
                      onItemChanged={(v) => setEAValue("eventGUID", v.GUID)}
                    />
                    <Typography
                      sx={{
                        color: "#ee82e5",
                        marginTop: ".5rem",
                      }}
                    >
                      Leave the Event set to &apos;None&apos; to keep the
                      currently set Event in <i>Mission Properties</i>.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  defaultExpanded
                  sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
                >
                  <AccordionSummary>Disable Round Limit</AccordionSummary>
                  <AccordionDetails>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={eventAction.disableRoundLimit}
                          onChange={(e) => {
                            setEAValue("disableRoundLimit", e.target.checked);
                          }}
                        />
                      }
                      label="Disable Round Limit"
                      sx={{ display: "block" }}
                    />
                    <Typography
                      sx={{
                        color: "#ee82e5",
                        marginTop: ".5rem",
                        marginBottom: ".5rem",
                      }}
                    >
                      This option disables the Round Limit and sets the Round
                      Limit Event to &apos;None&apos;.
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
