import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
//mui
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
//icons
import MenuIcon from "@mui/icons-material/Menu";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Divider } from "@mui/material";
//data
import UseCampaignImporter from "./UseCampaignImporter";

export default function AppBar({ resetCampaign, onSnackBar }) {
  const [open, setOpen] = useState(false); //for dialog box
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const campaignImporter = UseCampaignImporter(onSnackBar);

  function handleClickMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }
  function handleImportCampaign() {
    handleCloseMenu();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        campaignImporter.validateZipFile(file, (fileData) =>
          campaignImporter.importData(fileData)
        );
      }
    };
    input.click();
  }

  function handleExportMission() {
    handleCloseMenu();
    campaignImporter.exportData("campaign_package.zip");
  }

  function handleClose(bContinue) {
    setOpen(false);
    if (bContinue) {
      navigate("/");
    }
  }

  function handleResetCampaign() {
    handleCloseMenu();
    resetCampaign();
  }

  return (
    <Paper sx={{ marginTop: "0.5rem" }}>
      <div className="menubar">
        {/* HAMBURGER MENU */}
        <IconButton
          variant="contained"
          onClick={handleClickMenu}
          size="large"
          style={{ color: "purple" }}
        >
          <MenuIcon fontSize="inherit" />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          {/* RESET */}
          <Tooltip title="Reset to an Empty Project" placement="right">
            <MenuItem onClick={handleResetCampaign}>
              <ListItemIcon>
                <RefreshIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset Campaign Package</ListItemText>
            </MenuItem>
          </Tooltip>

          <Divider />

          {/* IMPORT */}
          <Tooltip title="Import a Campaign Package" placement="right">
            <MenuItem onClick={handleImportCampaign}>
              <ListItemIcon>
                <FileOpenIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Import Campaign...</ListItemText>
            </MenuItem>
          </Tooltip>

          {/* EXPORT */}
          <Tooltip title="Export a Campaign Package" placement="right">
            <MenuItem onClick={handleExportMission}>
              <ListItemIcon>
                <SaveAltIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Package and Export Campaign...</ListItemText>
            </MenuItem>
          </Tooltip>
        </Menu>

        <Typography variant="h6">ICE Campaign Packager</Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          style={{ marginLeft: "auto", marginRight: "1rem" }}
        >
          Return to Mission Editor
        </Button>
      </div>

      {/* Dialog for going back to the Mission Editor */}
      <Fragment>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            {"Go Back to Mission Editor?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Navigating back to the Mission Editor will clear all Campaign
              Package data. Do you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{ color: "pink" }}
              onClick={() => handleClose(true)}
            >
              Go Back to Mission Editor
            </Button>
            <Button
              variant="contained"
              onClick={() => handleClose(false)}
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </Paper>
  );
}

AppBar.propTypes = {
  resetCampaign: PropTypes.func.isRequired,
  onSnackBar: PropTypes.func.isRequired,
};
