import { useState, useRef, useEffect, useCallback } from "react";
//mui
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//icons
import DeleteIcon from "@mui/icons-material/Delete";
//components
import TileThumbnail from "./TileThumbnail";
//data
import { Expansion } from "../../lib/core";

const expansionNames = [
  "CORE",
  "TWIN SHADOWS",
  "RETURN TO HOTH",
  "THE BESPIN GAMBIT",
  "JABBA'S REALM",
  "HEART OF THE EMPIRE",
  "TYRANTS OF LOTHAL",
];

const tileCounts = [39, 12, 28, 12, 17, 18, 12];

export default function TileGallery() {
  // console.log("🚀 ~ TileGallery ~ RENDERED");
  const [selectedExpansion, setSelectedExpansion] = useState(0);

  //calculate tile array, side A or B, based on selected expansion
  const calculateTileArray = useCallback(
    (side, expansionIndex) => {
      // console.log("calculateTileData called");
      const tiles = [];
      const exp = Object.keys(Expansion)[expansionIndex];
      for (let i = 1; i <= tileCounts[expansionIndex]; i++) {
        tiles.push({
          imageSrc: `./Tiles/${exp}/${exp}_${i}${side.toUpperCase()}.webp`,
          name: `${exp} ${i}${side}`,
        });
      }
      return tiles;
    },
    [selectedExpansion]
  );

  const [open, setOpen] = useState(false);
  const callbackFunc = useRef(null);
  //selectedTile = { expansion, tileNumber, src, side }
  const [selectedTile, setSelectedTile] = useState(null);
  const [thumbnails, setThumbnails] = useState(null);
  const [selectedThumbs, setSelectedThumbs] = useState([]);
  const [tileQueue, setTileQueue] = useState([]);
  const [selectedSide, setSelectedSide] = useState("A");

  const calculateSelectedTileData = useCallback((tile) => {
    // console.log("🚀 ~ calculateSelectedTileData ~ tile:", tile)
    const expansion = tile.name.split(" ")[0];
    const src = tile.imageSrc;
    const side = tile.name.match(/.$/)[0];
    const tileNumber = tile.name.match(/\d+/)[0];
    return { expansion, tileNumber, src, side };
  }, []);

  //mouse handlers
  useEffect(() => {
    // console.log("🚀 ~ useEffect ~ SETUP handleMouseDown");
    const handleMouseDown = (ev) => {
      if (open) {
        // console.log("🚀 ~ useEffect ~ handleMouseDown");
        if (ev.target.classList.contains("tileGalleryThumbnail")) {
          ev.preventDefault();

          const tile = thumbnails.find((tile) => tile.name === ev.target.alt);
          setSelectedThumbs([ev.target.alt]);
          //if left click
          if (ev.button === 0) {
            setSelectedTile(calculateSelectedTileData(tile));
          }
          //if right click
          if (ev.button === 2) {
            //add thumb to queue
            setTileQueue([...tileQueue, calculateSelectedTileData(tile)]);
          }
        }
      }
    };

    const handleDoubleClick = (ev) => {
      if (open) {
        if (ev.target.classList.contains("tileGalleryThumbnail")) {
          ev.preventDefault();

          const tile = thumbnails.find((tile) => tile.name === ev.target.alt);
          callbackFunc.current([calculateSelectedTileData(tile)]);
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("dblclick", handleDoubleClick);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    //cleanup
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("dblclick", handleDoubleClick);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, [open, thumbnails, calculateSelectedTileData, tileQueue]);

  function showDialog(callback) {
    callbackFunc.current = callback;
    setSelectedThumbs([]);
    setSelectedTile(null);
    setTileQueue([]);
    setSelectedSide("A");
    setSelectedExpansion(0);
    setThumbnails(calculateTileArray("A", 0));
    setOpen(true);
  }
  TileGallery.ShowDialog = showDialog;

  function onOK() {
    callbackFunc.current([]);
    setOpen(false);
  }

  function addTileToQueue() {
    setTileQueue([...tileQueue, selectedTile]);
    setSelectedThumbs([]);
    setSelectedTile(null);
  }

  function onRemoveTileFromQueue(index) {
    setTileQueue(tileQueue.filter((x, idx) => index !== idx));
  }

  function onChangeSide(side) {
    setThumbnails(calculateTileArray(side, selectedExpansion));
    setSelectedSide(side);
  }

  function onChangeExpansion(value) {
    setThumbnails(calculateTileArray(selectedSide));
    setSelectedExpansion(value);
    setSelectedSide("A");
    setThumbnails(calculateTileArray("A", value));
  }

  return (
    <div style={{ height: "100%" }}>
      {open && (
        <Dialog
          closeAfterTransition={false}
          open={open}
          maxWidth={"lg"}
          fullWidth={true}
          scroll={"paper"}
          sx={{
            "& .MuiDialog-paper": {
              height: "70vh",
            },
          }}
        >
          <DialogTitle>Tile Gallery</DialogTitle>

          <DialogContent
            sx={{
              height: "100%",
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div className="tileGallery">
              {/* main thumb view */}
              <Paper
                sx={{
                  padding: ".5rem",
                  backgroundColor: "#472c61",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <div className="tileGalleryThumbView">
                  {thumbnails.map((tile, index) => (
                    <TileThumbnail
                      key={index}
                      src={tile.imageSrc}
                      alt={tile.name}
                      selectedThumbs={selectedThumbs}
                    />
                  ))}
                </div>
              </Paper>

              {/* right prop panel */}
              <Paper
                sx={{
                  padding: ".5rem",
                  backgroundColor: "#472c61",
                  overflowY: "auto",
                  height: "100%",
                }}
              >
                <div className="tileGalleryPanel">
                  {/* EXPANSION SELECT */}
                  <Paper sx={{ padding: "1rem" }}>
                    <div className="simple-column">
                      <Typography>Expansion</Typography>
                      <Select
                        value={selectedExpansion}
                        onChange={(e) => onChangeExpansion(e.target.value)}
                        fullWidth
                      >
                        {expansionNames.map((exp, index) => (
                          <MenuItem key={index} value={index}>
                            {exp}
                          </MenuItem>
                        ))}
                      </Select>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedSide === "A"}
                            onChange={(e) => {
                              onChangeSide(e.target.checked ? "A" : "B");
                            }}
                          />
                        }
                        label={`Side ${selectedSide}`}
                      />
                    </div>
                  </Paper>

                  {/* SELECTED TILE */}
                  <Paper sx={{ padding: "1rem" }}>
                    <div className="simple-column">
                      <Typography>Selected Tile</Typography>
                      <div className="two-column-grid">
                        <Typography>EXPANSION:</Typography>
                        <Typography>
                          {selectedTile?.expansion || "None"}
                        </Typography>
                      </div>
                      <div className="two-column-grid">
                        <Typography>TILE #:</Typography>
                        <Typography>
                          {selectedTile?.tileNumber || "None"}
                        </Typography>
                      </div>
                      <div className="two-column-grid">
                        <Typography>SIDE:</Typography>
                        <Typography>{selectedTile?.side || "None"}</Typography>
                      </div>
                      <Button
                        variant="contained"
                        disabled={selectedTile === null}
                        onClick={() => {
                          callbackFunc.current([selectedTile]);
                          setOpen(false);
                        }}
                      >
                        insert tile into map
                      </Button>
                      <Button
                        variant="contained"
                        disabled={selectedTile === null}
                        onClick={addTileToQueue}
                      >
                        add tile to queue
                      </Button>
                    </div>
                  </Paper>

                  {/* TILE QUEUE */}
                  <Paper
                    sx={{
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      flex: "1",
                      minHeight: "0",
                    }}
                  >
                    <Typography>Tile Queue</Typography>
                    <div
                      className="simple-column" //scrollbar
                      style={{
                        height: "100%",
                        overflowY: "auto",
                        scrollbarColor: "#bc56ff #4c4561",
                        scrollbarWidth: "thin",
                      }}
                    >
                      <List>
                        {tileQueue.map((tile, index) => (
                          <ListItem
                            key={index}
                            disablePadding
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() => onRemoveTileFromQueue(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            <ListItemButton>
                              <Typography>
                                {tile.expansion} {tile.tileNumber}
                                {tile.side}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </div>
                    <Button
                      variant="contained"
                      disabled={tileQueue.length === 0}
                      sx={{ marginTop: ".5rem" }}
                      onClick={() => {
                        callbackFunc.current(tileQueue);
                        setOpen(false);
                      }}
                    >
                      insert queue
                    </Button>
                  </Paper>
                </div>
              </Paper>
            </div>
          </DialogContent>

          <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
            <Button variant="contained" onClick={() => onOK()}>
              close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
