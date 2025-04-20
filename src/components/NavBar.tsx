import React from "react";

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
      <button
        onClick={handleToggleClick} // Use the typed handler
        className="nav-bar__menu-button"
        aria-label="Toggle navigation menu"
      >
        <img className="nav-icon" src={Pointer} alt="Navigation" />
      </button>
      <img className="nav-icon site-logo" src={SiteLogo} alt="Site Logo" />
      <img className="nav-icon" src={Heart} alt="Heart Icon" />
    </header>
  );
}

export default NavBar;
