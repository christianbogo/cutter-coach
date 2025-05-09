import React from "react";
import { Link } from "react-router-dom";

import Pointer from "../graphics/nucleo/primary/pointer.svg";
import SiteLogo from "../graphics/logo.svg";
import Heart from "../graphics/nucleo/primary/heart.svg";

import "../styles/Nav.css";

interface NavBarProps {
  onToggleMenu: () => void;
}

function NavBar({ onToggleMenu }: NavBarProps): React.ReactElement {
  const handleToggleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    onToggleMenu();
  };

  return (
    <header className="nav-bar">
      <div className="nav-content">
        <button
          onClick={handleToggleClick}
          className="menu-button"
          aria-label="Toggle navigation menu"
        >
          <img className="nav-icon" src={Pointer} alt="Navigation Toggle" />
        </button>

        <Link to="/" aria-label="Go to homepage">
          <img
            className="nav-icon site-logo"
            src={SiteLogo}
            alt="Cutter's Coaching Logo"
          />
        </Link>

        <Link
          to="/support"
          className="menu-button"
          aria-label="Go to support page"
        >
          <img className="nav-icon" src={Heart} alt="Support" />
        </Link>
      </div>
    </header>
  );
}

export default NavBar;
