import useZip from "./UseZip";
// import useLogger from "../../hooks/useLogger";
import {
  createGUID,
  loadImageAsBase64,
  base64ToBlob,
  convertToBase64,
} from "../../lib/core";
import { useCampaignState } from "./CampaignState";
import { useRawCampaignDataState } from "./RawCampaignDataState";
import {
  CampaignSlot,
  RawTranslationData,
  TranslationType,
  MissionItem,
  MissionPoolItem,
} from "./CampaignData";

export default function UseCampaignImporter(onSnackBar) {
  // const logger = useLogger();
  const { readZip, createZip, readFileFromZip } = useZip();
  const {
    setPackageGUID,
    packageGUID,
    resetCampaignState,
    addCampaignSlotWithStructure,
    setCampaignName,
    setCampaignInstructions,
    setInstructionTranslations,
    setCampaignImageFilename,
    setCampaignImageData,
    campaignName,
    campaignInstructions,
    campaignSlots,
    campaignImageFilename,
    campaignImageData,
    instructionTranslations,
    missionPool,
    addMissionPoolItem,
  } = useCampaignState();
  const {
    translations,
    importedMissions,
    resetRawCampaignData,
    addTranslationData,
    addImportedMission,
  } = useRawCampaignDataState();

  const importData = async (zipFile) => {
    //reset app state
    // Notify any listeners that we're resetting the campaign
    if (typeof window !== "undefined") {
			console.log("❗ :: UseCampaignImporter :: importData :: resetEvent::");
      const resetEvent = new CustomEvent("campaign-reset", {});
      window.dispatchEvent(resetEvent);
    }
    resetCampaignState();
    resetRawCampaignData();

    try {
      // First, read all files in the ZIP
      // const files = await readZip(zipFile);
      //logger.log("Files in ZIP:", files);

      // Then read and process the campaign package file
      const campaignPackage = await readFileFromZip(
        zipFile,
        "campaign_package.json"
      );
      //logger.log("campaign_package:", campaignPackage);

      // Set campaign metadata
      setPackageGUID(campaignPackage.GUID || createGUID());
      setCampaignName(campaignPackage.campaignName || "Default Campaign Name");
      setCampaignInstructions(campaignPackage.campaignInstructions || "");

      //next, set the campaign image file name
      setCampaignImageFilename(campaignPackage.campaignIconName);
      //returns a blob of the image data
      const iconData = await readFileFromZip(
        zipFile,
        campaignPackage.campaignIconName
      );
      // Convert blob to base64
      const base64Image = await convertToBase64(iconData);

      // Set the campaign icon data as Base64
      setCampaignImageData(base64Image);

      //next, set the instruction translations
      //only use items with isInstruction=true
      //imported objects are already in the correct format
      //array of TranslationItem
      setInstructionTranslations(
        campaignPackage.campaignTranslationItems.filter(
          (item) => item.isInstruction
        ) || []
      );

      //set the instruction translations into the raw data state
      //gather only Instruction translation items
      const instructionTranslationItems =
        campaignPackage.campaignTranslationItems.filter(
          (item) => item.isInstruction
        );
      //add the instruction translation data to the raw campaign data state
      instructionTranslationItems.forEach(async (item) => {
        //unzip data from Translations/filename
        const fileContent = await readFileFromZip(
          zipFile,
          `Translations/${item.fileName}`
        );

        const translationData = new RawTranslationData(
          item.fileName,
          fileContent,
          TranslationType.Instruction
        );

        addTranslationData(translationData);
      });

      //next, set the mission data
      campaignPackage.campaignMissionItems.forEach(async (item) => {
        //unzip data from Missions/filename
        const fileContent = await readFileFromZip(
          zipFile,
          `Missions/${item.missionGUID}.json`
        );

        // const missionData = new RawTranslationData(
        //   `${item.missionGUID}.json`,
        //   fileContent,
        //   TranslationType.Mission
        // );

        //create mission pool item
        let missionPoolItem = new MissionPoolItem(
          item.missionGUID,
          item.missionName,
          item.customMissionIdentifier
        );
        missionPoolItem.GUID = item.GUID;

        //set the mission pool translations
        const missionTranslations =
          campaignPackage.campaignTranslationItems.filter(
            (item) =>
              !item.isInstruction &&
              item.assignedMissionGUID ===
                missionPoolItem.missionItem.missionGUID
          );
        missionPoolItem.translationItems = missionTranslations;

        //add the mission pool item to the state
        addMissionPoolItem(missionPoolItem);

        //add the mission translation raw data
        missionTranslations.forEach(async (translationItem) => {
          //unzip data from Translations/filename
          const fileContent = await readFileFromZip(
            zipFile,
            `Translations/${translationItem.fileName}`
          );

          const translationData = new RawTranslationData(
            translationItem.fileName,
            fileContent,
            TranslationType.Mission
          );

          addTranslationData(translationData);
        });

        //add raw mission data
        addImportedMission(fileContent);
      });

      //next, set the campaign slots
      campaignPackage.campaignStructure.forEach((slot) => {
        // console.log("❗ :: campaignStructure :: slot::", slot);
        const newSlot = new CampaignSlot();
        newSlot.structure = slot;
        newSlot.campaignMissionItem =
          campaignPackage.campaignMissionItems.find(
            (mission) => mission.missionGUID === slot.missionID
          ) || new MissionItem();
        // console.log("❗ :: campaignPackage.campaignStructure :: slot::", slot);
        // console.log(
        //   "❗ :: campaignPackage.campaignStructure :: campaignPackage::",
        //   campaignPackage
        // );
        // console.log("❗ ::  newSlot::", newSlot);
        addCampaignSlotWithStructure(newSlot);
      });

      onSnackBar("Campaign data loaded successfully", "success");
    } catch (err) {
      resetCampaignState();
      resetRawCampaignData();
      onSnackBar(`Error loading campaign: ${err.message}`, "error");
    }
  };

  const exportData = async (zipName = "campaign_package.zip") => {
    try {
      const campaignPackage = await buildCampaignPackage();
      // Add options to preserve formatting in the zip
      const zipOptions = {
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      };
      const zipBlob = await createZip(campaignPackage, zipOptions);

      // Create a URL for the blob
      const url = URL.createObjectURL(zipBlob);
      // Create a download link
      const link = document.createElement("a");
      link.href = url;
      link.download = zipName;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onSnackBar("Campaign data exported successfully", "success");
    } catch (err) {
      onSnackBar(`Error exporting campaign: ${err.message}`, "error");
    }
  };

  //returns a formatted campaign package object
  const buildCampaignPackage = async () => {
    // Build the campaign package object
    const campaignPackage = {
      packageVersion: "2",
      GUID: packageGUID,
      campaignName: campaignName || "Default Campaign Name",
      campaignStructure: campaignSlots.map((slot) => slot.structure),
      campaignMissionItems: missionPool.map((slot) => slot.missionItem),
      campaignTranslationItems: [
        ...missionPool.flatMap((poolItem) => poolItem.translationItems),
        ...instructionTranslations,
      ], //TranslationItem
      campaignInstructions: campaignInstructions || "",
      campaignIconName: campaignImageFilename || "none.png",
    };

    // Create the base package manifest JSON and folders
    const packageContents = {
      "campaign_package.json": JSON.stringify(campaignPackage, null, 2),
      "Missions/": "",
      "Translations/": "",
    };

    let outputImage = campaignImageData;
    if (!outputImage) {
      // If no campaign image data, set default image
      const defaultImage = await loadImageAsBase64("/Thumbnails/cancel.png");
      outputImage = defaultImage;
    }

    // Add the campaign image
    if (outputImage) {
      // Remove the "data:image/png;base64," prefix if it exists
      const base64Data = outputImage.includes("base64,")
        ? outputImage.split("base64,")[1]
        : outputImage;

      const blob = base64ToBlob(base64Data, "image/png");
      packageContents[campaignImageFilename] = blob;
    }

    // Add mission files
    importedMissions.forEach((mission) => {
      const missionFileName = `Missions/${mission.missionGUID}.json`;
      packageContents[missionFileName] = JSON.stringify(mission, null, 2);
    });

    // Add translation files
    translations.forEach((translation) => {
      const translationFileName = `Translations/${translation.identifier}`;
      packageContents[translationFileName] = JSON.stringify(
        translation.translationData,
        null,
        2
      );
    });

    return packageContents;
  };

  const validateZipFile = (file, callback) => {
    if (
      file.type === "application/zip" ||
      file.name.toLowerCase().endsWith(".zip")
    ) {
      readZip(file)
        .then((files) => {
          const expectedFiles = [
            "campaign_package.json",
            "Missions/",
            "Translations/",
          ];
          //verify if content is a valid campaign package by looking at the files in the zip
          const missingFiles = expectedFiles.filter((file) => !files[file]);

          if (missingFiles.length > 0) {
            onSnackBar(
              `Invalid campaign package: missing ${missingFiles.join(", ")}`,
              "error"
            );
            return;
          }

          readFileFromZip(file, "campaign_package.json")
            .then((content) => {
              //make sure the package object packageVersion property is "2"
              if (content.packageVersion !== "2") {
                onSnackBar(
                  "Invalid campaign package: packageVersion must be '2'",
                  "error"
                );
                return;
              }
            })
            .then(() => {
              //zip checks out, show success message
              onSnackBar("Campaign package is valid.", "success");
              callback(file);
            })
            .catch((error) => {
              onSnackBar(`Error reading campaign.json: ${error}`, "error");
            });
        })
        .catch((error) => {
          onSnackBar(`Error reading ZIP file: ${error}`, "error");
        });
    } else {
      onSnackBar("Dropped file is not a ZIP file.", "error");
    }
  };

  return {
    importData,
    exportData,
    convertToBase64,
    validateZipFile,
  };
}
