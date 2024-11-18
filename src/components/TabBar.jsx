import PropTypes from "prop-types";
//mui
import { Paper, Tabs, Tab } from "@mui/material";
//icons
import SettingsIcon from "@mui/icons-material/Settings";
import GridViewSharpIcon from "@mui/icons-material/GridViewSharp";
import MapIcon from "@mui/icons-material/Map";
import GroupsIcon from "@mui/icons-material/Groups";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import PersonIcon from "@mui/icons-material/Person";

export default function TabBar({ tabIndex, onTabChange }) {
  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <>
      <Paper
        sx={{
          width: "100%",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<SettingsIcon />} label="mission" id="tab-0" />
          <Tab icon={<GridViewSharpIcon />} label="sections" id="tab-1" />
          <Tab icon={<MapIcon />} label="map editor" id="tab-2" />
          <Tab icon={<GroupsIcon />} label="enemy groups" id="tab-3" />
          <Tab icon={<DeveloperBoardIcon />} label="properties" id="tab-4" />
          <Tab icon={<PersonIcon />} label="character designer" id="tab-5" />
        </Tabs>
      </Paper>
    </>
  );
}

TabBar.propTypes = {
  tabIndex: PropTypes.number,
  onTabChange: PropTypes.func,
};
