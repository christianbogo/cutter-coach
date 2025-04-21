import React from "react";
import { Link } from "react-router-dom"; // Import the Link component

import Pointer from "../assets/nucleo/primary/20-pointer.svg";
import SiteLogo from "../assets/logo.svg";
import Heart from "../assets/nucleo/primary/20-heart.svg";

import "../styles/NavBar.css";

interface NavBarProps {
  onToggleMenu: () => void; // Function that takes no args and returns nothing
}

function NavBar({ onToggleMenu }: NavBarProps): React.ReactElement {
  const handleToggleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    onToggleMenu();
  };

  return (
    <header className="nav-bar">
      {/* Menu Toggle Button */}
      <button
        onClick={handleToggleClick}
        className="nav-bar__menu-button"
        aria-label="Toggle navigation menu"
      >
        <img className="nav-icon" src={Pointer} alt="Navigation Toggle" />
      </button>

      {/* Site Logo Link to Home */}
      <Link
        to="/home"
        className="nav-bar__logo-link"
        aria-label="Go to homepage"
      >
        <img
          className="nav-icon site-logo"
          src={SiteLogo}
          alt="Cutter's Coaching Logo"
        />
      </Link>

      {/* Support Link */}
      <Link
        to="/support"
        className="nav-bar__support-link"
        aria-label="Go to support page"
      >
        <img className="nav-icon" src={Heart} alt="Support" />
      </Link>
    </header>
  );
}

export default NavBar;
