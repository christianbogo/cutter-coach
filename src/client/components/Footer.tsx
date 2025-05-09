import React from "react";
import "../styles/Footer.css";

function Footer(): React.ReactElement {
  const version = "0.0.1";

  return (
    <footer className="footer">
      <p className="footer-version">v{version}</p>
      <p className="footer-managed-by">
        Managed by{" "}
        <a
          href="https://gravatar.com/christianbcutter"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Christian Cutter
        </a>
      </p>
    </footer>
  );
}

export default Footer;
