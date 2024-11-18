import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//dialogs
import EditGroupDialog from "../Dialogs/EditGroupDialog";
//data
import EnemyFilterList from "../SubComponents/EnemyFilterList";
import * as Mission from "../../data/Mission";
import { enemyData, villainData } from "../../data/carddata";
import { useReservedGroupsStore } from "../../data/dataStore";

let enemyGroupData = [...enemyData, ...villainData];

export default function EnemyGroupPanel({
  value,
  index,
  initialGroups,
  onModifyEnemyGroups,
}) {
  //reserved group store
  const reservedGroups = useReservedGroupsStore(
    (state) => state.reservedGroups
  );
  const addResGroup = useReservedGroupsStore((state) => state.addGroup);
  const removeResGroup = useReservedGroupsStore((state) => state.removeGroup);

  function onAddInitial(g) {
    let group = new Mission.EnemyGroupData();
    group.cardName = g[0];
    group.cardID = g[1];
    onModifyEnemyGroups({ type: "initial", command: "add", group: group });
  }

  function onAddReserved(g) {
    let group = new Mission.EnemyGroupData();
    group.cardName = g[0];
    group.cardID = g[1];
    addResGroup(group);
  }

  function onModifyGroup(type, command, index, group) {
    if (command === "edit") {
      EditGroupDialog.ShowDialog(group, (g) => {
        onModifyEnemyGroups({
          type: type,
          command: "edit",
          index: index,
          group: g,
        });
      });
    } else onModifyEnemyGroups({ type: type, command: command, index: index });
  }

  return (
    <div hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && (
        <div className="mission-panel">
          {/* LEFT SIDE */}
          <Paper sx={{ padding: "1rem" }}>
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1-header"
              >
                Add Initial / Reserved Group
              </AccordionSummary>
              <AccordionDetails>
                <EnemyFilterList
                  alternateView={true}
                  onAddInitial={(g) => onAddInitial(g)}
                  onAddReserved={(g) => onAddReserved(g)}
                />
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* RIGHT SIDE */}
          <Paper sx={{ padding: "1rem" }}>
            {/* INITIAL */}
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1-header"
              >
                Initial Groups
              </AccordionSummary>
              <AccordionDetails>
                {initialGroups.map((item, index) => (
                  <div className="group-grid" key={index}>
                    {item.useInitialGroupCustomName
                      ? `${item.cardName} : ${item.cardID}`
                      : `${
                          enemyGroupData.find((x) => x.id === item.cardID).name
                        } : ${
                          enemyGroupData.find((x) => x.id === item.cardID).id
                        }`}
                    <Tooltip title="Edit Group">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          onModifyGroup("initial", "edit", index, item)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Group">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          onModifyGroup("initial", "remove", index)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* RESERVED */}
            <Accordion
              defaultExpanded
              sx={{ marginBottom: ".5rem", backgroundColor: "#281b40" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1-header"
              >
                Reserved Groups
              </AccordionSummary>
              <AccordionDetails>
                {reservedGroups.map((item, index) => (
                  <div className="group-grid" key={index}>
                    {`${item.cardName} : ${item.cardID}`}
                    <Tooltip title="Remove Group">
                      <IconButton
                        edge="end"
                        onClick={
                          () => removeResGroup(index)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}{" "}
              </AccordionDetails>
            </Accordion>
          </Paper>
        </div>
      )}

      <EditGroupDialog />
    </div>
  );
}

EnemyGroupPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  initialGroups: PropTypes.array,
  onModifyEnemyGroups: PropTypes.func,
};
