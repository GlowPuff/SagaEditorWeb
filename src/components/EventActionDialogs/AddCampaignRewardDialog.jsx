import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
//icons
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DangerousIcon from "@mui/icons-material/Dangerous";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
//components
import CampaignRewardTab1 from "../SubComponents/CampaignRewardTab1";
import CampaignRewardTab2 from "../SubComponents/CampaignRewardTab2";
import CampaignRewardTab3 from "../SubComponents/CampaignRewardTab3";
import CampaignRewardTab4 from "../SubComponents/CampaignRewardTab4";
import CampaignRewardTab5 from "../SubComponents/CampaignRewardTab5";
import CampaignRewardTab6 from "../SubComponents/CampaignRewardTab6";

export default function AddCampaignRewardDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    callbackFunc.current = callback;
    setEventAction(ea);
    setSelectedTabIndex(0);
    setOpen(true);
  }
  AddCampaignRewardDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function handleTabChange(event, newValue) {
    setSelectedTabIndex(newValue);
  }

  function changeItems(name, items) {
    setEAValue(name, [...items]);
  }

  function changeNumberProp(name, value) {
    setEAValue(name, Number.parseInt(value) || value);
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
          <DialogTitle>Add Campaign Reward Event Action</DialogTitle>
          <DialogContent>
            <Paper sx={{ padding: "1rem" }}>
              <Typography sx={{ color: "#ee82e5" }}>
                Use this Event Action to immediately add rewards to the saved
                Campaign state. It&apos;s recommended to fire this Event Action
                at the end of a Mission.
              </Typography>

              <Paper
                sx={{
                  padding: "1rem",
                  marginTop: ".5rem",
                  backgroundColor: "#201531",
                }}
              >
                <Tabs
                  value={selectedTabIndex}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab
                    icon={<AddShoppingCartIcon />}
                    label="Items"
                    id="tab-1"
                  />
                  <Tab icon={<EmojiEventsIcon />} label="Rewards" id="tab-2" />
                  <Tab
                    icon={<SentimentVeryDissatisfiedIcon />}
                    label="Earned Villains"
                    id="tab-3"
                  />
                  <Tab
                    icon={<SentimentSatisfiedAltIcon />}
                    label="Earned Allies"
                    id="tab-4"
                  />
                  <Tab
                    icon={<MedicalServicesIcon />}
                    label="MedPacs"
                    id="tab-5"
                  />
                  <Tab
                    icon={<DangerousIcon />}
                    label="Threat Level"
                    id="tab-6"
                  />
                </Tabs>
              </Paper>

              <Paper
                sx={{
                  backgroundColor: "#201531",
                  padding: "1rem",
                  marginTop: ".5rem",
                }}
              >
                {/* TAB CONTENT */}
                <CampaignRewardTab1
                  tabIndex={0}
                  selectedTabIndex={selectedTabIndex}
                  changeItems={(v) => changeItems("campaignItems", v)}
                  items={eventAction.campaignItems}
                />
                <CampaignRewardTab2
                  tabIndex={1}
                  selectedTabIndex={selectedTabIndex}
                  changeItems={(v) => changeItems("campaignRewards", v)}
                  items={eventAction.campaignRewards}
                />
                <CampaignRewardTab3
                  tabIndex={2}
                  selectedTabIndex={selectedTabIndex}
                  changeItems={(v) => changeItems("earnedVillains", v)}
                  items={eventAction.earnedVillains}
                />
                <CampaignRewardTab4
                  tabIndex={3}
                  selectedTabIndex={selectedTabIndex}
                  changeItems={(v) => changeItems("earnedAllies", v)}
                  items={eventAction.earnedAllies}
                />
                <CampaignRewardTab5
                  tabIndex={4}
                  selectedTabIndex={selectedTabIndex}
                  changeItems={(v) => changeNumberProp("medpacsToModify", v)}
                  items={eventAction.medpacsToModify}
                />
                <CampaignRewardTab6
                  tabIndex={5}
                  selectedTabIndex={selectedTabIndex}
                  changeItems={(v) => changeNumberProp("threatToModify", v)}
                  items={eventAction.threatToModify}
                />
              </Paper>
            </Paper>
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
