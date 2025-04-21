import React from "react";
import { Link } from "react-router-dom";
import SiteLogo from "../assets/logo.svg";
import ArrowRight from "../assets/nucleo/primary/20-arrow-right.svg";
import Programs from "../components/Programs";
import "../styles/Home.css";

function Home(): React.ReactElement {
  const handleSearchClick = () => {
    console.log("Navigate to /search page (to be implemented)");
  };

  return (
    <div className="home-container">
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

      <Programs />

      <section className="disclaimer-section">
        <h2 className="disclaimer-title">Disclaimer</h2>
        <div className="disclaimer-content card">
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
