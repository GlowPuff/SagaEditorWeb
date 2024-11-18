import PropTypes from "prop-types";
//mui
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Formatting({ isOpen }) {
  return (
    <Paper sx={{ padding: ".5rem", display: isOpen ? "block" : "none" }}>
      <Typography variant="button">special text formatting</Typography>

      <Paper
        sx={{
          padding: ".5rem",
          backgroundColor: "#312949",
          marginBottom: ".5rem",
        }}
      >
        <div className="triple-column-grid">
          {/* BOLD */}
          <span className="lime">Bold Text</span>
          <span className="orange center">&lt;b&gt;Example&lt;/b&gt;</span>
          <span>
            <b>Example</b>
          </span>
          {/* ITALIC */}
          <span className="lime">Italic Text</span>
          <span className="orange center">&lt;i&gt;Example&lt;/i&gt;</span>
          <span>
            <i>Example</i>
          </span>
          {/* COLOR */}
          <span className="lime">Colored Text</span>
          <span className="orange center">
            &lt;color=&quot;red&quot;&gt;Example&lt;/color&gt;
          </span>
          <span>Example</span>
          {/* COLOR */}
          <span className="lime">Indented Text With Bullet</span>
          <span className="orange center">{`{-} Example`}</span>
          <span className="red">■ Example</span>
        </div>
      </Paper>

      <Paper sx={{ padding: ".5rem", backgroundColor: "#312949" }}>
        <div className="triple-column-grid">
          {/* TRIGGER VALUE */}
          <span className="lime">Print Trigger&apos;s Value</span>
          <span className="orange center">Example &trigger name&</span>
          <span className="">Example 2</span>
          {/* THREAT MULT */}
          <span className="lime">Print Threat Multiplier&apos;s Value</span>
          <span className="orange center">Threat(2) X 3 is *3*</span>
          <span>Threat(2) X 3 is 6</span>
          {/* RANDOM REBEL NAME */}
          <span className="lime">Print Random Rebel Name</span>
          <span className="orange center">{`Hello {Rebel}`}</span>
          <span>Hello Diala</span>
        </div>
      </Paper>
    </Paper>
  );
}

Formatting.propTypes = {
  isOpen: PropTypes.bool,
};
