import PropTypes from "prop-types";
//mui
import { Tooltip, IconButton } from "@mui/material";
//icons
import SquareIcon from "@mui/icons-material/Square";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ComputerIcon from "@mui/icons-material/Computer";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TokenIcon from "@mui/icons-material/Token";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";

const MapActionsToolbar = ({ toolbarAction, isEntitySelected }) => {
  return (
    <div className="mapToolBar">
      <Tooltip title="Add a Tile (Control + 1)" placement="right">
        <IconButton>
          <SquareIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add a Crate (Control + 2)" placement="right">
        <IconButton onClick={() => toolbarAction("addCrateEntity")}>
          <Inventory2Icon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add a Terminal (Control + 3)" placement="right">
        <IconButton onClick={() => toolbarAction("addTerminalEntity")}>
          <ComputerIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add a Door (Control + 4)" placement="right">
        <IconButton onClick={() => toolbarAction("addDoorEntity")}>
          <DoorSlidingIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add a Deployment Point (Control + 5)" placement="right">
        <IconButton onClick={() => toolbarAction("addDPEntity")}>
          <PersonAddIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add a Mission Marker (Control + 6)" placement="right">
        <IconButton onClick={() => toolbarAction("addMarkerEntity")}>
          <TokenIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add a Space Highlight (Control + 7)" placement="right">
        <IconButton onClick={() => toolbarAction("addHighlightEntity")}>
          <PriorityHighIcon fontSize="medium" />
        </IconButton>
      </Tooltip>

      <div className="mapToolBarDivider"></div>

      <Tooltip title="Center Map (Control + M)" placement="right">
        <IconButton onClick={() => toolbarAction("centerMap")}>
          <GpsFixedIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Center Selected Entity (Control + E)" placement="right">
        <span>
          <IconButton
            onClick={() => toolbarAction("centerEntity")}
            disabled={!isEntitySelected}
          >
            <ModeStandbyIcon fontSize="medium" />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

export default MapActionsToolbar;

MapActionsToolbar.propTypes = {
  toolbarAction: PropTypes.func,
  isEntitySelected: PropTypes.bool,
};
