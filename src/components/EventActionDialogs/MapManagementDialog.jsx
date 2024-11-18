import { useState, useRef } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
//data
import { useMapSectionsStore } from "../../data/dataStore";

export default function MapManagementDialog() {
  const [open, setOpen] = useState(false);
  const [eventAction, setEventAction] = useState();
  const callbackFunc = useRef(null);

  const [tabIndex, setTabIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTile, setSelectedTile] = useState("");
  const [msg, setMsg] = useState(
    "Activate either a Map Section OR an individual Tile, or BOTH."
  );

  const noneItem = {
    GUID: "00000000-0000-0000-0000-000000000000",
    name: "None",
  };
  const mapSections = useRef([
    noneItem,
    ...useMapSectionsStore((state) => state.mapSections),
  ]);

  const tiles = useMapSectionsStore((state) => state.mapSections).flatMap(
    (section) =>
      section.mapTiles.map((tile) => ({ name: tile.name, GUID: tile.GUID }))
  );

  const mapTiles = useRef([noneItem, ...tiles]);

  function setEAValue(name, value) {
    setEventAction({ ...eventAction, [name]: value });
  }

  function showDialog(ea, callback) {
    console.log("🚀 ~ showDialog ~ ea:", ea);
    callbackFunc.current = callback;
    setEventAction(ea);
    setSelectedSection(
      mapSections.current.find((x) => x.GUID === ea.mapSection)
    );
    setSelectedTile(mapTiles.current.find((x) => x.GUID === ea.mapTile));
    setOpen(true);
  }
  MapManagementDialog.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current(eventAction);
    setOpen(false);
  }

  function changeSection(section) {
    setSelectedSection(section);
    if (tabIndex === 0) setEAValue("mapSection", section.GUID);
    else if (tabIndex === 1) setEAValue("mapSectionRemove", section.GUID);
  }

  function changeTile(tile) {
    setSelectedTile(tile);
    if (tabIndex === 0) setEAValue("mapTile", tile.GUID);
    else if (tabIndex === 1) setEAValue("mapTileRemove", tile.GUID);
  }

  function changeTab(tab) {
    setTabIndex(tab);
    if (tab === 0) {
      setMsg("Activate either a Map Section OR an individual Tile, or BOTH.");
      setSelectedSection(
        mapSections.current.find((x) => x.GUID === eventAction.mapSection)
      );
      setSelectedTile(
        mapTiles.current.find((x) => x.GUID === eventAction.mapTile)
      );
    } else if (tab === 1) {
      setMsg("Deactivate either a Map Section OR an individual Tile, or BOTH.");
      setSelectedSection(
        mapSections.current.find((x) => x.GUID === eventAction.mapSectionRemove)
      );
      setSelectedTile(
        mapTiles.current.find((x) => x.GUID === eventAction.mapTileRemove)
      );
    }
  }

  return (
    <>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"md"}
          fullWidth={true}
          scroll={"paper"}
        >
          <DialogTitle>Map Management Event Action</DialogTitle>
          <DialogContent>
            <Paper
              sx={{
                backgroundColor: "#201531",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "1rem",
                }}
              >
                <Paper
                  sx={{
                    padding: "1rem",
                  }}
                >
                  <Tabs
                    orientation="vertical"
                    value={tabIndex}
                    onChange={(e, v) => changeTab(v)}
                  >
                    <Tab label="Activate" id="tab-0" />
                    <Tab label="Deactivate" id="tab-1" />
                  </Tabs>
                </Paper>

                <div>
                  <Typography sx={{ color: "#ee82e5" }}>
                    This Event Action can be used to activate AND/OR deactivate a
                    Map Section and/or an individual Tile.
                  </Typography>
                  <Typography sx={{ color: "#ee82e5", marginTop:".5rem" }}>{msg}</Typography>

                  <div className="two-column-grid mt-p5">
                    <Accordion
                      defaultExpanded
                      sx={{ backgroundColor: "#281b40" }}
                    >
                      <AccordionSummary>
                        {tabIndex === 0 ? "Activate" : "Deactivate"} Map Section
                      </AccordionSummary>
                      <AccordionDetails>
                        <Select
                          value={selectedSection || ""}
                          onChange={(ev) => {
                            changeSection(ev.target.value);
                          }}
                        >
                          {mapSections.current.map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </AccordionDetails>
                    </Accordion>

                    <div>
                      <Accordion
                        defaultExpanded
                        sx={{ backgroundColor: "#281b40" }}
                      >
                        <AccordionSummary>
                          {tabIndex === 0 ? "Activate" : "Deactivate"}{" "}
                          Individual Tile
                        </AccordionSummary>
                        <AccordionDetails>
                          <Select
                            value={selectedTile}
                            onChange={(ev) => {
                              changeTile(ev.target.value);
                            }}
                          >
                            {mapTiles.current.map((item, index) => (
                              <MenuItem key={index} value={item}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </div>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button variant="contained" onClick={() => onOK()}>
              continue
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              color="error"
            >
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
