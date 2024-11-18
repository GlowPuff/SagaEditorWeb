import { useState, useRef, memo, useCallback } from "react";
import PropTypes from "prop-types";
//mui
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
//data
import { NoneThumb, ThumbnailData } from "../../data/Mission";

const filters = {
  //custom icons
  All: 0,
  Rebel: 1,
  Imperial: 2,
  Mercenary: 3,
  //stock
  Heroes: 4,
  Allies: 5,
  Imperials: 6,
  Villains: 7,
};

const initialList = [
  //custom icons
  ...ThumbnailData.CustomOther,
  ...ThumbnailData.CustomRebel,
  ...ThumbnailData.CustomMercenary,
  ...ThumbnailData.CustomImperial,
  //stock icons
  ...ThumbnailData.StockHero,
  ...ThumbnailData.StockAlly,
  ...ThumbnailData.StockImperial,
  ...ThumbnailData.StockVillain,
];

const thumbFolder = (id) => {
  if (id.toLowerCase().includes("customimperial")) return "Imperial";
  if (id.toLowerCase().includes("customrebel")) return "Rebel";
  if (id.toLowerCase().includes("custommercenary")) return "Mercenary";
  if (id.toLowerCase().includes("stockhero")) return "StockHero";
  if (id.toLowerCase().includes("stockally")) return "StockAlly";
  if (id.toLowerCase().includes("stockimperial")) return "StockImperial";
  if (id.toLowerCase().includes("stockvillain")) return "StockVillain";
  return "Other";
};

