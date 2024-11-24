import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//data
import { PriorityTraits } from "../../lib/core";

export default function DeploymentGroupProperties() {
  const [dpProps, setDPProps] = useState({});
  const [open, setOpen] = useState(false);
  const callbackFunc = useRef(null);

  function showDialog(props, callback) {
    // console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setDPProps(props);
    setOpen(true);
  }
  DeploymentGroupProperties.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(dpProps);
    setOpen(false);
  }

  function modifyEntity(name, checked) {
    let updated = { ...dpProps };
    updated[name] = checked;
    // console.log("🚀 ~ modifyEntity ~ updated:", updated);
    setDPProps(updated);
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth="md"
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Deployment Group Properties</DialogTitle>
          <DialogContent>
            {/* FACTIONS */}
            <div className="simple-column">
              <Paper sx={{ padding: "1rem" }}>
                <Typography>Include Factions</Typography>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dpProps.incImperial}
                        onChange={(e) => {
                          modifyEntity("incImperial", e.target.checked);
                        }}
                      />
                    }
                    label="Imperial"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dpProps.incMercenary}
                        onChange={(e) => {
                          modifyEntity("incMercenary", e.target.checked);
                        }}
                      />
                    }
                    label="Mercenary"
                  />
                </div>
              </Paper>

              {/* SIZES */}
              <Paper sx={{ padding: "1rem" }}>
                <Typography>Include Sizes</Typography>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dpProps.incSmall}
                        onChange={(e) => {
                          modifyEntity("incSmall", e.target.checked);
                        }}
                      />
                    }
                    label="Small (1x1)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dpProps.incMedium}
                        onChange={(e) => {
                          modifyEntity("incMedium", e.target.checked);
                        }}
                      />
                    }
                    label="Medium (1x2)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dpProps.incLarge}
                        onChange={(e) => {
                          modifyEntity("incLarge", e.target.checked);
                        }}
                      />
                    }
                    label="Large (2x2)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dpProps.incHuge}
                        onChange={(e) => {
                          modifyEntity("incHuge", e.target.checked);
                        }}
                      />
                    }
                    label="Huge (2x3)"
                  />
                </div>
              </Paper>

              {/* TRAITS */}
              <Paper sx={{ padding: "1rem" }}>
                <Typography>Include Traits</Typography>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  }}
                >
                  {PriorityTraits.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={dpProps[item.propName]}
                          onChange={(e) => {
                            modifyEntity(item.propName, e.target.checked);
                          }}
                        />
                      }
                      label={item.name}
                    />
                  ))}
                </div>
              </Paper>
            </div>
          </DialogContent>
          <DialogActions
            sx={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "1rem",
            }}
          >
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
