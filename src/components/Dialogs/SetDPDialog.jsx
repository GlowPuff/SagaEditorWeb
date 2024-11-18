import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
//data
import { useMapEntitiesStore } from "../../data/dataStore";
import { ActiveDeploymentPoint, NoneDeploymentPoint } from "../../data/Mission";

export default function SetDPDialog() {
  const allEntities = useMapEntitiesStore((state) => state.mapEntities);

  const mapEntities = [
    new ActiveDeploymentPoint(),
    new NoneDeploymentPoint(),
    ...allEntities.filter((item) => item.entityType === 3), //only deployment points
  ];

  const [open, setOpen] = useState(false);
  const [pointList, setPointList] = useState("");
  const [title, setTitle] = useState("");
  const callbackFunc = useRef(null);

  function onSelectionChanged(index, value) {
    setPointList(
      pointList.map((item, idx) => {
        if (idx === index) return { GUID: value };
        return item;
      })
    );
  }

  function showDialog(title, pList, callback) {
    callbackFunc.current = callback;
    setPointList(pList); //array of {GUID:"0000000000000"}
    setTitle(title);
    setOpen(true);
  }
  SetDPDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(pointList);
    setOpen(false);
  }

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      maxWidth={"sm"}
      fullWidth={true}
      scroll={"paper"}
    >
      <DialogTitle>Set Deployment Points</DialogTitle>
      <DialogContent>
        <Typography textAlign={"center"} sx={{ marginBottom: "1rem" }}>
          Set Individual Deployment Points for [{title}]
        </Typography>
        <Paper
          sx={{
            backgroundColor: "#201531",
            padding: "1rem",
            marginBottom: ".5rem",
          }}
        >
          {pointList &&
            pointList.map((dp, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                Deployment Point {index + 1}
                <Select
                  value={dp.GUID}
                  displayEmpty
                  sx={{ width: "100%" }}
                  onChange={(e) => onSelectionChanged(index, e.target.value)}
                >
                  {mapEntities.map((item, index) => (
                    <MenuItem key={index} value={item.GUID}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ))}
        </Paper>
        <Typography
          sx={{
            color: "#ee82e5",
          }}
        >
          If ANY Deployment Point is set to &apos;None&apos;, Saga will NOT show
          a visual Deployment Point on the map for this Deployment.
        </Typography>
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
  );
}