const ThumbnailSelector = memo(function ThumbnailSelector({
  showDefaultButton = false,
  onIconChanged,
  initialThumb,
}) {
  const [filter, setFilter] = useState(filters.All);
  const [thumbList, setThumbList] = useState(initialList);
  const [selectedIndex, setSelectedIndex] = useState(
    initialList.findIndex((x) => x.ID === initialThumb.ID)
  );
  const [selectedThumb, setSelectedThumb] = useState(initialThumb);

  const currentFilteredList = useRef(initialList);
  const filterTextRef = useRef();

  const handleIconChange = useCallback(
    (thumbnail) => {
      onIconChanged(thumbnail);
    },
    [onIconChanged]
  );

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) {
      ev.target.blur();
      if (ev.target.name === "textFilter") {
        filterTextRef.current.value = "";
        setThumbList([...currentFilteredList.current]);
      }
    }
  }

  const useDefaultClick = useCallback(() => {
    handleIconChange(NoneThumb);
    onSetFilter(filters.All);
    setSelectedThumb(NoneThumb);
  }, [handleIconChange]);

  function thumbSelectClick(index) {
    setSelectedIndex(index);
    setSelectedThumb(thumbList[index]);
    handleIconChange(thumbList[index]);
  }

  function onSetFilter(filter) {
    setFilter(filter);
    switch (filter) {
      case filters.All: {
        setThumbList(initialList);
        setSelectedThumb(initialList[0]);
        currentFilteredList.current = [...initialList];
        break;
      }
      case filters.Rebel: {
        //custom Rebel
        setThumbList([...ThumbnailData.CustomRebel]);
        setSelectedThumb(ThumbnailData.CustomRebel[0]);
        currentFilteredList.current = [...ThumbnailData.CustomRebel];
        break;
      }
      case filters.Imperial: {
        //custom Imperial
        setThumbList([...ThumbnailData.CustomImperial]);
        setSelectedThumb(ThumbnailData.CustomImperial[0]);
        currentFilteredList.current = [...ThumbnailData.CustomImperial];
        break;
      }
      case filters.Mercenary: {
        //custom Mercenary
        setThumbList([...ThumbnailData.CustomMercenary]);
        setSelectedThumb(ThumbnailData.CustomMercenary[0]);
        currentFilteredList.current = [...ThumbnailData.CustomMercenary];
        break;
      }
      case filters.Heroes: {
        //stock Heroes
        setThumbList([...ThumbnailData.StockHero]);
        setSelectedThumb(ThumbnailData.StockHero[0]);
        currentFilteredList.current = [...ThumbnailData.StockHero];
        break;
      }
      case filters.Allies: {
        //stock allies
        setThumbList([...ThumbnailData.StockAlly]);
        setSelectedThumb(ThumbnailData.StockAlly[0]);
        currentFilteredList.current = [...ThumbnailData.StockAlly];
        break;
      }
      case filters.Imperials: {
        //stock Heroes
        setThumbList([...ThumbnailData.StockImperial]);
        setSelectedThumb(ThumbnailData.StockImperial[0]);
        currentFilteredList.current = [...ThumbnailData.StockImperial];
        break;
      }
      case filters.Villains: {
        //stock Heroes
        setThumbList([...ThumbnailData.StockVillain]);
        setSelectedThumb(ThumbnailData.StockVillain[0]);
        currentFilteredList.current = [...ThumbnailData.StockVillain];
        break;
      }
    }
    setSelectedIndex(0);
    filterTextRef.current.value = "";
  }

  function updateTextFilter(value) {
    setThumbList(
      currentFilteredList.current.filter((x) =>
        x.Name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  return (
    <>
      <div>
        {showDefaultButton && (
          <Button variant="contained" onClick={useDefaultClick}>
            use default thumbnail
          </Button>
        )}
      </div>

      <Typography sx={{ marginTop: ".5rem" }}>
        Filter From Custom Icon Collection:
      </Typography>
      <div className="quad-column-grid">
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.All}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.All);
              }}
            />
          }
          label="All"
        />
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.Rebel}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.Rebel);
              }}
            />
          }
          label="Rebel"
        />
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.Imperial}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.Imperial);
              }}
            />
          }
          label="Imperial"
        />
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.Mercenary}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.Mercenary);
              }}
            />
          }
          label="Mercenary"
        />
      </div>

      <Typography>Filter From Stock Icon Collection:</Typography>
      <div className="quad-column-grid">
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.Heroes}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.Heroes);
              }}
            />
          }
          label="Heroes"
        />
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.Villains}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.Villains);
              }}
            />
          }
          label="Villains"
        />
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.Allies}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.Allies);
              }}
            />
          }
          label="Allies"
        />
        <FormControlLabel
          control={
            <Checkbox
              radioGroup="filter"
              checked={filter === filters.Imperials}
              onChange={(e) => {
                if (e.target.checked) onSetFilter(filters.Imperials);
              }}
            />
          }
          label="Imperials"
        />
      </div>

      {/* THUMB IMAGE */}
      <div className="label-text">
        <img
          className="thumbnail"
          src={
            selectedThumb.ID !== "None"
              ? `./Thumbnails/${thumbFolder(selectedThumb.ID)}/${
                  selectedThumb.ID
                }.png`
              : "./Thumbnails/cancel.png"
          }
        />
        <Typography>{selectedThumb.Name}</Typography>
      </div>

      {/* NAME FILTER */}
      <TextField
        name="textFilter"
        label={"Filter Thumbnails By Name"}
        variant="filled"
        onChange={(e) => updateTextFilter(e.target.value)}
        onFocus={(e) => e.target.select()}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: ".5rem", marginTop: ".5rem" }}
        inputRef={filterTextRef}
      />

      <List
        sx={{
          paddingRight: ".5rem",
          overflow: "hidden auto",
          scrollbarColor: "#bc56ff #4c4561",
          scrollbarWidth: "thin",
          maxHeight: "10rem",
        }}
      >
        {thumbList.length > 0 &&
          thumbList.map((item, index) => (
            <ListItem
              disablePadding
              key={index}
              value={item.Name}
              onClick={() => thumbSelectClick(index)}
            >
              <ListItemButton selected={selectedIndex === index}>
                {item.Name}
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </>
  );
});

ThumbnailSelector.propTypes = {
  showDefaultButton: PropTypes.bool,
  onIconChanged: PropTypes.func,
  initialThumb: PropTypes.object,
};

export default ThumbnailSelector;
