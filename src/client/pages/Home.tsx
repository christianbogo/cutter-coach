import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteLogo from "../graphics/logo.svg";
import ArrowRight from "../graphics/nucleo/primary/arrow-right.svg";

import "../styles/Home.css";

function Home(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      navigate(`/athletes?search=${encodeURIComponent(trimmedSearchTerm)}`);
    } else {
      navigate("/athletes");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="page">
      <section className="hero-section">
        <img
          src={SiteLogo}
          alt="Cutter's Coaching Logo"
          className="hero-logo"
        />
        <h1 className="hero-title">Coach Cutter's Database</h1>
        <p className="hero-subtitle">
          Tracking team data for related programs.
        </p>
        <Link to="/about" className="hero-learn-more">
          Learn More{" "}
          <img className="hero-arrow-icon" src={ArrowRight} alt="->" />
        </Link>
      </section>

      <section className="athlete-finder-section">
        <h2 className="athlete-finder-title">Athlete Finder</h2>
        <div className="athlete-finder-input-group">
          <input
            type="text"
            placeholder="Search for an athlete..."
            className="athlete-finder-input"
            aria-label="Athlete Search Input"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="athlete-finder-button"
            onClick={handleSearchClick}
          >
            Search Database
          </button>
        </div>
      </section>

      <section className="disclaimer-section">
        <h2 className="disclaimer-title">Disclaimer</h2>
        <div className="disclaimer-content">
          <p className="disclaimer-text">
            Please note: Cutter's Coaching is currently a work-in-progress.
            Information presented may not always be fully up-to-date or
            comprehensive.
          </p>
          <p className="disclaimer-text">
            The database primarily focuses on specific teams and meets and does
            not include all historical data from USA Swimming.
          </p>
          <p className="disclaimer-text">
            As with any active development project, website bugs or unexpected
            behavior may occur. Your patience is appreciated! To report any
            issues, please reach out to the developer,{" "}
            <a
              href="https://gravatar.com/christianbcutter"
              target="_blank"
              rel="noopener noreferrer"
              className="disclaimer-link"
            >
              Christian Cutter
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
