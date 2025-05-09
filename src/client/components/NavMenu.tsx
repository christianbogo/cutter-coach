import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import XMarkSM from "../graphics/nucleo/primary/xmark-sm.svg";
import House from "../graphics/nucleo/primary/house.svg";
import User from "../graphics/nucleo/primary/user.svg";
import Users from "../graphics/nucleo/primary/users.svg";
import Database from "../graphics/nucleo/primary/database.svg";
import OrderedList from "../graphics/nucleo/primary/ordered-list.svg";
import Atom from "../graphics/nucleo/primary/atom.svg";
import "../styles/NavMenu.css";

interface NavMenuProps {
  isOpen: boolean;
  onCloseMenu: () => void;
}

function NavMenu({ isOpen, onCloseMenu }: NavMenuProps): React.ReactElement {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onCloseMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCloseMenu]);

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
    event.stopPropagation();
  };

  const handleCloseButtonClick = (): void => {
    onCloseMenu();
  };

  const overlayClassName = `nav-menu-overlay ${isOpen ? "is-open" : ""}`;

  return (
    <div className={overlayClassName} onClick={handleOverlayClick}>
      <nav className="nav-menu-content" onClick={handleContentClick}>
        <button
          className="nav-menu-close-button"
          onClick={handleCloseButtonClick}
          aria-label="Close navigation menu"
        >
          <img className="nav-menu-icon" src={XMarkSM} alt="Close" />
        </button>
        <ul className="nav-menu-list">
          <li className="nav-menu-item">
            <Link
              to="/home"
              className="nav-menu-link"
              onClick={handleLinkClick}
            >
              <img className="nav-menu-icon" src={House} alt="" />
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
