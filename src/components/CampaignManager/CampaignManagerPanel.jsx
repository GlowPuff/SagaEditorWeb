import { useState, useEffect, useCallback } from "react";
import "../../App.css";
import "../../cm-css.css";
//mui
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
//components
import AppBar from "./AppBar";
import MetaDataLayout from "./MetaDataLayout";
import StructureLayout from "./StructureLayout";
// import useZip from "./UseZip";
import UseCampaignImporter from "./UseCampaignImporter";
import { useCampaignState } from "./CampaignState";
import { useRawCampaignDataState } from "./RawCampaignDataState";

const CampaignManagerPanel = () => {
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  // const zipLib = useZip();
  const resetCampaignState = useCampaignState(
    (state) => state.resetCampaignState
  );
  const resetRawCampaignData = useRawCampaignDataState(
    (state) => state.resetRawCampaignData
  );

  const onSnackBar = useCallback((message, severity = "error") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  }, []);
  const campaignImporter = UseCampaignImporter(onSnackBar);

  // Set up event handlers for drag and drop
  useEffect(() => {
    // Create an AbortController to manage event listeners
    const controller = new AbortController();
    const signal = controller.signal;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Always set isDragging to true on dragenter, we'll validate in dragOver
      setIsDragging(true);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Only set isDragging to false if we're leaving the container
      // and not entering a child element
      const container = document.getElementById("campaign-manager-container");
      const rect = container.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (
        x <= rect.left ||
        x >= rect.right ||
        y <= rect.top ||
        y >= rect.bottom
      ) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setSelectedMissionIndex(-1);

      // Handle the dropped files
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Get the first file only
        // Check if it's a valid package file
        campaignImporter.validateZipFile(e.dataTransfer.files[0], (fileData) =>
          campaignImporter.importData(fileData)
        );
      }
    };

    const handleDragEnd = () => {
      // Reset dragging state when drag operation ends
      setIsDragging(false);
    };

    // Add event listeners with signal
    window.addEventListener("dragenter", handleDragEnter, { signal });
    window.addEventListener("dragover", handleDragOver, { signal });
    window.addEventListener("dragleave", handleDragLeave, { signal });
    window.addEventListener("drop", handleDrop, { signal });
    window.addEventListener("dragend", handleDragEnd, { signal });

    // Clean up event listeners by aborting the controller
    return () => {
      controller.abort();
    };
  }, [campaignImporter]);

  const handleResetCampaign = () => {
    resetCampaignState();
    resetRawCampaignData();
    setSelectedMissionIndex(-1);
  };

  return (
    <>
      <Container
        id="campaign-manager-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        {isDragging && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "rgba(40, 27, 64, 0.9)",
                borderRadius: "8px",
                color: "white",
                fontSize: "20px",
              }}
            >
              Drop Campaign Package (ZIP) here
            </div>
          </div>
        )}
        <AppBar resetCampaign={handleResetCampaign} onSnackBar={onSnackBar} />
        <MetaDataLayout onSnackBar={onSnackBar} />
        <StructureLayout
          onSnackBar={onSnackBar}
          selectedMissionIndex={selectedMissionIndex}
          setSelectedMissionIndex={setSelectedMissionIndex}
        />
      </Container>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CampaignManagerPanel;
