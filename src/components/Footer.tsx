import React from "react";

// Import the CSS for the footer
import "../styles/Footer.css";

// Define the Footer component
function Footer(): React.ReactElement {
  const version = "0.0.1"; // Define version number

  return (
    // Use the semantic footer tag
    <footer className="footer">
      {/* Version number paragraph */}
      <p className="footer-version">v{version}</p>
      {/* Managed by paragraph */}
      <p className="footer-managed-by">
        Managed by{" "}
        <a
          href="https://gravatar.com/christianbcutter"
          target="_blank" // Open link in a new tab
          rel="noopener noreferrer" // Security measure for target="_blank"
          className="footer-link" // Specific class for styling the link
        >
          Christian Cutter
        </a>
      </p>
    </footer>
  );
}

export default Footer;
