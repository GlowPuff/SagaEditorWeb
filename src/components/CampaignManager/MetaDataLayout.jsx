import { useRef } from "react";
import PropTypes from "prop-types";
//mui
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TranslateIcon from "@mui/icons-material/Translate";
import Paper from "@mui/material/Paper";
//components
import GenericTextDialog from "../Dialogs/GenericTextDialog";
import InstructionTranslationDialog from "./InstructionTranslationDialog";
//state
import { useCampaignState } from "./CampaignState";

const MetaDataLayout = ({ onSnackBar }) => {
  // state
  const campaignName = useCampaignState((state) => state.campaignName);
  const campaignInstructions = useCampaignState(
    (state) => state.campaignInstructions
  );
  const setCampaignName = useCampaignState((state) => state.setCampaignName);
  const setCampaignInstructions = useCampaignState(
    (state) => state.setCampaignInstructions
  );
  const campaignImageData = useCampaignState(
    (state) => state.campaignImageData
  );
  const setCampaignImageData = useCampaignState(
    (state) => state.setCampaignImageData
  );
  const setCampaignImageFilename = useCampaignState(
    (state) => state.setCampaignImageFilename
  );
  const fileInputRef = useRef(null);

  const onKeyUp = (ev) => {
    if (ev.key == "Enter" || ev.keyCode === 13) ev.target.blur();
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        try {
          // Check file type
          const file = event.target.files[0];
          if (!file.type.match("image/png")) {
            throw new Error("Invalid file type. Only PNG images are allowed.");
          }
          const img = new Image();
          img.src = e.target.result;
          img.onload = async function () {
            try {
              // Check image dimensions
              const validDimensions =
                (img.width === 64 && img.height === 64) ||
                (img.width === 128 && img.height === 128);

              if (!validDimensions) {
                throw new Error(
                  "Image must be exactly 64x64 or 128x128 pixels."
                );
              }

              // If validation passes, set the image
              setCampaignImageFilename(file.name);
              setCampaignImageData(e.target.result);
            } catch (error) {
              onSnackBar(`${error}`, "error");
            } finally {
              // Reset the input after processing
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          };
        } catch (error) {
          onSnackBar(`Error: ${error}`, "error");
        } finally {
          // Reset the input after processing
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };

      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const onEditInstructions = () => {
    GenericTextDialog.ShowDialogNoFormatting(
      "Campaign Instructions",
      campaignInstructions,
      (text) => {
        setCampaignInstructions(text);
      }
    );
  };

  const onEditTranslations = () => {
    InstructionTranslationDialog.ShowDialog(onSnackBar, () => {});
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <Paper
        sx={{
          backgroundColor: "#281b40",
          padding: "1rem",
        }}
      >
        <Typography sx={{ paddingBottom: "1rem" }}>
          Campaign Metadata
        </Typography>
        <div>
          <Typography className="pink">
            Thumbnail icons must be in PNG format with an image dimension of
            64x64 or 128x128.
          </Typography>
          <div className="metadata-row">
            <Tooltip title="Campaign Thumbnail">
              <img
                className="campaign-thumbnail"
                src={campaignImageData || "./Thumbnails/cancel.png"}
                alt="Campaign Thumbnail"
                style={{ width: "64px", height: "64px" }}
              />
            </Tooltip>

            <Tooltip title="Change Thumbnail Icon">
              <IconButton component="label" variant="contained">
                <ModeEditIcon />
                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/png"
                  type="file"
                  onChange={handleImageChange}
                />
              </IconButton>
            </Tooltip>

            {/* CAMPAIGN NAME */}
            <TextField
              sx={{ width: "100%" }}
              name="fame"
              label={"Campaign Name"}
              onFocus={(e) => e.target.select()}
              onKeyUp={onKeyUp}
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />

            {/* CAMPAIGN INSTRUCTIONS */}
            <Button
              sx={{
                minWidth: "180px",
                padding: "6px 12px",
                border:
                  campaignInstructions === ""
                    ? "2px solid red"
                    : "2px solid lime",
              }}
              variant="contained"
              onClick={onEditInstructions}
            >
              Edit Instructions...
            </Button>

            <Tooltip title="Manage Instruction Translations">
              <IconButton
                component="label"
                variant="contained"
                onClick={onEditTranslations}
              >
                <TranslateIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Paper>

      <GenericTextDialog />
      <InstructionTranslationDialog />
    </div>
  );
};

export default MetaDataLayout;

MetaDataLayout.propTypes = {
  onSnackBar: PropTypes.func.isRequired,
};
