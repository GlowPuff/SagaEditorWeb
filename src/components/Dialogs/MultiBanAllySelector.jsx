import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function MultiBanAllySelector() {
  const [open, setOpen] = useState(false);
  const [allyData, setAllyData] = useState([]);
  const [bannedAllies, setBannedAllies] = useState([]);
  const callbackFunc = useRef(null);

  function showDialog(data, mProps, callback) {
    callbackFunc.current = callback;
    setAllyData(data);
    setBannedAllies(mProps.multipleBannedAllies);
    setOpen(true);
  }
  MultiBanAllySelector.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(bannedAllies);
    setOpen(false);
  }

  function onChangeChecked(e, id) {
    if (e.target.checked) {
      setBannedAllies([...bannedAllies, id]);
    } else {
      let b = bannedAllies.filter((item) => item !== id);
      setBannedAllies(b);
    }
  }

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      maxWidth={"md"}
      fullWidth={true}
      scroll={"paper"}
    >
      <DialogTitle>Edit Multiple Banned Allies</DialogTitle>
      <DialogContent>
        <div className="bannedAllyGrid">
          {allyData.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  radioGroup="banned"
                  checked={bannedAllies.includes(item.id)}
                  onChange={(e) => {
                    onChangeChecked(e, item.id);
                  }}
                />
              }
              label={item.name}
              sx={{ display: "block" }}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
        <Button variant="contained" onClick={() => onOK()}>
          continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
