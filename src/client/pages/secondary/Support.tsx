import React from "react";
import "../../styles/Support.css";

import SupportIcon from "../../graphics/nucleo/primary/heart.svg";

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
        </div>
        <p className="support-thank-you">Thank you for your generosity!</p>
      </div>
    </div>
  );
}

export default Support;
