import PropTypes from "prop-types";
//mui
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";

export default function CampaignRewardTab6({
  items,
  changeItems,
  selectedTabIndex,
  tabIndex,
}) {
  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      <Paper
        sx={{
          padding: ".5rem",
        }}
      >
        <div className="two-column-grid align-center">
          <TextField
            type="number"
            name="threatToModify"
            label={"Amount of Threat to add or remove"}
            variant="filled"
            value={items}
            onChange={(e) => changeItems(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyUp={onKeyUp}
            fullWidth
          />
          <Typography>
            Positive values add to the Threat Level, negative values remove from
            the Threat Level. These changes are made to the next Campaign
            Mission, regardless of its type (Story, Side, etc).
          </Typography>
        </div>
      </Paper>
    </div>
  );
}
CampaignRewardTab6.propTypes = {
  items: PropTypes.number.isRequired,
  changeItems: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};
