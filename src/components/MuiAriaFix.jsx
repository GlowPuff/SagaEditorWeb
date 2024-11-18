import PropTypes from "prop-types";
import { useEffect } from "react";

//fix mui root aria hidden label bug
export default function MuiAriaFix({ rootSelector }) {
  const root = document.querySelector(rootSelector);

  useEffect(() => {
    if (!root) {
      console.error("MuiAriaFix couldn't find the element.");
      return;
    }

    const observer = new MutationObserver(() => {
      if (root.getAttribute("aria-hidden")) {
        root.removeAttribute("aria-hidden");
      }
    });

    observer.observe(root, {
      attributeFilter: ["aria-hidden"],
    });

    return () => {
      observer.disconnect();
    };
  }, [root]);

  return null;
}

MuiAriaFix.propTypes = {
  rootSelector: PropTypes.string,
};
