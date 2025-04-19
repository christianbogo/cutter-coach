import React from "react";
import { Link } from "react-router-dom";
import "./NavMenu.css";

// Define the props interface
interface NavMenuProps {
  isOpen: boolean;
  onCloseMenu: () => void;
}

// Simple placeholder for a close icon (TS compatible)
const CloseIcon = (): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function NavMenu({ isOpen, onCloseMenu }: NavMenuProps): JSX.Element | null {
  // Component can return JSX or null
  if (!isOpen) {
    return null;
  }

  // Type the link click handler (no event needed here)
  const handleLinkClick = (): void => {
    onCloseMenu();
  };

  // Type the overlay click handler
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    // Check if the click was directly on the overlay, not on the content inside
    if (event.target === event.currentTarget) {
      onCloseMenu();
    }
  };

  // Type the content click handler to stop propagation
  const handleContentClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
  };

  // Type the close button click handler
  const handleCloseButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    onCloseMenu();
  };

  return (
    // Use the typed overlay handler
    <div className="nav-menu__overlay" onClick={handleOverlayClick}>
      {/* Use the typed content handler */}
      <nav className="nav-menu__content" onClick={handleContentClick}>
        <button
          className="nav-menu__close-button"
          onClick={handleCloseButtonClick} // Use the typed handler
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </button>
        <ul className="nav-menu__list">
          <li className="nav-menu__item">
            <Link
              to="/home"
              className="nav-menu__link"
              onClick={handleLinkClick}
            >
              Home
            </Link>
          </li>
          <li className="nav-menu__item">
            <Link
              to="/teams"
              className="nav-menu__link"
              onClick={handleLinkClick}
            >
              Teams
            </Link>
          </li>
          <li className="nav-menu__item">
            <Link
              to="/results"
              className="nav-menu__link"
              onClick={handleLinkClick}
            >
              Results
            </Link>
          </li>
          <li className="nav-menu__item">
            <Link
              to="/records"
              className="nav-menu__link"
              onClick={handleLinkClick}
            >
              Records
            </Link>
          </li>
          <li className="nav-menu__item">
            <Link
              to="/about"
              className="nav-menu__link"
              onClick={handleLinkClick}
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavMenu;
