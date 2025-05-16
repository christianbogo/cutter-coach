import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import XMarkSM from "../graphics/nucleo/primary/xmark-sm.svg";
import House from "../graphics/nucleo/primary/house.svg";
import User from "../graphics/nucleo/primary/user.svg";
import Users from "../graphics/nucleo/primary/users.svg";
import Database from "../graphics/nucleo/primary/database.svg";
import Atom from "../graphics/nucleo/primary/atom.svg";

import "../styles/Nav.css";

interface SubMenuItem {
  label: string;
}

interface NavItemStructure {
  id: string;
  path: string;
  icon: string;
  label: string;
  subItems: SubMenuItem[];
}

const navItemsData: NavItemStructure[] = [
  {
    id: "home",
    path: "/",
    icon: House,
    label: "Home",
    subItems: [
      { label: "Welcome Page" },
      { label: "Latest News" },
      { label: "Recent Uploads" },
    ],
  },
  {
    id: "teams",
    path: "/team",
    icon: Users,
    label: "Teams",
    subItems: [
      { label: "Program Summaries" },
      { label: "Team & Season Records" },
      { label: "Top Times" },
    ],
  },
  {
    id: "athletes",
    path: "/athletes",
    icon: User,
    label: "Athletes",
    subItems: [
      { label: "Athlete Finder" },
      { label: "Personal Bests" },
      { label: "Performance Metrics" },
    ],
  },
  {
    id: "about",
    path: "/about",
    icon: Atom,
    label: "About",
    subItems: [
      { label: "My Philosophy" },
      { label: "What I Aim To Solve" },
      { label: "Tech Portfolio" },
    ],
  },
  {
    id: "admin",
    path: "/admin-check",
    icon: Database,
    label: "Admin",
    subItems: [
      { label: "DB Maintenance" },
      { label: "Result Upload" },
      { label: "Report Generation" },
    ],
  },
];

interface NavMenuProps {
  isOpen: boolean;
  onCloseMenu: () => void;
}

function NavMenu({ isOpen, onCloseMenu }: NavMenuProps): React.ReactElement {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
          {navItemsData.map((item) => (
            <li key={item.id} className="nav-menu-item">
              <Link
                to={item.path}
                className="nav-menu-link"
                onClick={handleLinkClick}
              >
                <img
                  className="nav-menu-icon"
                  src={item.icon}
                  alt={`${item.label} icon`}
                />
                <span>{item.label}</span>
              </Link>
              {item.subItems && item.subItems.length > 0 && (
                <ul className="nav-submenu-list">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.label} className="nav-submenu-item">
                      <span className="nav-submenu-link">{subItem.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default NavMenu;
