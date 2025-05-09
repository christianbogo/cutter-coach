import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// Requirement 1: Use new Nucleo SVGs
import XMarkSM from "../graphics/nucleo/primary/20-xmark-sm.svg";
import House from "../graphics/nucleo/primary/20-house.svg";
import User from "../graphics/nucleo/primary/20-user.svg";
import Users from "../graphics/nucleo/primary/20-users.svg";
import Database from "../graphics/nucleo/primary/20-database.svg";
import OrderedList from "../graphics/nucleo/primary/20-ordered-list.svg";
import Atom from "../graphics/nucleo/primary/20-atom.svg";

// Requirement 3: Use hyphenated class names in CSS file
import "../styles/NavMenu.css";

// Props interface remains the same
interface NavMenuProps {
  isOpen: boolean;
  onCloseMenu: () => void;
}

function NavMenu({ isOpen, onCloseMenu }: NavMenuProps): React.ReactElement {
  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onCloseMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent background scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Restore scroll
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Ensure scroll is restored on unmount
    };
  }, [isOpen, onCloseMenu]); // Re-run effect when isOpen changes

  const handleLinkClick = (): void => {
    onCloseMenu();
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (event.target === event.currentTarget) {
      onCloseMenu();
    }
  };

  const handleContentClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation(); // Prevent clicks inside content from closing menu
  };

  const handleCloseButtonClick = (): void => {
    // No event needed if not used
    onCloseMenu();
  };

  // Dynamically add 'is-open' class for CSS transitions
  const overlayClassName = `nav-menu-overlay ${isOpen ? "is-open" : ""}`;

  return (
    // Requirement 5: Overlay covers entire screen (handled by CSS)
    <div className={overlayClassName} onClick={handleOverlayClick}>
      {/* Requirement 6: Content slides in (handled by CSS) */}
      <nav className="nav-menu-content" onClick={handleContentClick}>
        <button
          className="nav-menu-close-button"
          onClick={handleCloseButtonClick}
          aria-label="Close navigation menu"
        >
          {/* Use imported XMark SVG */}
          <img className="nav-menu-icon" src={XMarkSM} alt="Close" />
        </button>
        <ul className="nav-menu-list">
          {/* Requirement 2: Icons left of text, both large */}
          <li className="nav-menu-item">
            <Link
              to="/home"
              className="nav-menu-link"
              onClick={handleLinkClick}
            >
              <img className="nav-menu-icon" src={House} alt="" />{" "}
              {/* Alt can be empty for decorative icons */}
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/athletes"
              className="nav-menu-link"
              onClick={handleLinkClick}
            >
              <img className="nav-menu-icon" src={User} alt="" />
              <span>Athletes</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/teams"
              className="nav-menu-link"
              onClick={handleLinkClick}
            >
              <img className="nav-menu-icon" src={Users} alt="" />
              <span>Teams</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/results"
              className="nav-menu-link"
              onClick={handleLinkClick}
            >
              <img className="nav-menu-icon" src={Database} alt="" />
              <span>Results</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/records"
              className="nav-menu-link"
              onClick={handleLinkClick}
            >
              <img className="nav-menu-icon" src={OrderedList} alt="" />
              <span>Records</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/about"
              className="nav-menu-link"
              onClick={handleLinkClick}
            >
              <img className="nav-menu-icon" src={Atom} alt="" />
              <span>About</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavMenu;
