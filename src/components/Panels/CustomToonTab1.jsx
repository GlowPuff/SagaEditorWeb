import { useState, useCallback, memo, useMemo } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
//data
import { enemyData, villainData } from "../../data/carddata";
import { FigureSize } from "../../lib/core";

const CustomToonTab1 = memo(function CustomToonTab1({
  selectedTabIndex,
  tabIndex,
  customToon,
  updateToon,
}) {
  const groupData = useMemo(() => [...enemyData, ...villainData], []);
  const [selectedGroup, setSelectedGroup] = useState(groupData[0]);
  const [copyMore, setCopyMore] = useState(true);

  const onKeyUp = useCallback((ev) => {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }, []);

  const onDoCopyClick = useCallback(() => {
    // console.log("🚀 ~ onDoCopyClick ~ customToon:", customToon);
    let update = customToon.CopyFrom(customToon, selectedGroup, copyMore);
    // console.log("🚀 ~ onDoCopyClick ~ updatedCard:", update);
    updateToon(update);
  }, [customToon, selectedGroup, copyMore, updateToon]);

  const changeCardProp = useCallback(
    (name, value) => {
      let update = {
        ...customToon,
        deploymentCard: { ...customToon.deploymentCard, [name]: value },
      };
      updateToon(update);
      // console.log("🚀 ~ changeCardProp ~ update:", update);
    },
    [customToon, updateToon]
  );

  const changeToonProp = useCallback(
    (name, value) => {
      let update = {
        ...customToon,
        [name]: value,
      };
      updateToon(update);
      // console.log("🚀 ~ changeToonProp ~ update:", update);
    },
    [customToon, updateToon]
  );

  return (
    <div hidden={selectedTabIndex !== tabIndex} id={`tab-${tabIndex}`}>
      <Accordion
        defaultExpanded
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Copy Group Properties
        </AccordionSummary>
        <AccordionDetails>
          <div className="event-container">
            <FormControl>
              <InputLabel>Copy Group Properties From:</InputLabel>
              <Select
                sx={{ width: "100%" }}
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                displayEmpty
              >
                {groupData.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item.name}: {item.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Copy Group">
              <IconButton onClick={onDoCopyClick}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={copyMore}
                onChange={(e) => setCopyMore(e.target.checked)}
              />
            }
            label="Also Copy Instructions and Bonuses"
          />

          <Typography sx={{ marginTop: ".5rem" }} className="orange">
            Warning: This will overwrite the current General Properties, Combat
            Properties (
            <span className="red">except Priority Target Traits</span>) and Card
            Text Properties.
          </Typography>
          <Typography sx={{ marginTop: ".5rem" }} className="orange">
            Name, Subname, ID, Character Type, Deployment Properties, Faction,
            and Appearance are not affected.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* ELIETE */}
      <Accordion
        defaultExpanded
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionDetails>
          <div className="label-text">
            <FormControlLabel
              control={
                <Checkbox
                  name="isElite"
                  checked={customToon.deploymentCard.isElite}
                  onChange={(e) =>
                    changeCardProp(e.target.name, e.target.checked)
                  }
                />
              }
              label="This Group is Elite"
            />
            <Typography>
              Elite Groups are outlined in red unless a different icon outline
              color is set.
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* FAME */}
      <Accordion
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Fame and Reimbursement
        </AccordionSummary>
        <AccordionDetails>
          <div className="two-column-grid">
            <TextField
              type="number"
              name="fame"
              label={"Fame"}
              variant="filled"
              value={customToon.deploymentCard.fame || ""}
              onChange={(e) => changeCardProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
            <TextField
              type="number"
              name="reimb"
              label={"Reimbursement"}
              variant="filled"
              value={customToon.deploymentCard.reimb || ""}
              onChange={(e) => changeCardProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
          </div>
        </AccordionDetails>
      </Accordion>

      {/* HEALTH SPEED */}
      <Accordion
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Health and Speed
        </AccordionSummary>
        <AccordionDetails>
          <div className="two-column-grid">
            <TextField
              type="number"
              name="health"
              label={"Health"}
              variant="filled"
              value={customToon.deploymentCard.health || ""}
              onChange={(e) => changeCardProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
            <TextField
              type="number"
              name="speed"
              label={"Speed"}
              variant="filled"
              value={customToon.deploymentCard.speed || ""}
              onChange={(e) => changeCardProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                name="useThreatMultiplier"
                checked={customToon.useThreatMultiplier}
                onChange={(e) =>
                  changeToonProp(e.target.name, e.target.checked)
                }
              />
            }
            label="Multiply Health By Threat Level"
          />
        </AccordionDetails>
      </Accordion>

      {/* COST AND SIZE */}
      <Accordion
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Costs and Group Size
        </AccordionSummary>
        <AccordionDetails>
          <div className="triple-column-grid">
            <TextField
              type="number"
              name="cost"
              label={"Deployment Cost"}
              variant="filled"
              value={customToon.deploymentCard.cost || ""}
              onChange={(e) => changeCardProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
            <TextField
              type="number"
              name="rcost"
              label={"Redeployment Cost"}
              variant="filled"
              value={customToon.deploymentCard.rcost || ""}
              onChange={(e) => changeCardProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
            <TextField
              type="number"
              name="size"
              label={"Group Size"}
              variant="filled"
              value={customToon.deploymentCard.size || ""}
              onChange={(e) => changeCardProp(e.target.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              fullWidth
            />
          </div>

          <Typography className="orange" sx={{ marginTop: ".5rem" }}>
            Warning: Changing the Group Size may require updating the Deployment
            Point properties of any Event Action that deploys this Group.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* FIGURE SIZE */}
      <Accordion
        sx={{
          marginBottom: ".5rem",
          backgroundColor: "#281b40",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Figure Size
        </AccordionSummary>
        <AccordionDetails>
          <div className="quad-column-grid">
            <FormControlLabel
              control={
                <Checkbox
                  radioGroup="figureSize"
                  name="miniSize"
                  checked={
                    customToon.deploymentCard.miniSize === FigureSize.Small1x1
                  }
                  onChange={(e) => {
                    if (e.target.checked)
                      changeCardProp(e.target.name, FigureSize.Small1x1);
                  }}
                />
              }
              label="Small 1x1"
            />
            <FormControlLabel
              control={
                <Checkbox
                  radioGroup="figureSize"
                  name="miniSize"
                  checked={
                    customToon.deploymentCard.miniSize === FigureSize.Medium1x2
                  }
                  onChange={(e) =>
                    changeCardProp(e.target.name, FigureSize.Medium1x2)
                  }
                />
              }
              label="Medium 1x2"
            />
            <FormControlLabel
              control={
                <Checkbox
                  radioGroup="figureSize"
                  name="miniSize"
                  checked={
                    customToon.deploymentCard.miniSize === FigureSize.Large2x2
                  }
                  onChange={(e) =>
                    changeCardProp(e.target.name, FigureSize.Large2x2)
                  }
                />
              }
              label="Large 2x2"
            />
            <FormControlLabel
              control={
                <Checkbox
                  radioGroup="figureSize"
                  name="miniSize"
                  checked={
                    customToon.deploymentCard.miniSize === FigureSize.Huge2x3
                  }
                  onChange={(e) =>
                    changeCardProp(e.target.name, FigureSize.Huge2x3)
                  }
                />
              }
              label="Huge 2x3"
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
});

CustomToonTab1.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  customToon: PropTypes.object.isRequired,
  updateToon: PropTypes.func.isRequired,
};

export default CustomToonTab1;
