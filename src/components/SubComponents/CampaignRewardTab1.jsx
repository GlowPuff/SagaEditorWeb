import { useState } from "react";
import PropTypes from "prop-types";
//mui
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
//icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
//data
import { itemData } from "../../data/carddata";

export default function CampaignRewardTab1({
  items,
  changeItems,
  selectedTabIndex,
  tabIndex,
}) {
  const [selectedItem, setSelectedItem] = useState(itemData[0]); //{id, name});

  function changeSelection(value) {
    setSelectedItem(value);
  }

  function addItem() {
    changeItems([...items, selectedItem.id]);
  }

  function removeItem(index) {
    changeItems(items.filter((item, idx) => idx !== index));
  }

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      <div className="event-container">
        <Select
          value={selectedItem}
          onChange={(e) => changeSelection(e.target.value)}
          displayEmpty
        >
          {itemData.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>

        <IconButton onClick={addItem}>
          <AddIcon />
        </IconButton>
      </div>

      <Paper
        sx={{
          padding: ".5rem",
          marginTop: ".5rem",
          display: items.length > 0 ? "" : "none",
        }}
      >
        <List
          sx={{
            overflow: "hidden auto",
            scrollbarColor: "#bc56ff #4c4561",
            scrollbarWidth: "thin",
            maxHeight: "14rem",
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="event-container align-center">
              <Typography>
                {itemData.find((x) => x.id === item).name} /{" "}
                {itemData.find((x) => x.id === item).id}
              </Typography>

              <IconButton onClick={() => removeItem(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </List>
      </Paper>
    </div>
  );
}
CampaignRewardTab1.propTypes = {
  items: PropTypes.array.isRequired,
  changeItems: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
