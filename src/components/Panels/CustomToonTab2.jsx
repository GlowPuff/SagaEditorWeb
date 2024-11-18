import { memo, useCallback } from "react";
import PropTypes from "prop-types";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
//components
import ThumbnailSelector from "../SubComponents/ThumbnailSelector";

const CustomToonTab2 = memo(function CustomToonTab2({
  selectedTabIndex,
  tabIndex,
  customToon,
  updateToon,
}) {
  const changeIcon = useCallback(
    (thumbnail) => {
      let update = {
        ...customToon,
        thumbnail,
      };
      update.deploymentCard.mugShotPath = "CardThumbnails/" + thumbnail.ID;
      updateToon(update);
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
        <AccordionDetails>
          <Paper
            sx={{
              padding: "1rem",
              margin: ".5rem 0 1rem 0",
            }}
          >
            <Typography>
              Thumbnail:{" "}
              <span style={{ color: "#ee82e5" }}>
                {customToon.thumbnail.ID === "None"
                  ? "None Selected"
                  : customToon.thumbnail.Name}
              </span>
            </Typography>
          </Paper>
          {selectedTabIndex === tabIndex && (
            <ThumbnailSelector
              showDefaultButton={false}
              onIconChanged={changeIcon}
              initialThumb={customToon.thumbnail}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
});

CustomToonTab2.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  customToon: PropTypes.object.isRequired,
  updateToon: PropTypes.func.isRequired,
};

export default CustomToonTab2;
