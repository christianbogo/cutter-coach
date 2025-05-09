import React from "react";
import "../../styles/Support.css"; // Import the corresponding CSS

import SupportIcon from "../../graphics/nucleo/primary/20-heart.svg"; // Example icon

function Support(): React.ReactElement {
  return (
    <div className="support-page-container">
      <div className="support-card">
        <img src={SupportIcon} alt="Support Icon" className="support-icon" />

        <h1 className="support-title">Support Cutter's Coaching</h1>
        <p className="support-text">
          If you find my site helpful, consider showing your support! You can
          send support via Venmo:
        </p>
        <div className="support-venmo-info">
          <span className="support-venmo-handle">@christianbogo</span>
          {/* You could add a QR code image here if desired */}
          {/* <img src="/path/to/venmo-qr.png" alt="Venmo QR Code" className="venmo-qr" /> */}
        </div>
        <p className="support-thank-you">Thank you for your generosity!</p>
      </div>
    </div>
  );
}

export default Support;
