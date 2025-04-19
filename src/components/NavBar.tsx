import React from "react";
import "./NavBar.css";

// Define the props interface
interface NavBarProps {
  onToggleMenu: () => void; // Function that takes no args and returns nothing
}

// Simple placeholder for a hamburger icon (TS compatible)
const HamburgerIcon = (): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 6H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Use the props interface
function NavBar({ onToggleMenu }: NavBarProps): JSX.Element {
  // Type the event handler for the button click
  const handleToggleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // You could potentially use the event object here if needed
    onToggleMenu();
  };

  return (
    <header className="nav-bar">
      <button
        onClick={handleToggleClick} // Use the typed handler
        className="nav-bar__menu-button"
        aria-label="Toggle navigation menu"
      >
        <HamburgerIcon />
      </button>
      <div className="nav-bar__logo">Cutter.coach</div>
      <button className="nav-bar__signin-button">Sign In</button>
    </header>
  );
}

export default NavBar;
