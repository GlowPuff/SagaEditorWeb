import PropTypes from "prop-types";
import { Paper, Select, MenuItem } from "@mui/material";

export default function Footer({ languageID, onSetLanguage }) {
  function handleChange(event) {
    onSetLanguage(event.target.value);
  }

  function getLanguages() {
    let languages = [
      "English (EN)",
      "German (DE)",
      "Spanish (ES)",
      "French (FR)",
      "Polski (PL)",
      "Italian (IT)",
      "Magyar (HU)",
      "Norwegian (NO)",
      "Russian (RU)",
      "Dutch (NL)",
    ];
    return languages.map((item, index) => (
      <MenuItem key={index} value={item}>
        {item}
      </MenuItem>
    ));
  }

  return (
    <div className="footer">
      <Paper sx={{ padding: ".5rem" }}>
        <div className="footer__content">
          <div style={{ justifySelf: "left", paddingLeft: ".5rem" }}>
            ICEditor Version: 1.0 (Beta 7)
          </div>

          <div style={{ color: "orange" }}>
            Report any issues{" "}
            <a
              style={{ color: "red" }}
              href="https://github.com/GlowPuff/SagaEditorWeb/issues"
            >
              here
            </a>
            .
          </div>

          <Select
            sx={{ justifySelf: "right", marginRight: ".5rem" }}
            value={languageID}
            onChange={handleChange}
            displayEmpty
          >
            {getLanguages()}
          </Select>
        </div>
      </Paper>
    </div>
  );
}

Footer.propTypes = {
  languageID: PropTypes.string,
  onSetLanguage: PropTypes.func,
};
